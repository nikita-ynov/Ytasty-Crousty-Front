import secrets

from ytasty.common.errors import BadRequestError, NotFoundError
from ytasty.common.permissions import check_restaurant_access
from ytasty.modules.orders import repository
from ytasty.modules.products import service as products_service
from ytasty.modules.restaurants import service as restaurants_service


def generate_order_number(db):
    while True:
        order_number = "YT-" + secrets.token_hex(4).upper()

        if repository.get_order_by_number(db, order_number) is None:
            return order_number


def create_order(db, order_data):
    restaurant = restaurants_service.get_restaurant_by_id(
        db,
        order_data.restaurant_id,
    )

    if not restaurant.is_open:
        raise BadRequestError("Le restaurant est ferme")

    if not order_data.items:
        raise BadRequestError("La commande doit contenir au moins un produit")

    items = []
    total_price = 0

    for item in order_data.items:
        if item.quantity <= 0:
            raise BadRequestError("La quantite doit etre superieure a 0")

        product = products_service.get_product(db, item.product_id)

        if product.restaurant_id != restaurant.id:
            raise BadRequestError(
                f"Le produit {product.id} n'appartient pas a ce restaurant"
            )

        if not product.is_available:
            raise BadRequestError(f"Le produit {product.id} est indisponible")

        items.append(
            {
                "product_id": product.id,
                "quantity": item.quantity,
                "unit_price": product.price,
            }
        )
        total_price += product.price * item.quantity

    return repository.create_order(
        db,
        order_number=generate_order_number(db),
        restaurant_id=restaurant.id,
        total_price=total_price,
        pickup_mode=order_data.pickup_mode,
        customer=order_data.customer.model_dump(),
        items=items,
    )


def get_order_by_number(db, order_number: str):
    order = repository.get_order_by_number(db, order_number)

    if order is None:
        raise NotFoundError("Commande introuvable")

    return order


def get_restaurant_orders(db, restaurant_id: int, current_user, status=None):
    check_restaurant_access(current_user, restaurant_id)
    restaurants_service.get_restaurant_by_id(db, restaurant_id)

    return repository.get_orders_by_restaurant(db, restaurant_id, status)


def update_order_status(db, order_number: str, status: str, current_user):
    order = get_order_by_number(db, order_number)
    check_restaurant_access(current_user, order.restaurant_id)

    return repository.update_order_status(db, order, status)


def cancel_order(db, order_number: str, current_user):
    return update_order_status(db, order_number, "cancelled", current_user)