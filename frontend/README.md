# E-Bank Frontend

Frontend React pour l'application bancaire E-Bank.

## 🚀 Démarrage

### Prérequis

- Node.js 18+
- npm 9+
- Backend Spring Boot en cours d'exécution sur `http://localhost:8080`

### Installation

```bash
cd frontend
npm install
npm start
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 👤 Comptes de test

### Agent (créé par défaut)
- **Login:** agent@ebank.com
- **Mot de passe:** agent1234

### Client
Les clients sont créés par l'agent ou via l'auto-inscription.

## 📋 Fonctionnalités

### Profil Client
| Fonctionnalité | Description |
|----------------|-------------|
| 📊 Dashboard | Vue d'ensemble des comptes et opérations récentes |
| 💵 Dépôt | Créditer un compte |
| 💸 Retrait | Débiter un compte |
| 🔄 Virement | Transférer entre comptes |
| 📜 Historique | Consulter les opérations avec pagination |
| 👤 Profil | Voir/modifier son profil |

### Profil Agent
| Fonctionnalité | Description |
|----------------|-------------|
| 👥 Clients | Liste des clients avec leurs comptes |
| ➕ Nouveau Client | Créer un client avec compte |
| 💰 Opérations | Dépôt/Retrait/Virement |
| ⚙️ Gestion | Bloquer/Débloquer/Clôturer comptes |

## 🏗️ Structure du projet

```
frontend/
├── public/
├── src/
│   ├── components/       # Composants réutilisables
│   │   ├── Alert.js
│   │   ├── LoadingSpinner.js
│   │   ├── Navbar.js
│   │   ├── Pagination.js
│   │   └── ProtectedRoute.js
│   ├── context/          # Context React
│   │   └── AuthContext.js
│   ├── pages/            # Pages de l'application
│   │   ├── auth/         # Authentification
│   │   ├── client/       # Pages client
│   │   ├── agent/        # Pages agent
│   │   └── Profile.js
│   ├── services/         # Services API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── accountService.js
│   │   ├── dashboardService.js
│   │   └── userService.js
│   ├── utils/            # Utilitaires
│   │   └── formatters.js
│   ├── App.js
│   └── index.js
└── package.json
```

## 🔧 Configuration

Le frontend est configuré pour communiquer avec le backend sur `http://localhost:8080`.
Pour modifier cette configuration, éditez `src/services/api.js`.

## 📦 Dépendances principales

- **React 18** - Framework UI
- **React Router v7** - Navigation
- **Axios** - Client HTTP
- **jwt-decode** - Décodage des tokens JWT

## 🛠️ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement |
| `npm run build` | Build de production |
| `npm test` | Lance les tests |

## 📡 API Backend

Le frontend communique avec les endpoints suivants:

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register-self` - Auto-inscription
- `POST /api/auth/change-password` - Changement de mot de passe
- `POST /api/auth/create-client` - Création client (Agent)

### Utilisateurs
- `GET /api/users/me` - Profil utilisateur
- `GET /api/users/clients` - Liste des clients (Agent)

### Dashboard
- `GET /api/dashboard` - Dashboard client

### Comptes
- `POST /api/accounts/deposit` - Dépôt
- `POST /api/accounts/withdraw` - Retrait
- `POST /api/accounts/transfer` - Virement
- `GET /api/accounts/{rib}/operations` - Historique
- `PATCH /api/accounts/{rib}/block` - Bloquer (Agent)
- `PATCH /api/accounts/{rib}/unblock` - Débloquer (Agent)
- `PATCH /api/accounts/{rib}/close` - Clôturer (Agent)
