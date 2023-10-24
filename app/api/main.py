from app.db import User, db
from app.routers.argo import router as argo_router
from app.routers.access_control import router as access_control_router
from app.schemas import UserRead, UserUpdate
from app.users import SECRET, auth_backend, cuahsi_oauth_client, fastapi_users
from beanie import init_beanie
from fastapi import Depends, FastAPI

app = FastAPI()


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
    fastapi_users.get_oauth_router(cuahsi_oauth_client, auth_backend, SECRET),
    prefix="/auth/cuahsi",
    tags=["auth"],
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
