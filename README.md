# Lancer le serveur

créer le fichier .env copier/coller le contenu de .env.example

Commande pour lancer le serveur+db : docker compose up --build

## Synchronisation temps réel - Option A

Nous avons choisi l'Option A : Écran Cuisine Live.

Lorsqu'un client valide une commande, le backend FastAPI
crée la commande puis émet un événement Socket.io `new_order`.

Le tableau de bord Cuisine écoute cet événement et ajoute
automatiquement la nouvelle commande à l'écran, sans
rafraîchissement manuel.

Une notification visuelle informe le personnel de l'arrivée
d'une nouvelle commande.

Flux :

Client -> POST /orders -> FastAPI -> Socket.io -> KitchenDashboard

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
