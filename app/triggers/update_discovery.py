import logging
import typer
import time

from asyncio import run as aiorun
from motor.motor_asyncio import AsyncIOMotorClient

from subsetter.config import get_settings


logger = logging.getLogger()


async def _main():
    logger.warning("starting up watch discovery_ids")
    settings = get_settings()
    db = AsyncIOMotorClient(settings.mongo_url)[settings.mongo_database]

    try:
        while True:
            try:
                await watch_catalog(db)
            except:
                logger.exception("Submission Watch Task failed, restarting the task")
    finally:
        db.close()


async def watch_catalog(db: AsyncIOMotorClient):
    async with db["discovery_ids"].watch(full_document="updateLookup", full_document_before_change="whenAvailable") as stream:
        # stream.resume_token
        async for change in stream:
            if change["operationType"] == "delete":
                document = change["fullDocumentBeforeChange"]
                await db["discovery"].delete_one({"_id": document["_id"]})
            else:
                document = change["fullDocument"]
                resource_id = document["resource_id"]
                await db["discovery"].find_one_and_replace(
                        {"_id": document["_id"]}, resource_id, upsert=True
                    )


def main():
    aiorun(_main())


if __name__ == "__main__":
    typer.run(main)
