from ytasty.modules.users.model import User


def get_user_by_username(db, username: str):
    return db.query(User).filter(
        User.username == username
    ).first()


def create_user(db, user: User):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
