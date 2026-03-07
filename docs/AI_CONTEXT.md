# AI_CONTEXT.md

> Ce fichier fournit le contexte essentiel aux assistants IA (GitHub Copilot, ChatGPT, Claude, etc.) pour comprendre et contribuer efficacement à ce projet.

## 🎯 Contexte Métier

> **Important pour les IA** : Pour comprendre le contexte métier spécifique de ce projet (vision, personas, domaine, MVP), consultez en priorité le fichier [`PROJECT.md`](./PROJECT.md).
>
> Ce fichier `AI_CONTEXT.md` décrit l'aspect **technique** du template, tandis que `PROJECT.md` décrit le **quoi** et le **pourquoi** du projet spécifique.

---

## 📋 Résumé du Projet

**JavaViteTemplate** est un template de projet fullstack moderne conçu pour accélérer le développement d'applications web. Il combine un backend robuste en Java/Spring Boot avec un frontend réactif en React/TypeScript.

### Objectif
Fournir une base de code prête à l'emploi avec :
- Une architecture clean et des conventions établies
- Une configuration Docker complète (dev et prod)
- Une authentification JWT intégrée
- Des instructions IA pour une assistance optimale

---

## 🏗️ Stack Technique

### Backend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Java | 21 LTS | Langage principal |
| Spring Boot | 3.4.x | Framework applicatif |
| Spring Security | 6.x | Authentification JWT |
| Spring Data JPA | 3.4.x | ORM et accès données |
| PostgreSQL | 16 | Base de données |
| Maven | 3.9.x | Build et dépendances |

### Frontend
| Technologie | Version | Rôle |
|-------------|---------|------|
| Node.js | 22 LTS | Runtime |
| React | 19.x | Bibliothèque UI |
| Vite | 6.x | Build tool |
| TypeScript | 5.x | Typage statique |

### Infrastructure
| Technologie | Version | Rôle |
|-------------|---------|------|
| Docker | 24+ | Containerisation |
| Docker Compose | 2.x | Orchestration |
| Nginx | Alpine | Reverse proxy |

---

## 📁 Structure du Projet

```
JavaViteTemplate/
├── backend/                    # API Spring Boot
│   └── src/main/java/com/example/
│       ├── config/             # Configuration Spring
│       ├── controller/         # REST Controllers
│       ├── dto/                # Data Transfer Objects
│       ├── entity/             # Entités JPA
│       ├── repository/         # Repositories JPA
│       ├── security/           # JWT & Spring Security
│       ├── service/            # Logique métier
│       └── Application.java
│
├── frontend/                   # Application React
│   └── src/
│       ├── components/         # Composants réutilisables
│       ├── pages/              # Pages/Routes
│       ├── hooks/              # Custom hooks
│       ├── services/           # Appels API
│       ├── store/              # État global
│       ├── types/              # Types TypeScript
│       └── App.tsx
│
├── docker/
│   ├── docker-compose.yml      # Production complète
│   ├── docker-compose.dev.yml  # Dev (PostgreSQL seul)
│   ├── Dockerfile.backend      # Build Spring Boot
│   ├── Dockerfile.frontend     # Build React + Nginx
│   ├── nginx/                  # Config Nginx
│   └── init-db/                # Scripts SQL init
│
├── .github/
│   ├── copilot-instructions.md # Conventions Copilot
│   ├── agents/                 # Agents IA spécialisés
│   ├── skills/                 # Skills par domaine
│   └── hooks/                  # Git hooks
│
├── AGENTS.md                   # Instructions opérationnelles agents IA
├── .env.example                # Template variables d'env
└── README.md                   # Documentation principale
```

---

## 🎯 Architecture et Patterns

### Backend - Architecture en Couches

```
Controller  →  Service  →  Repository  →  Entity
    ↓             ↓            ↓            ↓
  REST API    Business    Data Access   Database
              Logic       (JPA)         (PostgreSQL)
```

**Flux de données :**
1. **Controller** : Reçoit les requêtes HTTP, valide les DTOs
2. **Service** : Contient la logique métier, gère les transactions
3. **Repository** : Interface JPA pour l'accès aux données
4. **Entity** : Mapping objet-relationnel avec la base

### Frontend - Architecture Fonctionnelle

```
Pages  →  Components  →  Hooks  →  Services  →  API
```

**Principes :**
- Composants fonctionnels uniquement (pas de classes)
- État géré via hooks personnalisés
- Séparation logique UI / appels API

---

## 🗄️ Conventions Base de Données (PostgreSQL)

### Règles de nommage

| Élément | Convention | Exemple |
|---------|------------|---------|
| Tables | **Singulier**, snake_case | `product`, `order_item`, `app_user` |
| Colonnes | snake_case, sans majuscule | `created_at`, `first_name`, `order_id` |
| Clés primaires | UUID | `id UUID PRIMARY KEY` |
| Clés étrangères | `{table}_id` | `product_id`, `user_id` |

### Règles générales

- **Tables au singulier** : `product` (pas `products`), `order_item` (pas `order_items`)
- **Colonnes en snake_case** : tout en minuscules, mots séparés par des underscores (`_`)
- **Clés primaires UUID** : chaque table doit avoir une colonne `id` de type UUID, générée automatiquement
- **Timestamps obligatoires** : chaque table doit inclure `created_at` et `updated_at`
- ⚠️ **Mots réservés PostgreSQL** : éviter les mots réservés pour les noms de tables (ex : utiliser `app_user` au lieu de `user`)

---

## 📐 Conventions de Code

### Backend (Java/Spring)

| Élément | Convention | Exemple |
|---------|------------|---------|
| Entités | UUID + timestamps | `@GeneratedValue(strategy = GenerationType.UUID)` |
| Tables | Singulier, snake_case | `@Table(name = "product")` |
| Colonnes | snake_case, sans majuscule | `created_at`, `first_name`, `order_id` |
| Clés primaires | UUID généré | `private UUID id;` avec `GenerationType.UUID` |
| DTOs | Records avec suffixes | `ProductRequest`, `ProductResponse` |
| Services | Interface + Impl | `ProductService` + `ProductServiceImpl` |
| Endpoints | `/api/` prefix | `@RequestMapping("/api/products")` |
| Transactions | ReadOnly par défaut | `@Transactional(readOnly = true)` |

### Frontend (React/TypeScript)

| Élément | Convention | Exemple |
|---------|------------|---------|
| Composants | PascalCase, export nommé | `export const ProductCard: React.FC<Props>` |
| Props | Interface avec suffixe | `interface ProductCardProps` |
| Hooks | Préfixe `use` | `useProducts()`, `useAuth()` |
| Services | Objet avec méthodes async | `productService.findAll()` |
| Types | Interface pour modèles | `interface Product { id: string; }` |

---

## 🔐 Sécurité

### Authentification JWT

- **Endpoints publics** : `/api/v1/auth/**`, `/api/v1/public/**`, `/actuator/health`
- **Endpoints protégés** : Tous les autres endpoints (dont `/api/v1/**` hors auth/public)
- **Stockage token** : HttpOnly cookies (recommandé) ou localStorage
- **Durée token** : 24h par défaut (configurable)

### Variables Sensibles

| Variable | Description | Criticité |
|----------|-------------|-----------|
| `POSTGRES_PASSWORD` | Mot de passe BDD | 🔴 Critique |
| `JWT_SECRET` | Clé de signature JWT | 🔴 Critique |
| `SPRING_PROFILES_ACTIVE` | Profil Spring | 🟡 Important |

⚠️ **Ne jamais commiter `.env`** - Utiliser `.env.example` comme référence.

---

## 🐳 Docker

### Mode Développement
```bash
# Lance PostgreSQL uniquement
docker compose -f docker/docker-compose.dev.yml up -d
```

### Mode Production
```bash
# Lance l'ensemble (PostgreSQL + Backend + Frontend)
docker compose -f docker/docker-compose.yml up -d --build
```

### Services et Ports

| Service | Container | Port | URL |
|---------|-----------|------|-----|
| PostgreSQL | app-postgres | 5432 | - |
| Backend | app-backend | 8080 | http://localhost:8080/api |
| Frontend | app-frontend | 80/443 | http://localhost |

---

## 🤖 Assistance IA

### Agents Disponibles

| Agent | Fichier | Action principale |
|-------|---------|-------------------|
| API Builder | `.github/agents/api-builder.agent.md` | Génère entity + DTO + service + controller + migration CRUD |
| Frontend Builder | `.github/agents/frontend-builder.agent.md` | Génère types + service + hook + composant + page React |
| Test Writer | `.github/agents/test-writer.agent.md` | Génère tests unitaires et d'intégration (JUnit/Vitest) |
| Docs Writer | `.github/agents/docs-writer.agent.md` | Génère OpenAPI annotations, feature specs, README |
| Lint Fixer | `.github/agents/lint-fixer.agent.md` | Corrige style, conventions, exports, nommage |
| Docker Deploy | `.github/agents/docker-deploy.agent.md` | Gère Dockerfile, docker-compose, Nginx, CI/CD |
| Security Reviewer | `.github/agents/security-reviewer.agent.md` | Audite Spring Security, JWT, secrets, endpoints |
| DB Migrator | `.github/agents/db-migrator.agent.md` | Génère migrations Flyway, vérifie cohérence schéma |

> Les checklists d'audit détaillées (anciens agents) sont archivées dans `docs/conventions/audit/`.

### Skills Disponibles

#### Backend (Spring Boot)

| Skill | Description | Exemples de prompts |
|-------|-------------|---------------------|
| `backend-entity` | Entités JPA avec UUID, timestamps, relations, Lombok | "Crée une entité Product avec name, price et description" |
| `backend-service` | Services (Interface + Impl), repositories, transactions | "Crée un service ProductService avec CRUD complet" |
| `backend-controller` | Controllers REST, pagination, OpenAPI, `@PreAuthorize` | "Crée un controller REST pour Product avec pagination" |
| `backend-dto-mapper` | Mappers DTO avec MapStruct ou mapping manuel | "Crée un mapper MapStruct pour Product" |
| `backend-security` | Spring Security 6.x, JWT access/refresh tokens, CORS | "Configure Spring Security avec JWT et refresh token" |
| `backend-exception` | Exceptions métier, `@RestControllerAdvice`, erreurs standardisées | "Crée les exceptions pour le domaine Order" |
| `backend-migration` | Migrations Flyway versionnées, création/modification de schéma | "Crée une migration pour la table product" |
| `backend-testing` | Tests JUnit 5, Mockito, `@WebMvcTest`, Testcontainers, JaCoCo | "Crée les tests unitaires pour ProductService" |

#### Frontend (React/Vite)

| Skill | Description | Exemples de prompts |
|-------|-------------|---------------------|
| `frontend-component` | Composants fonctionnels TypeScript, props typées, accessibilité | "Crée un composant ProductCard avec image et prix" |
| `frontend-hooks` | Hooks data fetching, mutation, utilitaires (debounce, localStorage) | "Crée un hook useProducts pour charger les produits" |
| `frontend-services` | Client API, services par entité, gestion erreurs, upload | "Crée un service API pour les produits" |
| `frontend-auth` | AuthContext, hook `useAuth`, `ProtectedRoute`, gestion tokens | "Configure l'authentification avec contexte React" |
| `frontend-form` | Formulaires react-hook-form + validation zod | "Crée un formulaire de création de produit" |
| `frontend-routing` | React Router, lazy loading, routes protégées, layouts | "Configure les routes du module produits" |
| `frontend-state` | Stores Zustand avec persistence, slices, Immer | "Crée un store pour le panier d'achat" |
| `frontend-testing` | Tests Vitest, Testing Library, MSW, renderHook | "Crée les tests pour ProductCard" |

#### Transverse

| Skill | Description | Exemples de prompts |
|-------|-------------|---------------------|
| `docker-compose` | Config dev/prod, services additionnels, Dockerfiles, Nginx | "Ajoute Redis au docker-compose" |
| `github-actions` | Pipelines CI/CD, scanning sécurité (CodeQL, Trivy), releases | "Crée un workflow CI complet" |
| `feature-spec` | Spécifications de features, user stories, critères d'acceptation | "Crée la spec pour la gestion des produits" |
| `project-spec` | Vision projet, personas, domaine métier, MVP | "Aide-moi à remplir le PROJECT.md" |

### Bonnes pratiques pour les prompts

**Structure recommandée** : `[Action] [Objet] avec [caractéristiques] pour [contexte]`

- ✅ "Crée une entité Order avec id, status (enum PENDING/CONFIRMED/SHIPPED), totalAmount et relation ManyToOne vers User"
- ✅ "Génère un composant ProductList qui affiche une grille de ProductCard avec pagination et état de chargement"
- ❌ "Crée un produit" (trop vague)

**Conseils** :
1. Mentionnez les champs, types et relations
2. Donnez le contexte (admin, public, API interne)
3. Référencez les entités existantes ("avec relation vers Product existant")
4. Précisez les contraintes ("avec validation email unique")

---

## 📝 Fichiers de Configuration Clés

| Fichier | Emplacement | Description |
|---------|-------------|-------------|
| `AGENTS.md` | Racine | Instructions opérationnelles pour agents IA (règles DO/NEVER, routing) |
| `copilot-instructions.md` | `.github/` | Conventions de code détaillées avec exemples |
| `AI_CONTEXT.md` | `docs/` | Contexte technique complet, catalogue agents/skills |
| `ARCHITECTURE.md` | `docs/` | Patterns d'architecture, structure des packages |
| `PROJECT.md` | `docs/` | Vision métier, personas, domaine, MVP |
| `.env.example` | Racine | Template variables d'environnement |
| `application.yml` | `backend/src/main/resources/` | Config Spring Boot |
| `vite.config.ts` | `frontend/` | Config Vite |

---

## ✅ Checklist Nouveau Code

### Backend
- [ ] Entité avec UUID et timestamps (`createdAt`, `updatedAt`)
- [ ] Table nommée au singulier en snake_case (`product`, `order_item`)
- [ ] Colonnes en snake_case sans majuscule (`created_at`, `first_name`)
- [ ] Clé primaire UUID avec `@GeneratedValue(strategy = GenerationType.UUID)`
- [ ] DTOs Request/Response séparés
- [ ] Validation Bean Validation (`@NotBlank`, `@NotNull`, etc.)
- [ ] Service avec interface + implémentation
- [ ] `@Transactional` approprié
- [ ] Documentation OpenAPI (`@Tag`, `@Operation`)
- [ ] Tests unitaires

### Frontend
- [ ] Types TypeScript définis
- [ ] Props interface pour les composants
- [ ] Gestion loading/error/data dans les hooks
- [ ] Export nommé (pas de `default export`)
- [ ] Responsive design

---

## 🔗 Ressources

- **Documentation Spring Boot** : https://docs.spring.io/spring-boot/docs/current/reference/html/
- **Documentation React** : https://react.dev/
- **Documentation Vite** : https://vitejs.dev/
- **Spring Security JWT** : https://docs.spring.io/spring-security/reference/
