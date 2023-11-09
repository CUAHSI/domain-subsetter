import os
import json
from app.db import User, db
from app.routers.access_control import router as access_control_router
from app.routers.argo import router as argo_router
from app.routers.storage import router as storage_router
from app.schemas import UserRead, UserUpdate
from app.users import SECRET, auth_backend, cookie_backend, cuahsi_oauth_client, front_oauth_client, fastapi_users
from beanie import init_beanie
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# TODO: get oauth working with swagger/redoc
# Setting the base url for swagger docs
# https://github.com/tiangolo/fastapi/pull/1547
# https://swagger.io/docs/specification/api-host-and-base-path/
# https://fastapi.tiangolo.com/how-to/configure-swagger-ui/
# https://github.com/tiangolo/fastapi/pull/499
swagger_params = {"withCredentials": True,
                  "oauth2RedirectUrl": front_oauth_client.authorize_endpoint,
                  "swagger_ui_client_id": front_oauth_client.client_id}

app = FastAPI(servers=[{"url": os.environ['VITE_APP_API_URL']}], swagger_ui_parameters=swagger_params)

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

app.include_router(
    fastapi_users.get_auth_router(cookie_backend),
    prefix="/auth/cookie",
    tags=["auth"]
)

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
