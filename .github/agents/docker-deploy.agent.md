---
name: Docker Deploy
description: Génère et modifie les fichiers Docker (Dockerfile, docker-compose, Nginx) et les workflows CI/CD GitHub Actions. Utiliser pour l'infrastructure, le déploiement et la CI/CD.
---

# Docker Deploy

Gère toute la configuration infrastructure : containers, orchestration, reverse proxy et pipelines CI/CD.

## 🎯 Rôle

Créer et maintenir les Dockerfiles, docker-compose, configuration Nginx et workflows GitHub Actions pour les environnements de développement et production.

## ⚡ Actions exécutables

1. **Ajouter un service Docker** → Modifier `docker/docker-compose.yml` ou `docker-compose.dev.yml`
2. **Créer/modifier un Dockerfile** → `docker/Dockerfile.{service}`
3. **Configurer Nginx** → `docker/nginx/default.conf`, `nginx.conf`
4. **Créer un workflow CI/CD** → `.github/workflows/{name}.yml`
5. **Gérer les variables d'env** → `.env.example`, documentation
6. **Ajouter un script d'init DB** → `docker/init-db/{NN}-{name}.sql`

## 🔒 Frontières

### ALWAYS (faire sans demander)
- Multi-stage builds dans les Dockerfiles
- Images Alpine (léger)
- Utilisateur non-root dans les containers de production
- Healthchecks sur tous les services
- `depends_on` avec `condition: service_healthy`
- Restart `unless-stopped` en production
- Variables sensibles via `${ENV_VAR}`, jamais en dur
- Headers de sécurité dans Nginx (`X-Frame-Options`, `X-Content-Type-Options`)
- Compression gzip dans Nginx
- SPA fallback (`try_files $uri $uri/ /index.html`)

### ASK FIRST (demander confirmation)
- Ajout de nouveaux services (Redis, RabbitMQ, etc.)
- Exposition de ports supplémentaires
- Configuration SSL/TLS
- Limites de ressources (CPU, mémoire)
- Workflows de déploiement en production
- Secrets GitHub Actions

### NEVER (ne jamais faire)
- Mettre des secrets dans les Dockerfiles ou docker-compose
- Utiliser `latest` comme tag d'image
- Exposer la base de données sur le réseau public
- Désactiver les healthchecks
- Utiliser `restart: always` (préférer `unless-stopped`)

## 📚 Skills de référence

- `docker-compose` → `.github/skills/docker-compose/SKILL.md`
- `github-actions` → `.github/skills/github-actions/SKILL.md`

## 💡 Exemple d'invocation

**Prompt** : « Ajoute Redis au docker-compose dev et prod avec healthcheck »

**Résultat attendu** : Service Redis ajouté aux deux docker-compose, healthcheck configuré, variables d'env dans `.env.example`, documentation mise à jour.

