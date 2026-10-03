from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ytasty.db.database import get_db
from ytasty.modules.auth import service
from ytasty.modules.auth.schemas import (
    LoginRequest,
    TokenResponse,
)


router = APIRouter(
    prefix="/auth",
    tags=["auth"],
)


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db),
):
    return service.login(
        db,
        login_data.username,
        login_data.password,
    )