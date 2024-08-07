import gzip
import json
import mimetypes
import os
import tarfile
import tempfile
from datetime import datetime
from typing import Any, Optional

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, ValidationInfo, field_validator, model_validator
from pymongo import UpdateOne

from subsetter.app.adapters.hydroshare import HydroshareMetadataAdapter
from subsetter.app.db import User
from subsetter.app.routers.utils import metadata_file_path, minio_client
from subsetter.app.users import current_active_user

router = APIRouter()


class SearchQuery(BaseModel):
    term: Optional[str] = None
    sortBy: Optional[str] = None
    reverseSort: bool = True
    contentType: Optional[str] = None
    providerName: Optional[str] = None
    creatorName: Optional[str] = None
    dataCoverageStart: Optional[int] = None
    dataCoverageEnd: Optional[int] = None
    publishedStart: Optional[int] = None
    publishedEnd: Optional[int] = None
    hasPartName: Optional[str] = None
    isPartOfName: Optional[str] = None
    associatedMediaName: Optional[str] = None
    fundingGrantName: Optional[str] = None
    fundingFunderName: Optional[str] = None
    creativeWorkStatus: Optional[str] = None
    pageNumber: int = 1
    pageSize: int = 30

    @field_validator('*')
    def empty_str_to_none(cls, v, info: ValidationInfo):
        if info.field_name == 'term' and v:
            return v.strip()

        if isinstance(v, str) and v.strip() == '':
            return None
        return v

    @field_validator('dataCoverageStart', 'dataCoverageEnd', 'publishedStart', 'publishedEnd')
    def validate_year(cls, v, info: ValidationInfo):
        if v is None:
            return v
        try:
            datetime(v, 1, 1)
        except ValueError:
            raise ValueError(f'{info.field_name} is not a valid year')

        return v

    @model_validator(mode='after')
    def validate_date_range(self):
        if self.dataCoverageStart and self.dataCoverageEnd and self.dataCoverageEnd < self.dataCoverageStart:
            raise ValueError('dataCoverageEnd must be greater or equal to dataCoverageStart')
        if self.publishedStart and self.publishedEnd and self.publishedEnd < self.publishedStart:
            raise ValueError('publishedEnd must be greater or equal to publishedStart')

    @field_validator('pageNumber', 'pageSize')
    def validate_page(cls, v, info: ValidationInfo):
        if v <= 0:
            raise ValueError(f'{info.field_name} must be greater than 0')
        return v

    @property
    def _filters(self):
        filters = []
        if self.publishedStart:
            filters.append(
                {
                    'range': {
                        'path': 'datePublished',
                        'gte': datetime(self.publishedStart, 1, 1),
                    },
                }
            )
        if self.publishedEnd:
            filters.append(
                {
                    'range': {
                        'path': 'datePublished',
                        'lt': datetime(self.publishedEnd + 1, 1, 1),  # +1 to include all of the publishedEnd year
                    },
                }
            )

        if self.dataCoverageStart:
            filters.append(
                {'range': {'path': 'temporalCoverage.startDate', 'gte': datetime(self.dataCoverageStart, 1, 1)}}
            )
        if self.dataCoverageEnd:
            filters.append(
                {'range': {'path': 'temporalCoverage.endDate', 'lt': datetime(self.dataCoverageEnd + 1, 1, 1)}}
            )
        return filters

    @property
    def _should(self):
        search_paths = ['name', 'description', 'keywords']
        should = [{'autocomplete': {'query': self.term, 'path': key, 'fuzzy': {'maxEdits': 1}}} for key in search_paths]
        return should

    @property
    def _must(self):
        must = []
        must.append({'term': {'path': 'type', 'query': "Dataset"}})
        if self.contentType:
            must.append({'term': {'path': '@type', 'query': self.contentType}})
        if self.creatorName:
            must.append({'text': {'path': 'creator.name', 'query': self.creatorName}})
        if self.providerName:
            must.append({'text': {'path': 'provider.name', 'query': self.providerName}})
        if self.hasPartName:
            must.append({'text': {'path': 'hasPart.name', 'query': self.hasPartName}})
        if self.isPartOfName:
            must.append({'text': {'path': 'isPartOf.name', 'query': self.isPartOfName}})
        if self.associatedMediaName:
            must.append({'text': {'path': 'associatedMedia.name', 'query': self.associatedMediaName}})
        if self.fundingGrantName:
            must.append({'text': {'path': 'funding.name', 'query': self.fundingGrantName}})
        if self.fundingFunderName:
            must.append({'text': {'path': 'funding.funder.name', 'query': self.fundingFunderName}})
        if self.creativeWorkStatus:
            must.append(
                {'text': {'path': ['creativeWorkStatus', 'creativeWorkStatus.name'], 'query': self.creativeWorkStatus}}
            )

        return must

    @property
    def stages(self):
        highlightPaths = ['name', 'description', 'keywords', 'creator.name']
        stages = []
        compound = {'filter': self._filters, 'must': self._must}
        if self.term:
            compound['should'] = self._should
        search_stage = {
            '$search': {
                'index': 'fuzzy_search',
                'compound': compound,
            }
        }
        if self.term:
            search_stage["$search"]['highlight'] = {'path': highlightPaths}

        stages.append(search_stage)

        # sorting needs to happen before pagination
        if self.sortBy:
            if self.sortBy == "name":
                self.sortBy = "name_for_sorting"
                self.reverseSort = not self.reverseSort
            stages.append({'$sort': {self.sortBy: -1 if self.reverseSort else 1}})
        stages.append({'$skip': (self.pageNumber - 1) * self.pageSize})
        stages.append({'$limit': self.pageSize})
        # stages.append({'$unset': ['_id', '_class_id']})
        stages.append(
            {'$set': {'score': {'$meta': 'searchScore'}, 'highlights': {'$meta': 'searchHighlights'}}},
        )
        return stages


@router.get("/search")
async def search(request: Request, search_query: SearchQuery = Depends()):
    stages = search_query.stages
    print(json.dumps(stages, indent=2))
    result = await request.app.mongodb["discovery"].aggregate(stages).to_list(search_query.pageSize)
    json_str = json.dumps(result, default=str)
    return json.loads(json_str)


@router.get("/typeahead")
async def typeahead(request: Request, term: str, pageSize: int = 30):
    search_paths = ['name', 'description', 'keywords']
    should = [{'autocomplete': {'query': term, 'path': key, 'fuzzy': {'maxEdits': 1}}} for key in search_paths]

    stages = [
        {
            '$search': {
                'index': 'fuzzy_search',
                'compound': {'should': should},
                'highlight': {'path': ['description', 'name', 'keywords']},
            }
        },
        {
            '$project': {
                'name': 1,
                'description': 1,
                'keywords': 1,
                'highlights': {'$meta': 'searchHighlights'},
                '_id': 0,
            }
        },
    ]
    result = await request.app.mongodb["discovery"].aggregate(stages).to_list(pageSize)
    return result


from hsclient import HydroShare

hs = HydroShare(username='sblack', password='changed')


def to_associated_media(file):
    mime_type = mimetypes.guess_type(file.name)[0]
    extension = file.extension
    mime_type = mime_type if mime_type else extension
    size = 0
    return {
        "@type": "DataDownload",
        "name": file.name,
        "contentUrl": file.url,
        "contentSize": size,
        "sha256": file.checksum,
        "encodingFormat": mime_type,
    }


class Message(BaseModel):
    message: Any


@router.post("/hydroshare/refresh")
async def refresh(message: Message):
    """Receive and parse Pub/Sub messages."""

    print(f"Hello {message}!")

    return (f"{message}", 204)


'''
    res = hs.resource(resource_id)
    adapter = HydroshareMetadataAdapter()
    files = []
    records = []
    hasParts = []
    for aggregation in res.aggregations():
        agg_files = []
        for f in aggregation.files():
            agg_files.append(to_associated_media(f))
        agg_record = json.loads(adapter.to_catalog_record(aggregation.metadata.dict()).json())
        agg_record["associatedMedia"] = agg_files
        files.extend(agg_files)
        hasParts.append(agg_record["url"])
        agg_record["isPartOf"] = [str(res.metadata.url)]
        records.append(agg_record)

    for f in res.files():
        files.append(to_associated_media(f))
    catalog_record = json.loads(adapter.to_catalog_record(res.metadata.dict()).json())
    catalog_record["associatedMedia"] = files
    catalog_record["hasPart"] = hasParts
    records.append(catalog_record)

    bulk_operations = [
        UpdateOne(
            {'url': record['url']},
            {'$set': record},
            upsert=True,
        )
        for record in records
    ]

    await request.app.mongodb["discovery"].bulk_write(bulk_operations)
'''


@router.get("/s3/refresh")
async def refresh(
    request: Request, metadata_file: str, bucket_name: str = None, user: User = Depends(current_active_user)
):
    records = []
    with tempfile.TemporaryDirectory() as temp_dir:
        bucket_name = bucket_name if bucket_name else user.bucket_name
        output_file = f"{temp_dir}/metadata.gz"
        minio_client(user).fget_object(bucket_name, metadata_file, output_file)

        # Decompress the output_file as a directory
        with tempfile.TemporaryDirectory() as temp_dir:
            with gzip.open(output_file, 'rb') as gz_file:
                with tarfile.open(fileobj=gz_file, mode='r') as tar:
                    tar.extractall(temp_dir)

                # Read the contents of each file into a string
                for root, _, files in os.walk(temp_dir):
                    for file in files:
                        file_path = os.path.join(root, file)
                        with open(file_path, 'r') as f:
                            records.append(json.loads(f.read()))
    for record in records:
        if "url" in record and record["url"]:
            print(json.dumps(record, indent=2))
    bulk_operations = [
        UpdateOne(
            {'url': record['url']},
            {'$set': record},
            upsert=True,
        )
        for record in records
    ]
    await request.app.mongodb["discovery"].bulk_write(bulk_operations)
