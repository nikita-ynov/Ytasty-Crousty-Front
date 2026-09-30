from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from ytasty.common.errors import (
    BadRequestError,
    ForbiddenError,
    NotFoundError,
    UnauthorizedError,
)
from ytasty.db.base import Base
from ytasty.db.database import SessionLocal, engine
from ytasty.db.initAdmin import init_admin
from ytasty.db.initProduct import init_products
from ytasty.db.initRestaurant import init_restaurants
from ytasty.modules.auth.router import router as auth_router
from ytasty.modules.orders.model import Order, OrderItem
from ytasty.modules.orders.router import router as orders_router
from ytasty.modules.products.model import Product
from ytasty.modules.products.router import router as products_router
from ytasty.modules.restaurants.model import Restaurant
from ytasty.modules.restaurants.router import router as restaurants_router
from ytasty.modules.users.model import User
from ytasty.modules.users.router import router as users_router


MODELS = [
    Restaurant,
    User,
    Product,
    Order,
    OrderItem,
]


Base.metadata.create_all(bind=engine)


db = SessionLocal()

try:
    init_restaurants(db)
    init_products(db)
    init_admin(db)
finally:
    db.close()


app = FastAPI(
    title="Ytasty Crousty API",
    version="1.0.0",
)


@app.exception_handler(NotFoundError)
def not_found_handler(request: Request, error: NotFoundError):
    return JSONResponse(
        status_code=404,
        content={"detail": error.message},
    )


@app.exception_handler(UnauthorizedError)
def unauthorized_handler(request: Request, error: UnauthorizedError):
    return JSONResponse(
        status_code=401,
        content={"detail": error.message},
    )


@app.exception_handler(ForbiddenError)
def forbidden_handler(request: Request, error: ForbiddenError):
    return JSONResponse(
        status_code=403,
        content={"detail": error.message},
    )


@app.exception_handler(BadRequestError)
def bad_request_handler(request: Request, error: BadRequestError):
    return JSONResponse(
        status_code=400,
        content={"detail": error.message},
    )


app.include_router(auth_router)
app.include_router(users_router)
app.include_router(restaurants_router)
app.include_router(products_router)
app.include_router(orders_router)


@app.get("/health")
def health():
    return {"status": "ok"}