from pwdlib import PasswordHash

from ytasty.common.errors import BadRequestError, NotFoundError
from ytasty.modules.restaurants import repository as restaurants_repository
from ytasty.modules.users import repository
from ytasty.modules.users.model import User


password_hash = PasswordHash.recommended()


def create_user(db, data):
    if repository.get_user_by_username(db, data.username) is not None:
        raise BadRequestError("Cet identifiant existe déjà")

    if data.role == "staff" and data.restaurant_id is None:
        raise BadRequestError("Un staff doit avoir un restaurant")

    if data.restaurant_id is not None:
        restaurant = restaurants_repository.get_restaurant_by_id(
            db, data.restaurant_id
        )
        if restaurant is None:
            raise NotFoundError("Restaurant introuvable")

    user = User(
        first_name=data.first_name,
        last_name=data.last_name,
        username=data.username,
        password_hash=password_hash.hash(data.password),
        role=data.role,
        restaurant_id=data.restaurant_id,
    )

    return repository.create_user(db, user)