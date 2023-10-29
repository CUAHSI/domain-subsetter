import os
import json
from app.db import User, db
from app.routers.access_control import router as access_control_router
from app.routers.argo import router as argo_router
from app.routers.storage import router as storage_router
from app.schemas import UserRead, UserUpdate
from app.users import SECRET, auth_backend, cookie_backend, cuahsi_oauth_client, fastapi_users
from beanie import init_beanie
from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from httpx_oauth.integrations.fastapi import OAuth2AuthorizeCallback
from app.users import front_oauth_client

app = FastAPI()

origins = json.loads(os.environ['ALLOW_ORIGINS'])

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(
    argo_router,
    # prefix="/auth/cuahsi",
    tags=["argo"],
)

app.include_router(
    access_control_router,
    # prefix="/auth/cuahsi",
    tags=["minio"],
)

app.include_router(
    storage_router,
    # prefix="/auth/cuahsi",
    tags=["minio"],
)

app.include_router(
    fastapi_users.get_oauth_router(cuahsi_oauth_client, auth_backend, SECRET),
    prefix="/auth/cuahsi",
    tags=["auth"],
)

app.include_router(
    fastapi_users.get_oauth_router(front_oauth_client, cookie_backend, SECRET),
    prefix="/auth/cookie",
    tags=["auth"],
)

# TODO: move this into a separate router
oauth2_authorize_callback = OAuth2AuthorizeCallback(front_oauth_client, "front-callback")


@app.get("/front-callback", name="front-callback")
async def oauth_callback(access_token_state=Depends(oauth2_authorize_callback)):
    token, state = access_token_state
    return {"token": token}

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)


@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )
