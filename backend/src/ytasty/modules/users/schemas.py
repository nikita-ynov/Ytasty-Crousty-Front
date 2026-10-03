from pydantic import BaseModel, field_validator


class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    password: str
    role: str
    restaurant_id: int | None = None

    @field_validator("username")
    @classmethod
    def validate_username(cls, username):
        if len(username) < 8 or len(username) > 12:
            raise ValueError(
                "Le username doit contenir entre 8 et 12 caracteres"
            )

        if not username.isalnum():
            raise ValueError(
                "Le username doit etre alphanumerique"
            )

        return username

    @field_validator("password")
    @classmethod
    def validate_password(cls, password):
        if len(password) < 12 or len(password) > 64:
            raise ValueError(
                "Le mot de passe doit contenir entre 12 et 64 caracteres"
            )

        if not any(character.isdigit() for character in password):
            raise ValueError(
                "Le mot de passe doit contenir un chiffre"
            )

        if not any(character.isupper() for character in password):
            raise ValueError(
                "Le mot de passe doit contenir une majuscule"
            )

        if not any(
            not character.isalnum()
            for character in password
        ):
            raise ValueError(
                "Le mot de passe doit contenir un caractere special"
            )

        return password

    @field_validator("role")
    @classmethod
    def validate_role(cls, role):
        if role not in ["admin", "staff", "direction"]:
            raise ValueError(
                "Le role doit etre admin, staff ou direction"
            )

        return role

    class UserResponse(BaseModel):
        id: int
        first_name: str
        last_name: str
        username: str
        role: str
        restaurant_id: int | None

        model_config = {"from_attributes": True}