from datetime import datetime

from fastapi import APIRouter, Depends, Request
from pydantic import BaseModel, validator

router = APIRouter()


class SearchQuery(BaseModel):
    term: str = None
    sortBy: str = None
    reverseSort: bool = True
    contentType: str = None
    providerName: str = None
    creatorName: str = None
    dataCoverageStart: int = None
    dataCoverageEnd: int = None
    publishedStart: int = None
    publishedEnd: int = None
    hasPartName: str = None
    isPartOfName: str = None
    associatedMediaName: str = None
    fundingGrantName: str = None
    fundingFunderName: str = None
    creativeWorkStatus: str = None
    pageNumber: int = 1
    pageSize: int = 30

    @validator('*')
    def empty_str_to_none(cls, v, field, **kwargs):
        if field.name == 'term' and v:
            return v.strip()

        if isinstance(v, str) and v.strip() == '':
            return None
        return v

    @validator('dataCoverageStart', 'dataCoverageEnd', 'publishedStart', 'publishedEnd')
    def validate_year(cls, v, values, field, **kwargs):
        if v is None:
            return v
        try:
            datetime(v, 1, 1)
        except ValueError:
            raise ValueError(f'{field.name} is not a valid year')
        if field.name == 'dataCoverageEnd':
            if 'dataCoverageStart' in values and v < values['dataCoverageStart']:
                raise ValueError(f'{field.name} must be greater or equal to dataCoverageStart')
        if field.name == 'publishedEnd':
            if 'publishedStart' in values and v < values['publishedStart']:
                raise ValueError(f'{field.name} must be greater or equal to publishedStart')
        return v

    @validator('pageNumber', 'pageSize')
    def validate_page(cls, v, field, **kwargs):
        if v <= 0:
            raise ValueError(f'{field.name} must be greater than 0')
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
        search_paths = ['name', 'description', 'keywords', 'keywords.name']
        should = [{'autocomplete': {'query': self.term, 'path': key, 'fuzzy': {'maxEdits': 1}}} for key in search_paths]
        return should

    @property
    def _must(self):
        must = []
        must.append({'term': {'path': '@type', 'query': "Dataset"}})
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
        highlightPaths = ['name', 'description', 'keywords', 'keywords.name', 'creator.name']
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
    result = await request.app.mongodb["discovery"].aggregate(stages).to_list(search_query.pageSize)
    import json

    json_str = json.dumps(result, default=str)
    return json.loads(json_str)


@router.get("/typeahead")
async def typeahead(request: Request, term: str, pageSize: int = 30):
    search_paths = ['name', 'description', 'keywords', 'keywords.name']
    should = [{'autocomplete': {'query': term, 'path': key, 'fuzzy': {'maxEdits': 1}}} for key in search_paths]

    stages = [
        {
            '$search': {
                'index': 'fuzzy_search',
                'compound': {'should': should},
                'highlight': {'path': ['description', 'name', 'keywords', 'keywords.name']},
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
