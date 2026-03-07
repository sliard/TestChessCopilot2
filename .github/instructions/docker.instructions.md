---
applyTo: "docker/**"
---

# Conventions Docker & Infrastructure

## Stack

- Docker Compose pour orchestration
- PostgreSQL 16 (image `postgres:16-alpine`)
- Nginx comme reverse proxy / serveur frontend
- Multi-stage builds pour backend et frontend

## Nommage des conteneurs

- Format : `app-{service}` (ex: `app-postgres`, `app-backend`, `app-frontend`)

## Variables d'environnement

- `.env` pour variables locales (jamais commité)
- Documenter dans `.env.example`
- Préfixer les variables Vite avec `VITE_`
- Variables Spring via `SPRING_` ou variables custom

## Docker Compose

- Toujours déclarer `networks` et `volumes`
- `depends_on` pour l'ordre de démarrage
- Health checks quand possible
- Séparer dev (`docker-compose.dev.yml`) et prod (`docker-compose.yml`)

## Dockerfile Backend

- Base : `eclipse-temurin:21-jdk-alpine` (build) → `eclipse-temurin:21-jre-alpine` (run)
- Multi-stage : copier dépendances d'abord pour cache
- `EXPOSE 8080`

## Dockerfile Frontend

- Base : `node:22-alpine` (build) → `nginx:alpine` (run)
- `npm ci` pour installation reproductible
- Passer `VITE_API_URL` en ARG au build
- `EXPOSE 80`

## Nginx

- Config dans `docker/nginx/`
- Proxy pass `/api/` vers le backend
- SPA fallback : `try_files $uri $uri/ /index.html`

## Référence complète

Exemples de code détaillés : `docs/conventions/docker.md`
Skill template : `.github/skills/docker-compose/SKILL.md`

