from ytasty.modules.products.model import Product


def init_products(db):
    products = [
        {
            "name": "Burger Chicken",
            "image": "https://example.com/burger-chicken.jpg",
            "description": "Burger avec poulet croustillant",
            "category": "burgers",
            "price": 9.90,
            "is_available": True,
            "restaurant_id": 1,
            "ingredients": ["pain", "poulet", "salade", "sauce"],
        },
        {
            "name": "Burger Cheese",
            "image": "https://example.com/burger-cheese.jpg",
            "description": "Burger avec steak et fromage",
            "category": "burgers",
            "price": 10.90,
            "is_available": True,
            "restaurant_id": 2,
            "ingredients": ["pain", "steak", "fromage", "salade"],
        },
        {
            "name": "Crousty Box",
            "image": "https://example.com/crousty-box.jpg",
            "description": "Box de poulet croustillant avec frites",
            "category": "boxes",
            "price": 12.50,
            "is_available": True,
            "restaurant_id": 3,
            "ingredients": ["poulet", "frites", "sauce"],
        },
    ]

    for product_data in products:
        product = db.query(Product).filter(
            Product.name == product_data["name"],
            Product.restaurant_id == product_data["restaurant_id"],
        ).first()

        if product is None:
            new_product = Product(**product_data)
            db.add(new_product)

    db.commit()