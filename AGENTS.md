# AGENTS.md

> Instructions opérationnelles pour les agents IA. Pour le contexte détaillé du projet, voir [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md).

---

## 🎯 Identité du projet

Fullstack **Java 21 / Spring Boot 3.4.x** + **React 19 / Vite 6 / TypeScript 5.x** + **PostgreSQL 16** + **Docker**.

---

## ✅ TOUJOURS

- IDs en **UUID** (`@GeneratedValue(strategy = GenerationType.UUID)`)
- `createdAt` + `updatedAt` sur chaque entité (`@CreatedDate`, `@LastModifiedDate`)
- DTOs en **Java records** avec suffixes `Request`, `Response`, `ListResponse`
- **Bean Validation** sur tous les DTOs (`@NotBlank`, `@NotNull`, `@Positive`…)
- Services : **Interface + Impl**, `@Transactional(readOnly = true)` par défaut, `@Transactional` sur les mutations
- Controllers : préfixe `/api/`, `@RequiredArgsConstructor`, documentation OpenAPI (`@Tag`, `@Operation`)
- Tables PostgreSQL : **singulier**, snake_case (`product`, `order_item`, `app_user`)
- Colonnes : snake_case sans majuscule (`created_at`, `first_name`)
- Éviter les mots réservés PostgreSQL pour les noms de tables (`app_user` au lieu de `user`)
- Composants React : **functional only**, **export nommé** (pas de `default export`)
- Props : interface avec suffixe `Props`
- Hooks : préfixe `use`, retour typé `{ data, loading, error }`
- Services API frontend : objet avec méthodes async, types retour explicites
- Auth : JWT stateless, header `Authorization: Bearer {token}`
- Lombok : `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor`

## 🚫 JAMAIS

- Exposer une entité JPA directement dans un controller — toujours un DTO
- Mettre de la logique métier dans un controller
- Utiliser `Long` ou `Integer` comme type d'ID
- Utiliser `default export` en React
- Hardcoder des secrets dans le code ou les fichiers de config versionnés
- Utiliser des mots réservés PostgreSQL pour les noms de tables
- Désactiver le mode strict TypeScript

---

## 🤖 Agents

### Vue d'ensemble

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

### Composition multi-agents (exécution parallèle)

Pour une **feature CRUD complète** (ex: « Crée la feature Product full-stack ») :

```
Phase 1 — Génération (parallélisable)
├── api-builder      → Backend : entity, DTO, repository, service, controller
├── db-migrator      → Migration Flyway pour la table
└── frontend-builder → Frontend : types, service, hook, composant, page

Phase 2 — Tests (parallélisable, après Phase 1)
├── test-writer (backend)  → Tests service + controller + repository
└── test-writer (frontend) → Tests composant + hook

Phase 3 — Qualité (séquentiel, après Phase 2)
├── lint-fixer          → Vérification conventions et corrections
├── docs-writer         → OpenAPI annotations + feature spec
└── security-reviewer   → Audit sécurité endpoints + config
```

Pour un **ajout de service Docker** :

```
docker-deploy → Modifier docker-compose + Dockerfile + Nginx si nécessaire
```

Pour une **correction de bugs** :

```
lint-fixer → Identifier et corriger les violations de conventions
```

---

## 📦 Skills

| Déclencheur | Skill | Chemin |
|-------------|-------|--------|
| Entité JPA, modèle de données | `backend-entity` | `.github/skills/backend-entity/` |
| Service métier, repository | `backend-service` | `.github/skills/backend-service/` |
| Controller REST, endpoint | `backend-controller` | `.github/skills/backend-controller/` |
| DTO, mapper, MapStruct | `backend-dto-mapper` | `.github/skills/backend-dto-mapper/` |
| Spring Security, JWT, auth | `backend-security` | `.github/skills/backend-security/` |
| Exception, error handling | `backend-exception` | `.github/skills/backend-exception/` |
| Migration SQL, Flyway | `backend-migration` | `.github/skills/backend-migration/` |
| Tests JUnit, Mockito, Testcontainers | `backend-testing` | `.github/skills/backend-testing/` |
| Composant React | `frontend-component` | `.github/skills/frontend-component/` |
| Hook personnalisé | `frontend-hooks` | `.github/skills/frontend-hooks/` |
| Service API frontend | `frontend-services` | `.github/skills/frontend-services/` |
| Auth React, login, routes protégées | `frontend-auth` | `.github/skills/frontend-auth/` |
| Formulaire, react-hook-form, zod | `frontend-form` | `.github/skills/frontend-form/` |
| Routing, React Router, lazy loading | `frontend-routing` | `.github/skills/frontend-routing/` |
| State global, Zustand | `frontend-state` | `.github/skills/frontend-state/` |
| Tests Vitest, Testing Library, MSW | `frontend-testing` | `.github/skills/frontend-testing/` |
| Docker Compose, Dockerfile, Nginx | `docker-compose` | `.github/skills/docker-compose/` |
| Workflows CI/CD, GitHub Actions | `github-actions` | `.github/skills/github-actions/` |
| Spec feature, user stories | `feature-spec` | `.github/skills/feature-spec/` |
| Vision projet, MVP, personas | `project-spec` | `.github/skills/project-spec/` |

---

## 📝 Prompts Copilot

Des prompts structurés pour guider GitHub Copilot dans l'implémentation de features :

| Prompt | Utilisation | Chemin |
|--------|-------------|--------|
| `implement-feature` | Implémenter une feature complète depuis les specs | `.github/prompts/implement-feature.prompt.md` |
| `creer-entite` | Créer entité JPA + repository + migration | `.github/prompts/creer-entite.prompt.md` |
| `creer-crud-complet` | Générer CRUD fullstack (backend + frontend + tests) | `.github/prompts/creer-crud-complet.prompt.md` |
| `ajouter-endpoint` | Ajouter un endpoint REST à un controller existant | `.github/prompts/ajouter-endpoint.prompt.md` |
| `corriger-conventions` | Vérifier et corriger les violations de conventions | `.github/prompts/corriger-conventions.prompt.md` |
| `generer-tests` | Générer tests unitaires et d'intégration | `.github/prompts/generer-tests.prompt.md` |

**Documentation complète** : [`.github/prompts/README.md`](.github/prompts/README.md)

---

## 🛠️ Commandes essentielles

```bash
# Dev — PostgreSQL seul
docker compose -f docker/docker-compose.dev.yml up -d

# Prod — stack complète
docker compose -f docker/docker-compose.yml up -d --build

# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm run dev

# Tests
cd backend && mvn test
cd frontend && npm run test
```

---

## 📚 Fichiers de référence

| Fichier | Rôle |
|---------|------|
| `.github/copilot-instructions.md` | Conventions de code détaillées avec exemples |
| `docs/AI_CONTEXT.md` | Contexte technique complet, catalogue agents/skills |
| `docs/ARCHITECTURE.md` | Patterns d'architecture, structure des packages |
| `docs/PROJECT.md` | Vision métier, personas, domaine, MVP |
| `docs/conventions/backend.md` | Conventions backend détaillées |
| `docs/conventions/frontend.md` | Conventions frontend détaillées |
| `docs/conventions/docker.md` | Conventions Docker/infra |
| `docs/conventions/audit/` | Checklists d'audit détaillées (anciens agents de référence) |
