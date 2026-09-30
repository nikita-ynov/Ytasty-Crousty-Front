from pwdlib import PasswordHash

from ytasty.modules.users.model import User


password_hash = PasswordHash.recommended()


def init_admin(db):
    admin = db.query(User).filter(
        User.username == "admin123"
    ).first()

    if admin is None:
        admin = User(
            first_name="Admin",
            last_name="Ytasty",
            username="admin123",
            password_hash=password_hash.hash("Admin@123456"),
            role="admin",
            restaurant_id=None,
        )

        db.add(admin)
        db.commit()