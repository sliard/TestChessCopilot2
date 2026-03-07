# JavaViteTemplate

Template de projet fullstack moderne avec **Java/Spring Boot** pour le backend et **React/Vite** pour le frontend, incluant une configuration Docker complète.

## 🚀 Stack Technique

### Backend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Java | 21 LTS | Langage principal |
| Spring Boot | 3.4.x | Framework backend |
| Spring Security | 6.x | Authentification & autorisation |
| Spring Data JPA | 3.4.x | Accès aux données |
| PostgreSQL | 16 | Base de données |
| Maven | 3.9.x | Gestionnaire de dépendances |

### Frontend
| Technologie | Version | Description |
|-------------|---------|-------------|
| Node.js | 22 LTS | Runtime JavaScript |
| React | 19.x | Bibliothèque UI |
| Vite | 6.x | Build tool |
| TypeScript | 5.x | Typage statique |

### Infrastructure
| Technologie | Version | Description |
|-------------|---------|-------------|
| Docker | 24+ | Containerisation |
| Docker Compose | 2.x | Orchestration locale |
| Nginx | Alpine | Serveur web frontend |

## 📁 Structure du Projet

```
├── backend/                    # Projet Spring Boot (à générer)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/
│   │   │   │       ├── config/         # Configuration Spring
│   │   │   │       ├── controller/     # REST Controllers
│   │   │   │       ├── dto/            # Data Transfer Objects
│   │   │   │       ├── entity/         # Entités JPA
│   │   │   │       ├── repository/     # Repositories JPA
│   │   │   │       ├── security/       # Configuration JWT
│   │   │   │       ├── service/        # Services métier
│   │   │   │       └── Application.java
│   │   │   └── resources/
│   │   │       └── application.yml
│   │   └── test/
│   └── pom.xml
│
├── frontend/                   # Projet React/Vite (à générer)
│   ├── src/
│   │   ├── components/         # Composants React
│   │   ├── pages/              # Pages/Routes
│   │   ├── hooks/              # Custom hooks
│   │   ├── services/           # Appels API
│   │   ├── store/              # État global
│   │   ├── types/              # Types TypeScript
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── docker/
│   ├── docker-compose.yml      # Production (DB + Backend + Frontend)
│   ├── docker-compose.dev.yml  # Développement (DB uniquement)
│   ├── Dockerfile.backend      # Build Spring Boot
│   ├── Dockerfile.frontend     # Build React + Nginx
│   ├── nginx/                  # Configuration Nginx
│   └── init-db/                # Scripts SQL d'initialisation
│
├── docs/                       # Documentation du projet
│   ├── ARCHITECTURE.md         # Architecture technique
│   ├── AI_CONTEXT.md           # Contexte pour les assistants IA
│   └── features/               # Spécifications des features
│
├── .github/
│   ├── actions/                # Actions composites réutilisables
│   ├── agents/                 # Définitions des agents Copilot
│   ├── instructions/           # Instructions ciblées (backend, frontend, docker, testing)
│   ├── skills/                 # Skills Copilot par domaine
│   ├── workflows/              # Workflows GitHub Actions (CI, deploy, release)
│   ├── hooks/                  # Git hooks
│   ├── copilot-instructions.md # Conventions et bonnes pratiques du projet
│   └── git-commit-instructions.md # Conventions de messages de commit
│
└── AGENTS.md                   # Règles opérationnelles pour les agents IA
```

## 🛠️ Démarrage Rapide

### Prérequis
- Docker & Docker Compose
- Java 21 (pour le développement local)
- Node.js 22 LTS (pour le développement local)
- Maven 3.9+ (pour le développement local)

### Mode Développement

1. **Démarrer la base de données**
   ```bash
   docker compose -f docker/docker-compose.dev.yml up -d
   ```

2. **Démarrer le backend** (dans le dossier `backend/`)
   ```bash
   cd backend
   mvn spring-boot:run
   ```

3. **Démarrer le frontend** (dans le dossier `frontend/`)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Accès**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/api
   - PostgreSQL: localhost:5432

### Mode Production

1. **Configurer les variables d'environnement**
   ```bash
   cp .env.example .env
   # Éditer .env avec les valeurs de production
   ```

2. **Lancer l'ensemble**
   ```bash
   docker compose -f docker/docker-compose.yml up -d --build
   ```

3. **Accès**
   - Application: http://localhost
   - API: http://localhost/api

## 🔐 Sécurité

### Authentification JWT (Backend)

Le template préconise l'utilisation de **Spring Security avec JWT** :

- Endpoints publics : `/api/v1/auth/**`, `/api/v1/public/**`, `/actuator/health`
- Endpoints protégés : toute autre route (dont `/api/v1/**` hors auth/public) nécessite un token JWT
- Refresh token : Rotation automatique recommandée
- Stockage : HttpOnly cookies (recommandé) ou localStorage

### Variables sensibles

⚠️ **Ne jamais commiter le fichier `.env`** - Utiliser `.env.example` comme référence.

Variables critiques à changer en production :
- `POSTGRES_PASSWORD`
- `JWT_SECRET` (minimum 256 bits)

## 📚 Documentation

### Documentation du projet

Le répertoire `docs/` contient toute la documentation du projet :

- **[docs/PROJECT.md](docs/PROJECT.md)** : 🎯 Vision et concept du projet
- **[docs/README.md](docs/README.md)** : Index et backlog des features
- **[docs/features/](docs/features/)** : Spécifications détaillées de chaque feature
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** : Architecture technique du projet
- **[docs/AI_CONTEXT.md](docs/AI_CONTEXT.md)** : Contexte pour les assistants IA

### Documentation Copilot

Ce template inclut une configuration complète pour GitHub Copilot :

- **AGENTS.md** : Règles opérationnelles pour les agents IA (conventions, contraintes, identité du projet)
- **.github/copilot-instructions.md** : Conventions et bonnes pratiques du projet
- **.github/agents/** : Définitions des agents spécialisés (api-builder, frontend-builder, db-migrator, etc.)
- **.github/instructions/** : Instructions ciblées par domaine (backend, frontend, docker, testing)
- **.github/skills/** : Skills Copilot par domaine (entity, service, controller, component, etc.)

## 📝 Initialisation d'un nouveau projet

Lorsque vous utilisez ce template pour créer un nouveau projet :

### 1️⃣ Définir la vision du projet
Éditer **[docs/PROJECT.md](docs/PROJECT.md)** pour décrire :
- La vision et le pitch du projet
- Les personas (types d'utilisateurs)
- Le domaine métier et le glossaire
- Les features principales et le périmètre MVP

### 2️⃣ Créer les spécifications des features
Pour chaque feature identifiée :
1. Copier `docs/features/_TEMPLATE.md`
2. Remplir les user stories, conception technique, etc.
3. Mettre à jour le backlog dans `docs/README.md`

### 3️⃣ Générer le code avec Copilot
Utiliser les skills disponibles pour générer :
- Les entités JPA (`backend-entity`)
- Les services et repositories (`backend-service`)
- Les controllers REST (`backend-controller`)
- Les composants React (`frontend-component`)
- Et plus encore...

## 🤝 Utilisation avec Copilot

Exemples de prompts efficaces :

```
Crée une entité JPA "Product" avec id, name, price et description
```

```
Génère un CRUD complet pour l'entité User avec authentification JWT
```

```
Crée un composant React "ProductCard" avec TypeScript
```

```
Configure Spring Security avec JWT pour ce projet
```

## 📝 Commandes Utiles

### Docker
```bash
# Logs
docker compose -f docker/docker-compose.yml logs -f [service]

# Rebuild
docker compose -f docker/docker-compose.yml up -d --build

# Nettoyage complet
docker compose -f docker/docker-compose.yml down -v
```

### Backend
```bash
# Tests
mvn test

# Build
mvn clean package -DskipTests

# Formatage
mvn spotless:apply
```

### Frontend
```bash
# Tests
npm run test

# Build
npm run build

# Lint
npm run lint
```

## 🔄 CI/CD

Ce template inclut des workflows GitHub Actions prêts à l'emploi :

### Workflows disponibles

| Workflow | Fichier | Déclencheur | Description |
|----------|---------|-------------|-------------|
| **CI** | `ci.yml` | Push/PR sur `main`, `develop` | Tests, lint, build |
| **Deploy Staging** | `deploy-staging.yml` | Push sur `develop` | Build & push images Docker |
| **Release** | `release.yml` | Tags `v*` | Création de release GitHub |

### CI Pipeline

Le workflow CI exécute :

1. **Backend Tests** (en parallèle)
   - PostgreSQL 16 via service container
   - `mvn verify` avec rapport de couverture JaCoCo

2. **Frontend Tests** (en parallèle)
   - `npm run lint` - Vérification du code
   - `npm run type-check` - Vérification TypeScript
   - `npm run test` - Tests unitaires avec couverture

3. **Build** (après succès des tests)
   - Build du JAR Spring Boot
   - Build du bundle React/Vite

4. **Docker** (sur `main` uniquement)
   - Build des images Docker backend et frontend

### Prérequis Frontend

Le `package.json` doit contenir ces scripts :

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  }
}
```

### Secrets à configurer (déploiement)

Pour le déploiement staging, configurer ces secrets dans GitHub :

| Secret | Description |
|--------|-------------|
| `STAGING_HOST` | Adresse du serveur staging |
| `STAGING_USER` | Utilisateur SSH |
| `STAGING_SSH_KEY` | Clé SSH privée |
| `STAGING_URL` | URL publique du staging |

### Action composite

Une action réutilisable est disponible dans `.github/actions/setup-project/` :

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: ./.github/actions/setup-project
    with:
      java-version: '21'
      node-version: '22'
```

## 📄 Licence

MIT
