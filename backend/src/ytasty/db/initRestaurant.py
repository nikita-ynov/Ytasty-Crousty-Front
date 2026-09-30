from ytasty.modules.restaurants.model import Restaurant


def init_restaurants(db):
    restaurants = [
        {
            "name": "Ytasty Crousty Aix",
            "city": "Aix-en-Provence",
            "address": "Adresse a définir",
            "is_open": True,
            "opening_hours": "A définir",
            "contact": "A définir",
        },
        {
            "name": "Ytasty Crousty Lyon",
            "city": "Lyon",
            "address": "Adresse a définir",
            "is_open": True,
            "opening_hours": "A définir",
            "contact": "A définir",
        },
        {
            "name": "Ytasty Crousty Paris",
            "city": "Paris",
            "address": "Adresse a définir",
            "is_open": True,
            "opening_hours": "A définir",
            "contact": "A définir",
        },
    ]

    for restaurant_data in restaurants:
        restaurant = db.query(Restaurant).filter(
            Restaurant.name == restaurant_data["name"]
        ).first()

        if restaurant is None:
            new_restaurant = Restaurant(**restaurant_data)
            db.add(new_restaurant)

    db.commit()