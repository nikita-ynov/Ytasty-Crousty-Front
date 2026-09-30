from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


OrderStatus = Literal[
    "pending",
    "validated",
    "preparing",
    "ready",
    "collected",
    "cancelled",
]

PickupMode = Literal["onsite", "takeaway"]


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int


class CustomerCreate(BaseModel):
    name: str
    email: str


class OrderCreate(BaseModel):
    restaurant_id: int
    items: list[OrderItemCreate]
    pickup_mode: PickupMode
    customer: CustomerCreate


class OrderStatusUpdate(BaseModel):
    status: OrderStatus


class OrderItemResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    product_id: int
    quantity: int
    unit_price: float


class OrderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_number: str
    restaurant_id: int
    created_at: datetime
    items: list[OrderItemResponse]
    total_price: float
    status: OrderStatus
    pickup_mode: PickupMode
    customer: CustomerCreate