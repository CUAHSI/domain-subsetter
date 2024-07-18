import logging
import typer
import re

from asyncio import run as aiorun
from motor.motor_asyncio import AsyncIOMotorClient

from subsetter.config import get_settings


logger = logging.getLogger()


async def _main():
    settings = get_settings()
    db = AsyncIOMotorClient(settings.mongo_url)[settings.mongo_database]

    try:
        while True:
            try:
                await watch_discovery(db)
            except:
                logger.exception("Discovery Watch Task failed, restarting the task")
    finally:
        db.close()


async def watch_discovery(db: AsyncIOMotorClient):
    async with db["discovery"].watch(full_document="updateLookup") as stream:
        async for change in stream:
            if change["operationType"] != "delete":
                document = change["fullDocument"]
                sanitized = {
                    '_id': document['_id'],
                    'name': sanitize(document['name']),
                    'description': sanitize(document['description']),
                    'keywords': document['keywords']
                    # 'keywords': [sanitize(keyword) for keyword in document['keywords']],
                }
                await db["typeahead"].find_one_and_replace({"_id": sanitized["_id"]}, sanitized, upsert=True)
            else:
                await db["typeahead"].delete_one({"_id": change["documentKey"]["_id"]})


def sanitize(text):
    # remove urls form text
    text = re.sub(r'https?://\S+', '', text)
    # remove all single characters except "a"
    text = re.sub(r"\b[a-zA-Z](?<!a)\b", "", text)
    # replace parentheses and forward slash with space
    text = re.sub('[()/]', ' ', text)
    # remove double dashes
    text = re.sub('--', '', text)
    # remove special characters
    text = re.sub('[^a-zA-Z0-9,\-_ ]', '', text)
    # remove leading/trailing hyphens
    words = text.split(' ')
    for i in range(len(words)):
        words[i] = words[i].strip("-")
    text = " ".join(words)
    # remove extra spaces
    text = " ".join(text.split())
    return text


def main():
    aiorun(_main())


if __name__ == "__main__":
    typer.run(main)
