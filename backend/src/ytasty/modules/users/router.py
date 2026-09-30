from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ytasty.common.errors import ForbiddenError
from ytasty.db.database import get_db
from ytasty.modules.auth.dependencies import get_current_user
from ytasty.modules.users import service
from ytasty.modules.users.model import User
from ytasty.modules.users.schemas import UserCreate


router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.post("", response_model=UserCreate.UserResponse, status_code=201)
def create_user(
    data: UserCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "admin":
        raise ForbiddenError("Seul un administrateur peut créer un utilisateur")

    return service.create_user(db, data)
