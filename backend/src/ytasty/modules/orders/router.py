from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ytasty.db.database import get_db
from ytasty.modules.auth.dependencies import get_current_user
from ytasty.modules.orders import service
from ytasty.modules.orders.schemas import (
    OrderCreate,
    OrderResponse,
    OrderStatus,
    OrderStatusUpdate,
)
from ytasty.modules.users.model import User


router = APIRouter(
    tags=["orders"],
)


@router.post("/orders", response_model=OrderResponse, status_code=201)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
):
    return service.create_order(db, order_data)


@router.get("/orders/{order_number}", response_model=OrderResponse)
def get_order(
    order_number: str,
    db: Session = Depends(get_db),
):
    return service.get_order_by_number(db, order_number)


@router.get(
    "/restaurants/{restaurant_id}/orders",
    response_model=list[OrderResponse],
)
def get_restaurant_orders(
    restaurant_id: int,
    status: OrderStatus | None = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.get_restaurant_orders(
        db,
        restaurant_id,
        current_user,
        status,
    )


@router.patch("/orders/{order_number}/status", response_model=OrderResponse)
def update_order_status(
    order_number: str,
    status_data: OrderStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.update_order_status(
        db,
        order_number,
        status_data.status,
        current_user,
    )


@router.post("/orders/{order_number}/cancel", response_model=OrderResponse)
def cancel_order(
    order_number: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return service.cancel_order(db, order_number, current_user)