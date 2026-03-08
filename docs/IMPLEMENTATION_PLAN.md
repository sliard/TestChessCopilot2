# 🗺️ Implementation Plan — Chess Openings Trainer (ChessOT)

> **Date** : 2026-03-08
>
> **Prérequis** : Lire [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) pour l'état actuel du projet.
>
> **Approche** : Slices verticales — chaque slice livre de la valeur utilisable de bout en bout.

---

## 📐 Graphe de dépendances

```
Slice 0 — Scaffolding
├── Backend (pom.xml, Application.java, application.yml, configs)
└── Frontend (Vite init, package.json, tsconfig, deps)
        │
        ├─────────────────┬──────────────────────┐
        ▼                 ▼                      ▼
Slice 1               Slice 2a               Slice 3
Feature 001            Feature 002             Feature 005
Layout + i18n          Auth Backend            Échiquier
(frontend)            (backend)               (frontend)
        │                 │                      │
        ▼                 ▼                      │
        ├────────────► Slice 2b                  │
        │              Auth Frontend             │
        │              (frontend)                │
        │                 │                      │
        │                 ▼                      │
        │              Slice 4a                  │
        │              Feature 003               │
        │              Openings Backend          │
        │                 │                      │
        │                 ▼                      │
        ├────────────► Slice 4b ◄────────────────┘
        │              Feature 003
        │              Openings Frontend
        │                 │
        │                 ▼
        │              Slice 5a
        │              Feature 004
        │              CRUD Backend
        │                 │
        │                 ▼
        └────────────► Slice 5b
                       Feature 004
                       CRUD Frontend
                          │
                          ▼
                       Slice 6
                       Tests & Qualité
                          │
                          ▼
                       Slice 7
                       Fix doc statuses
```

---

## 🔨 Slice 0 — Scaffolding projet

**Objectif** : Créer les projets backend et frontend vides mais compilables.

### 0a — Backend scaffolding

| Fichier | Description |
|---------|-------------|
| `backend/pom.xml` | Spring Boot 3.4.x, Java 21, dépendances (Web, JPA, Security, PostgreSQL, Flyway, Lombok, Validation, springdoc-openapi) |
| `backend/src/main/java/com/chess/trainer/Application.java` | `@SpringBootApplication` + `@EnableJpaAuditing` |
| `backend/src/main/resources/application.yml` | Config PostgreSQL, JPA, Flyway, JWT, CORS (profils dev/prod) |
| `backend/src/main/resources/application-dev.yml` | Config dev (URL DB locale, log debug) |

**Config classes de base :**

| Classe | Description |
|--------|-------------|
| `config/OpenApiConfig.java` | Documentation Swagger (info, server) |
| `config/JpaAuditingConfig.java` | Enable auditing (`@CreatedDate`, `@LastModifiedDate`) |

**Validation** : `mvn compile` doit passer (pas de `mvn test` — pas de tests encore).

### 0b — Frontend scaffolding

| Action | Description |
|--------|-------------|
| `npm create vite@latest` | Projet React + TypeScript |
| `package.json` | Dépendances : react 19, react-router-dom, react-i18next, i18next, i18next-browser-languagedetector, chess.js, react-chessboard, react-hook-form, zod |
| `vite.config.ts` | Proxy `/api` → `localhost:8080` |
| `tsconfig.json` | Strict mode, path aliases |
| Structure `src/` | Dossiers vides : components/, pages/, hooks/, services/, store/, types/, utils/, i18n/ |

**Validation** : `npm run dev` doit démarrer. `npm run build` doit passer.

### 0c — Vérification Docker

| Action | Description |
|--------|-------------|
| `docker compose -f docker/docker-compose.dev.yml up -d` | PostgreSQL démarre |
| `mvn spring-boot:run` (backend) | Connexion DB réussie |
| `npm run dev` (frontend) | Vite sert l'app |

**Agents recommandés** : Aucun agent spécialisé — travail manuel ou `general-purpose`.

---

## 🎨 Slice 1 — Feature 001 : Layout, Landing & i18n

**Objectif** : Fondations visuelles et linguistiques de l'application.

**Scope** : Frontend uniquement (aucun endpoint backend).

| Composant | Fichier | Description |
|-----------|---------|-------------|
| i18n config | `src/i18n/index.ts` | Configuration i18next (détection langue, fallback FR, localStorage) |
| Traductions FR | `src/i18n/locales/fr/common.json`, `auth.json`, `openings.json`, `errors.json` | Contenu défini dans la spec |
| Traductions EN | `src/i18n/locales/en/common.json`, `auth.json`, `openings.json`, `errors.json` | Idem |
| Types i18n | `src/types/i18n.d.ts` | Typage strict des clés de traduction |
| Hook | `src/hooks/useLanguage.ts` | Accès langue courante, changement, liste des langues |
| Layout | `src/components/Layout.tsx` | Header + `<Outlet />` + Footer |
| LanguageSwitcher | `src/components/LanguageSwitcher.tsx` | Sélecteur FR/EN dans le header |
| HomePage | `src/pages/HomePage.tsx` | Hero, cartes valeur, aperçu ouvertures (statique), CTA |
| App routing | `src/App.tsx` | Routes avec Layout parent |
| Entry point | `src/main.tsx` | Import i18n |

**Critères de validation** :
- `/` affiche la landing traduite en FR
- Changement de langue instantané FR ↔ EN
- Choix de langue persisté en localStorage
- Header adapté (anonyme : Connexion/Inscription)
- Responsive (mobile hamburger menu)

**Agent recommandé** : `frontend-builder`

---

## 🔐 Slice 2a — Feature 002 : Authentification Backend

**Objectif** : Endpoints d'inscription, connexion et gestion JWT.

| Composant | Fichier(s) | Description |
|-----------|-----------|-------------|
| Entité | `entity/User.java` | UUID, email, password (hashed), firstName, lastName, role (enum), enabled, timestamps |
| Enum | `entity/Role.java` | `USER`, `ADMIN` |
| Migration | `resources/db/migration/V1__create_user_table.sql` | Table `app_user` |
| Repository | `repository/UserRepository.java` | `findByEmail`, `existsByEmail` |
| JWT Service | `security/JwtService.java` | Génération access/refresh tokens, validation, extraction claims |
| JWT Filter | `security/JwtAuthenticationFilter.java` | Filtre OncePerRequest, extraction token du header |
| UserDetails | `security/CustomUserDetailsService.java` | Charge User depuis DB |
| Security Config | `config/SecurityConfig.java` | Filter chain, CORS, endpoints publics, JWT stateless |
| Auth Service | `service/AuthService.java` + `AuthServiceImpl.java` | register, login, refresh, getCurrentUser |
| Auth Controller | `controller/AuthController.java` | 5 endpoints `/api/v1/auth/**` |
| DTOs | `dto/request/RegisterRequest.java`, `LoginRequest.java`, `RefreshTokenRequest.java` | Records avec validation |
| DTOs | `dto/response/AuthResponse.java`, `UserResponse.java` | Records |
| Exceptions | `exception/GlobalExceptionHandler.java`, `ResourceNotFoundException.java`, `ErrorResponse.java` | Gestion erreurs globale |

**Critères de validation** :
- `POST /api/v1/auth/register` crée un utilisateur et retourne JWT
- `POST /api/v1/auth/login` retourne access + refresh token
- `GET /api/v1/auth/me` retourne le profil avec token valide
- `GET /api/v1/auth/me` retourne 401 sans token
- Swagger UI accessible (`/swagger-ui/index.html`)

**Agents recommandés** : `api-builder` + `db-migrator`

---

## 🔐 Slice 2b — Feature 002 : Authentification Frontend

**Objectif** : Pages login/register, contexte auth, routes protégées.

**Dépendances** : Slice 1 (Layout) + Slice 2a (Auth Backend)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| Types | `src/types/auth.ts` | User, LoginRequest, RegisterRequest, AuthResponse |
| API client | `src/services/api.ts` | Client HTTP avec JWT auto-inject |
| Auth service | `src/services/authService.ts` | login, register, refresh, getCurrentUser |
| Auth context | `src/store/authContext.tsx` | AuthProvider, état utilisateur, gestion tokens |
| Hook | `src/hooks/useAuth.ts` | Accès contexte auth |
| Login page | `src/pages/auth/LoginPage.tsx` | Formulaire connexion |
| Register page | `src/pages/auth/RegisterPage.tsx` | Formulaire inscription |
| Protected route | `src/components/ProtectedRoute.tsx` | Redirect → /login si non authentifié |
| Layout update | `src/components/Layout.tsx` | Header auth-aware (connecté/anonyme) |
| App routing | `src/App.tsx` | Ajouter routes /login, /register, /dashboard |

**Critères de validation** :
- Inscription → connexion auto → redirect dashboard
- Connexion → header montre nom utilisateur + Déconnexion
- Déconnexion → header revient en mode anonyme
- Route `/dashboard` redirige vers `/login` si non connecté
- Refresh page conserve la session (token en localStorage)

**Agent recommandé** : `frontend-builder`

---

## ♟️ Slice 3 — Feature 005 : Échiquier interactif

**Objectif** : Composant échiquier réutilisable (frontend pur).

**Dépendances** : Slice 0b (frontend scaffolding uniquement)

> **Peut être développé en parallèle** des slices 1, 2a, 2b.

| Composant | Fichier | Description |
|-----------|---------|-------------|
| Utilitaire | `src/utils/movesParser.ts` | Parse "1.e4 e5 2.Nf3 Nc6" → ['e4', 'e5', 'Nf3', 'Nc6'] |
| Hook | `src/hooks/useChessboard.ts` | Logique chess.js : position, navigation, parse |
| Hook | `src/hooks/useKeyboardNavigation.ts` | ←/→/Home/End handlers |
| Composant | `src/components/chessboard/Chessboard.tsx` | Échiquier principal (react-chessboard + chess.js) |
| Composant | `src/components/chessboard/ChessboardControls.tsx` | Boutons |◀ ◀ ▶ ▶| |
| Composant | `src/components/chessboard/MovesList.tsx` | Liste notation algébrique |

**Critères de validation** :
- Affiche un échiquier 8×8 correct à partir de coups en notation algébrique
- Navigation ▶/◀ joue/annule les coups avec position correcte
- Coup actuel surligné dans la liste
- Clavier ←/→ fonctionne
- Toggle orientation blanc/noir
- Responsive (min 300px mobile)

**Agent recommandé** : `frontend-builder`

---

## 📖 Slice 4a — Feature 003 : Ouvertures publiques Backend

**Objectif** : Entité Opening, endpoints publics, seed data.

**Dépendances** : Slice 2a (entité User existe, SecurityConfig en place)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| Entité | `entity/Opening.java` | UUID, name, description, ecoCode, moves, isPublic, ManyToOne User, timestamps |
| Migration | `V2__create_opening_table.sql` | Table `opening` avec FK vers `app_user`, index `idx_opening_user_id` |
| Seed data | `V3__insert_sample_openings.sql` | 3 ouvertures publiques système (Sicilienne, Ruy Lopez, Gambit du Roi) |
| Repository | `repository/OpeningRepository.java` | `findByIsPublicTrue(Pageable)`, `findByIdAndIsPublicTrue(UUID)`, search |
| DTO | `dto/response/OpeningListItemResponse.java` | id, name, description, ecoCode, movesCount, author, createdAt |
| DTO | `dto/response/OpeningDetailResponse.java` | + moves, updatedAt |
| DTO | `dto/response/PageResponse.java` | Generic paginated response |
| Service | `service/PublicOpeningService.java` + Impl | findAll (paginated, searchable), findById |
| Controller | `controller/PublicOpeningController.java` | 3 endpoints `/api/v1/public/openings/**` |

**Critères de validation** :
- `GET /api/v1/public/openings` retourne les 3 ouvertures seed (paginées)
- `GET /api/v1/public/openings/{id}` retourne le détail avec moves
- `GET /api/v1/public/openings/search?q=sicil` retourne la Sicilienne
- Endpoints accessibles sans token (publics)

**Agent recommandé** : `api-builder` + `db-migrator`

---

## 📖 Slice 4b — Feature 003 : Ouvertures publiques Frontend

**Objectif** : Pages de consultation publique avec échiquier intégré.

**Dépendances** : Slice 1 (Layout) + Slice 3 (Chessboard) + Slice 4a (API publique)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| Types | `src/types/opening.ts` | OpeningListItem, OpeningDetail, PageResponse |
| Types | `src/types/common.ts` | Page<T>, PaginationParams |
| Service | `src/services/publicOpeningService.ts` | getPublicOpenings, getPublicOpening |
| Hook | `src/hooks/usePublicOpenings.ts` | Liste paginée avec recherche |
| Hook | `src/hooks/usePublicOpening.ts` | Détail d'une ouverture |
| Hook | `src/hooks/useDebounce.ts` | Debounce pour la recherche |
| Composant | `src/components/openings/OpeningCard.tsx` | Card ouverture (nom, ECO, description, movesCount) |
| Composant | `src/components/openings/OpeningList.tsx` | Liste paginée de cards |
| Composant | `src/components/openings/SearchBar.tsx` | Barre de recherche avec debounce |
| Composant | `src/components/openings/RegisterCTA.tsx` | Banner incitation inscription |
| Page | `src/pages/OpeningsListPage.tsx` | `/openings` — liste publique |
| Page | `src/pages/OpeningDetailPage.tsx` | `/openings/:id` — détail avec échiquier |
| Routing | `src/App.tsx` | Ajouter routes `/openings`, `/openings/:id` |

**Critères de validation** :
- `/openings` affiche les 3 ouvertures seed avec pagination
- Recherche par nom fonctionnelle (debounced)
- Clic sur une carte → `/openings/:id` avec échiquier interactif
- Navigation dans les coups via l'échiquier
- CTA inscription visible (non intrusif, fermable)
- Responsive

**Agent recommandé** : `frontend-builder`

---

## ✏️ Slice 5a — Feature 004 : Gestion ouvertures Backend

**Objectif** : CRUD authentifié sur les ouvertures de l'utilisateur.

**Dépendances** : Slice 2a (Auth) + Slice 4a (entité Opening)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| DTOs Request | `dto/request/CreateOpeningRequest.java`, `UpdateOpeningRequest.java`, `UpdateVisibilityRequest.java` | Records avec Bean Validation |
| DTOs Response | `dto/response/UserOpeningResponse.java`, `UserOpeningListItemResponse.java` | Records |
| Repository | `repository/OpeningRepository.java` (ajout) | `findByUserId`, `findByIdAndUserId`, `searchByUserIdAndName` |
| Service | `service/UserOpeningService.java` + Impl | CRUD scoped à l'utilisateur |
| Controller | `controller/UserOpeningController.java` | 6 endpoints `/api/v1/openings/**` (auth required) |

**Critères de validation** :
- `POST /api/v1/openings` crée une ouverture pour l'utilisateur connecté
- `GET /api/v1/openings` retourne uniquement les ouvertures de l'utilisateur
- `PUT /api/v1/openings/{id}` modifie (si propriétaire)
- `DELETE /api/v1/openings/{id}` supprime (si propriétaire)
- `PATCH /api/v1/openings/{id}/visibility` toggle public/privé
- Accès à l'ouverture d'un autre utilisateur → 404 (pas 403)
- Sans token → 401

**Agent recommandé** : `api-builder`

---

## ✏️ Slice 5b — Feature 004 : Gestion ouvertures Frontend

**Objectif** : Pages CRUD avec validation des coups et prévisualisation.

**Dépendances** : Slice 2b (Auth Frontend) + Slice 3 (Chessboard) + Slice 5a (CRUD API)

| Composant | Fichier | Description |
|-----------|---------|-------------|
| Types | `src/types/opening.ts` (ajout) | UserOpening, CreateOpeningRequest, UpdateOpeningRequest, etc. |
| Service | `src/services/userOpeningService.ts` | CRUD API calls |
| Utilitaire | `src/utils/movesValidator.ts` | Validation coups via chess.js |
| Hook | `src/hooks/useMyOpenings.ts` | Liste paginée des ouvertures de l'utilisateur |
| Hook | `src/hooks/useCreateOpening.ts` | Mutation création |
| Hook | `src/hooks/useUpdateOpening.ts` | Mutation mise à jour |
| Hook | `src/hooks/useDeleteOpening.ts` | Mutation suppression |
| Hook | `src/hooks/useValidateMoves.ts` | Validation temps réel via chess.js |
| Composant | `src/components/openings/MyOpeningCard.tsx` | Card avec badge visibilité + actions |
| Composant | `src/components/openings/OpeningForm.tsx` | Formulaire création/édition |
| Composant | `src/components/openings/MovesInput.tsx` | Champ coups avec feedback temps réel |
| Composant | `src/components/openings/VisibilityBadge.tsx` | Badge 🔓/🔒 |
| Composant | `src/components/openings/DeleteConfirmModal.tsx` | Modal confirmation |
| Page | `src/pages/MyOpeningsPage.tsx` | `/my-openings` — liste mes ouvertures |
| Page | `src/pages/CreateOpeningPage.tsx` | `/openings/new` — formulaire création |
| Page | `src/pages/EditOpeningPage.tsx` | `/openings/:id/edit` — formulaire édition |
| Routing | `src/App.tsx` | Routes protégées `/my-openings`, `/openings/new`, `/openings/:id/edit` |

**Critères de validation** :
- `/my-openings` affiche les ouvertures de l'utilisateur (vide initialement)
- Création avec validation coups en temps réel + prévisualisation échiquier
- Modification avec formulaire pré-rempli
- Suppression avec confirmation modale
- Toggle visibilité via badge
- État vide avec CTA "Créer ma première ouverture"
- Routes protégées (redirect `/login` si non connecté)

**Agent recommandé** : `frontend-builder`

---

## 🧪 Slice 6 — Tests & Qualité

**Objectif** : Tests unitaires et d'intégration, lint, couverture.

**Dépendances** : Toutes les slices précédentes.

### Backend

| Type | Scope | Outils |
|------|-------|--------|
| Unit tests | AuthService, PublicOpeningService, UserOpeningService | JUnit 5, Mockito |
| Integration tests | AuthController, PublicOpeningController, UserOpeningController | `@WebMvcTest`, MockMvc, `@MockBean` |
| Repository tests | OpeningRepository, UserRepository | `@DataJpaTest`, Testcontainers PostgreSQL |

### Frontend

| Type | Scope | Outils |
|------|-------|--------|
| Component tests | Layout, OpeningCard, Chessboard, OpeningForm | Vitest, Testing Library |
| Hook tests | useChessboard, usePublicOpenings, useAuth | renderHook, Testing Library |
| Service tests | publicOpeningService, authService | Vitest, MSW |

**Agents recommandés** : `test-writer` (backend) + `test-writer` (frontend)

---

## 📝 Slice 7 — Correction documentation

**Objectif** : Mettre à jour les statuts dans la documentation pour refléter la réalité.

| Fichier | Action |
|---------|--------|
| `docs/features/003-public-openings-browsing.md` | Statut `Implemented` → `Ready`, décocher `[x]` → `[ ]` sur les critères non implémentés |
| `docs/features/005-interactive-chessboard.md` | Décocher objectifs et DoD `[x]` → `[ ]` |
| `docs/PROJECT.md` | Décocher MVP checklist `[x]` → `[ ]` (lignes 127–132) |
| `docs/README.md` | Mettre à jour les statuts du backlog si nécessaire |

> **Note** : Cette correction peut être faite en premier (Slice 0) ou en dernier. Recommandation : en dernier, une fois que les features sont implémentées et qu'on peut recocher les items légitimement.

---

## ⏱️ Parallélisme possible

```
Séquentiel obligatoire :
  Slice 0 → {Slice 1, Slice 2a, Slice 3}  (en parallèle)
                      ↓
  Slice 2a → Slice 2b → Slice 4a → {Slice 4b, Slice 5a}
                                       ↓         ↓
                                   Slice 5a → Slice 5b → Slice 6 → Slice 7

Parallélisable :
  • Slice 1 ‖ Slice 2a ‖ Slice 3  (après Slice 0)
  • Slice 4b ‖ Slice 5a  (si 4a terminé)
```

**Agents en parallèle (Phase 1)** :
- `frontend-builder` → Slice 1 (Layout + i18n)
- `api-builder` + `db-migrator` → Slice 2a (Auth Backend)
- `frontend-builder` → Slice 3 (Chessboard)

---

## 🎯 Recommandation : Features 003 et 005

### Feature 003 (Public Browsing)
**Verdict : Réimplémentation complète nécessaire.**
- Le statut "Implemented" dans la spec est **incorrect** — aucun code n'existe.
- La spec est excellente et détaillée ; elle peut être suivie telle quelle.
- Le SQL de seed data est fourni dans la spec — à utiliser tel quel.

### Feature 005 (Interactive Chessboard)
**Verdict : Réimplémentation complète nécessaire.**
- Les items DoD cochés sont **aspirationnels**, pas factuels.
- L'approche recommandée (`react-chessboard` + `chess.js`) est la bonne.
- Le code des utilitaires (`movesParser`, `pieceRenderer`) est fourni dans la spec.

### Pourquoi "réimplémenter" plutôt que "vérifier"
Il n'y a rien à vérifier. Les répertoires `backend/` et `frontend/` sont vides. Il s'agit d'une **implémentation initiale** à partir des spécifications existantes, pas d'une réimplémentation.

---

## 📚 Références

| Document | Rôle |
|----------|------|
| [`IMPLEMENTATION_STATUS.md`](./IMPLEMENTATION_STATUS.md) | État détaillé par feature |
| [`PROJECT.md`](./PROJECT.md) | Vision, personas, MVP |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Patterns de code et conventions |
| [`AI_CONTEXT.md`](./AI_CONTEXT.md) | Contexte pour les agents IA |
| [`features/001-landing-layout-i18n.md`](./features/001-landing-layout-i18n.md) | Spec Feature 001 |
| [`features/002-user-authentication.md`](./features/002-user-authentication.md) | Spec Feature 002 |
| [`features/003-public-openings-browsing.md`](./features/003-public-openings-browsing.md) | Spec Feature 003 |
| [`features/004-opening-management.md`](./features/004-opening-management.md) | Spec Feature 004 |
| [`features/005-interactive-chessboard.md`](./features/005-interactive-chessboard.md) | Spec Feature 005 |
