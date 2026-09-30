from ytasty.common.errors import ForbiddenError


def check_restaurant_access(user, restaurant_id: int):
    # admin et direction ont acces a tous les restaurants,
    # staff uniquement a son propre restaurant.
    if user.role == "staff" and user.restaurant_id != restaurant_id:
        raise ForbiddenError("Acces refuse a ce restaurant")