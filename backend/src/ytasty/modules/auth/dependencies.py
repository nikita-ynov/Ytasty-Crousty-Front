import os

import jwt
from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from ytasty.common.errors import UnauthorizedError
from ytasty.db.database import get_db
from ytasty.modules.users.model import User


JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    db: Session = Depends(get_db),
):
    if credentials is None:
        raise UnauthorizedError("Authentification requise")

    try:
        payload = jwt.decode(
            credentials.credentials,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
    except jwt.InvalidTokenError:
        raise UnauthorizedError("Token invalide ou expire")

    user = db.query(User).filter(
        User.username == payload.get("sub")
    ).first()

    if user is None:
        raise UnauthorizedError("Utilisateur introuvable")

    return user