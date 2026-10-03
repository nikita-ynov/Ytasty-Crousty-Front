import os
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from ytasty.common.errors import UnauthorizedError
from ytasty.modules.auth import repository


password_hash = PasswordHash.recommended()

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
)


def create_access_token(username: str):
    expiration = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    payload = {
        "sub": username,
        "exp": expiration,
    }

    token = jwt.encode(
        payload,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )

    return token


def login(db, username: str, password: str):
    user = repository.get_user_by_username(
        db,
        username,
    )

    if user is None:
        raise UnauthorizedError(
            "Identifiant ou mot de passe incorrect"
        )

    password_is_valid = password_hash.verify(
        password,
        user.password_hash,
    )

    if not password_is_valid:
        raise UnauthorizedError(
            "Identifiant ou mot de passe incorrect"
        )

    access_token = create_access_token(user.username)

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }