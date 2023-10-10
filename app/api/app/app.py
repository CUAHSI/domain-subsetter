from app.db import User, db
from app.routers.argo import router as argo_router
from app.schemas import UserCreate, UserRead, UserUpdate
from app.users import SECRET, auth_backend, cuahsi_oauth_client, current_active_user, fastapi_users
from beanie import init_beanie
from fastapi import Depends, FastAPI

app = FastAPI()

app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
app.include_router(
    fastapi_users.get_oauth_router(cuahsi_oauth_client, auth_backend, SECRET),
    prefix="/auth/cuahsi",
    tags=["auth"],
)
app.include_router(
    argo_router,
    # prefix="/auth/cuahsi",
    tags=["argo"],
)


@app.get("/authenticated-route")
async def authenticated_route(user: User = Depends(current_active_user)):
    return {"message": f"Hello {user.email}!"}


@app.on_event("startup")
async def on_startup():
    await init_beanie(
        database=db,
        document_models=[
            User,
        ],
    )
