from ytasty.modules.orders.model import Order, OrderItem


def get_order_by_number(db, order_number: str):
    return db.query(Order).filter(
        Order.order_number == order_number
    ).first()


def get_orders_by_restaurant(db, restaurant_id: int, status=None):
    query = db.query(Order).filter(
        Order.restaurant_id == restaurant_id
    )

    if status is not None:
        query = query.filter(Order.status == status)

    return query.order_by(Order.created_at.desc()).all()


def create_order(
    db,
    order_number: str,
    restaurant_id: int,
    total_price,
    pickup_mode: str,
    customer: dict,
    items: list[dict],
):
    order = Order(
        order_number=order_number,
        restaurant_id=restaurant_id,
        total_price=total_price,
        pickup_mode=pickup_mode,
        customer=customer,
        items=[OrderItem(**item) for item in items],
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    return order


def update_order_status(db, order, status: str):
    order.status = status

    db.commit()
    db.refresh(order)

    return order