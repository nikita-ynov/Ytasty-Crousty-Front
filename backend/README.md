# Ytasty Crousty — API Backend

REST API FastAPI pour la gestion de commandes multi-restaurants.

## Stack

- Python 3.11+
- FastAPI + Pydantic
- PostgreSQL + SQLAlchemy
- JWT pour l'authentification
- Docker + docker-compose

## Installation locale

1. Cloner le repo
2. Créer un fichier `.env` (voir `.env.example`)
3. Lancer les services

```bash
docker compose up --build
```

L'API sera disponible sur `http://localhost:8000`

Swagger : `http://localhost:8000/docs`

## Configuration

Variables d'environnement requises dans `.env` :

```
DATABASE_URL=postgresql://user:password@db:5432/ytasty
SECRET_KEY=your-secret-key
```

## API

Endpoints principaux :

- `GET /health` — vérifier que l'API est active
- `POST /auth/login` — authentification JWT
- `GET /restaurants` — lister les restaurants
- `GET /products` — lister les produits (avec filtres)
- `POST /orders` — créer une commande
- `GET /orders/{order_number}` — suivre une commande

Voir `/docs` pour la documentation complète.

## Base de données

Au démarrage, l'application crée automatiquement :

- 3 restaurants (Aix, Lyon, Paris)
- Compte admin : `admin123` / `Admin@123456`

## Déploiement

L'API doit être déployée avec :

- PostgreSQL en base
- Variables d'environnement sécurisées
- HTTPS activé
- `/health`, `/docs` et `/openapi.json` accessibles publiquement
