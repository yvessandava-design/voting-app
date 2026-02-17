# Backend - API de Plateforme de Vote

API Express.js pour la gestion des votes avec authentification JWT et base de données PostgreSQL.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

## Migrations

Exécutez les migrations pour créer les tables:

```bash
npm run migrate
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur écoutera sur le port défini dans `.env` (par défaut 5000).

## Structure des Fichiers

- `src/index.js` - Point d'entrée principal
- `src/db.js` - Configuration PostgreSQL
- `src/middleware/auth.js` - Middleware d'authentification JWT
- `src/routes/auth.js` - Routes d'authentification
- `src/routes/votes.js` - Routes de gestion des votes

## Variables d'Environnement

- `NODE_ENV` - Environnement (development/production)
- `PORT` - Port du serveur
- `DB_HOST` - Hôte PostgreSQL
- `DB_PORT` - Port PostgreSQL
- `DB_NAME` - Nom de la base de données
- `DB_USER` - Utilisateur PostgreSQL
- `DB_PASSWORD` - Mot de passe PostgreSQL
- `JWT_SECRET` - Clé secrète JWT
- `JWT_EXPIRE` - Durée d'expiration JWT
