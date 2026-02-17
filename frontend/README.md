# Frontend - Interface de Plateforme de Vote

Application React avec Vite pour l'interface utilisateur de la plateforme de vote.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env` à partir de `.env.example`:

```bash
cp .env.example .env
```

## Démarrage

### Mode développement
```bash
npm run dev
```

Le serveur de développement écoutera sur `http://localhost:3000`.

### Build pour production
```bash
npm run build
```

Les fichiers compilés seront dans le dossier `dist/`.

### Preview de la build
```bash
npm run preview
```

## Structure des Fichiers

```
src/
├── pages/
│   ├── Login.jsx          # Page de connexion
│   ├── Register.jsx       # Page d'inscription
│   ├── Dashboard.jsx      # Tableau de bord principal
│   ├── CreateVote.jsx     # Création de vote
│   ├── VotePage.jsx       # Page de vote
│   └── Results.jsx        # Résultats du vote
├── App.jsx               # Composant principal
├── App.css               # Styles globaux
├── index.css             # Styles de base
└── main.jsx              # Point d'entrée
```

## Variables d'Environnement

- `VITE_API_URL` - URL de l'API (par défaut `http://localhost:5000/api`)

## Configuration Vite

Le fichier `vite.config.js` inclut:
- Proxy pour les appels API vers le backend
- Plugin React pour JSX support
- Serveur de développement sur le port 3000

## Dépendances

- **React 18** - Framework UI
- **React Router** - Gestion du routage
- **Axios** - Client HTTP
- **Vite** - Bundler et serveur de développement
