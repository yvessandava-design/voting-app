# Application de Vote - Plateforme Complète

Une plateforme web complète pour créer et gérer des votes/sondages avec une interface moderne et intuitive.

## Fonctionnalités

- ✅ **Authentification**: Inscription et connexion avec email et mot de passe
- ✅ **Création de votes**: Les utilisateurs authentifiés peuvent créer des sondages
- ✅ **Configuration flexible**: 
  - Titre du vote
  - Nom de l'organisateur
  - Options de vote
  - Vote unique ou multiple
  - Référence personnalisée pour les votants
- ✅ **Lien unique**: Chaque vote reçoit un lien unique et shareable
- ✅ **Système de vote sécurisé**:
  - Nom du votant
  - Référence pour empêcher les doubles votes
  - Support pour le vote unique ou multiple
- ✅ **Résultats en temps réel**: Visualisation des résultats avec barres de progression
- ✅ **Dashboard**: Gestion de tous vos votes créés

## Structure du Projet

```
├── backend/                 # API Express.js
│   ├── src/
│   │   ├── index.js        # Serveur principal
│   │   ├── db.js           # Configuration PostgreSQL
│   │   ├── middleware/
│   │   │   └── auth.js     # Middleware d'authentification JWT
│   │   └── routes/
│   │       ├── auth.js     # Routes d'authentification
│   │       └── votes.js    # Routes de gestion des votes
│   ├── package.json
│   └── .env.example
├── frontend/                # Application React + Vite
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CreateVote.jsx
│   │   │   ├── VotePage.jsx
│   │   │   └── Results.jsx
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── database/                # Migrations
│   ├── migrate.js
│   └── README.md
├── docker-compose.yml       # Configuration Docker
└── README.md

```

## Prérequis

- Node.js (v16 ou plus)
- npm ou yarn
- PostgreSQL (ou Docker)

## Installation et Configuration

### 1. Configurer la Base de Données

#### Option A: PostgreSQL local
```bash
# Créer la base de données
createdb voting_app
```

#### Option B: Docker
```bash
# Démarrer PostgreSQL avec Docker
docker-compose up -d
```

### 2. Configurer le Backend

```bash
cd backend

# Copier et configurer le fichier .env
cp .env.example .env

# Installer les dépendances
npm install

# Exécuter les migrations
npm run migrate

# Démarrer le serveur (mode développement)
npm run dev
```

**Fichier `.backend/.env` attendu:**
```
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=voting_app
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

### 3. Configurer le Frontend

```bash
cd frontend

# Copier et configurer le fichier .env
cp .env.example .env

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

Le frontend sera disponible sur `http://localhost:3000`

## Guide d'Utilisation

### Pour les Créateurs de Votes

1. **Inscription/Connexion**: Créez un compte avec votre email et mot de passe
2. **Tableau de bord**: Consultez vos votes actifs et créez de nouveaux votes
3. **Créer un vote**:
   - Entrez le titre du sondage
   - Spécifiez votre nom comme organisateur
   - Ajoutez au minimum 2 options
   - Optionnel: Activez le vote unique pour limiter à une seule option par personne
   - Optionnel: Définissez un exemple de référence (ex: CODE_EMPLOYE)
4. **Partager**: Copiez le lien unique généré et partagez-le avec les votants
5. **Résultats**: Consultez les résultats du vote en temps réel

### Pour les Votants

1. **Accès au vote**: Cliquez sur le lien fourni par l'organisateur
2. **Voter**:
   - Entrez votre nom
   - Entrez votre référence (selon l'exemple fourni)
   - Sélectionnez vos option(s)
3. **Confirmation**: Votre vote est enregistré et vous êtes redirigé vers les résultats

## Endpoints de l'API

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion

### Votes
- `GET /api/votes` - Obtenir les votes de l'utilisateur (authentifié)
- `POST /api/votes/create` - Créer un nouveau vote (authentifié)
- `GET /api/votes/:vote_token` - Obtenir les détails d'un vote
- `POST /api/votes/:vote_token/submit` - Soumettre un vote
- `GET /api/votes/:vote_token/results` - Obtenir les résultats d'un vote

## Architecture Base de Données

### Table: users
- `id` (INT, PRIMARY KEY)
- `email` (VARCHAR, UNIQUE)
- `password` (VARCHAR)
- `created_at` (TIMESTAMP)

### Table: votes
- `id` (INT, PRIMARY KEY)
- `user_id` (INT, FOREIGN KEY)
- `title` (VARCHAR)
- `organizer_name` (VARCHAR)
- `single_vote` (BOOLEAN)
- `reference_example` (VARCHAR)
- `vote_token` (VARCHAR, UNIQUE)
- `status` (VARCHAR)
- `created_at` (TIMESTAMP)

### Table: vote_options
- `id` (INT, PRIMARY KEY)
- `vote_id` (INT, FOREIGN KEY)
- `option_text` (VARCHAR)
- `created_at` (TIMESTAMP)

### Table: votes_submitted
- `id` (INT, PRIMARY KEY)
- `vote_id` (INT, FOREIGN KEY)
- `voter_name` (VARCHAR)
- `voter_reference` (VARCHAR)
- `option_id` (INT, FOREIGN KEY)
- `created_at` (TIMESTAMP)

## Sécurité

- **Authentification**: JWT (JSON Web Tokens)
- **Hachage des mots de passe**: bcryptjs
- **Validation des entrées**: express-validator
- **CORS**: Configuration sécurisée
- **Prévention des doubles votes**: Vérification par référence

## Technologies Utilisées

### Backend
- Express.js - Framework web
- PostgreSQL - Base de données
- JWT - Authentification
- bcryptjs - Hachage des mots de passe
- dotenv - Gestion des variables d'environnement

### Frontend
- React 18 - Framework UI
- Vite - Bundler
- React Router - Routage
- Axios - Client HTTP
- CSS3 - Styling

## Déploiement

### Pour la production

1. **Backend**:
   - Configurer les variables d'environnement pour la production
   - Utiliser un serveur Node.js (PM2, etc.)
   - Configurer HTTPS/SSL
   - Utiliser une base de données PostgreSQL sécurisée

2. **Frontend**:
   ```bash
   npm run build
   ```
   - Déployer le dossier `dist` sur un serveur web (Vercel, Netlify, etc.)
   - Configurer les variables d'environnement

## Troubleshooting

### La base de données n'est pas accessible
- Vérifier que PostgreSQL est en cours d'exécution
- Vérifier les identifiants dans `.env`
- Si vous utilisez Docker: `docker-compose up -d`

### Le frontend ne peut pas se connecter à l'API
- Vérifier que le backend est en cours d'exécution sur le port 5000
- Vérifier la configuration du proxy dans `vite.config.js`
- Vérifier les en-têtes CORS

### Erreur JWT
- Vérifier que `JWT_SECRET` est défini dans `.env`
- Vérifier que le token dans le localStorage n'est pas expiré

## Contributions

Les contributions sont bienvenues! N'hésitez pas à ouvrir une issue ou une pull request.

## License

MIT License
