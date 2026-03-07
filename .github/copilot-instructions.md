# Instructions GitHub Copilot

## 🎯 Stack technique

- **Backend** : Java 21, Spring Boot 3.4.x, Spring Security 6.x, Spring Data JPA, PostgreSQL 16
- **Frontend** : Node.js 22, React 19, Vite 6.x, TypeScript 5.x
- **Infrastructure** : Docker, Docker Compose, Nginx

## 📐 Architecture

### Backend — Architecture en couches

```
controller/ → REST endpoints, validation
    ↓
service/    → Logique métier, transactions
    ↓
repository/ → Accès données JPA
    ↓
entity/     → Modèles de données
```

### Frontend — Structure fonctionnelle

```
pages/      → Composants de page (routes)
components/ → Composants réutilisables
hooks/      → Logique réutilisable
services/   → Appels API
store/      → État global (Zustand)
types/      → Définitions TypeScript
```

## 🎯 Décisions architecturales clés

1. **UUID > Long** : Évolutivité, distribution, sécurité
2. **Records > Classes** : Immutabilité, concision (DTOs)
3. **Interface service** : Testabilité, découplage
4. **JWT stateless** : Scalabilité horizontale
5. **Zustand > Redux** : Simplicité, moins de boilerplate
6. **Vite > CRA** : Performance, HMR rapide
7. **PostgreSQL 16** : Robustesse, JSONB, performances

## ✅ Checklist création de feature

### Backend
- [ ] Entité avec UUID + timestamps (`createdAt`, `updatedAt`)
- [ ] Table singulier snake_case, colonnes snake_case
- [ ] DTO Request/Response (records) + Bean Validation
- [ ] Service interface + impl + `@Transactional`
- [ ] Controller `/api/` + OpenAPI docs
- [ ] Tests unitaires + intégration

### Frontend
- [ ] Types TypeScript + Service API typé
- [ ] Hook custom si logique complexe
- [ ] Component fonctionnel, export nommé, props typées
- [ ] Gestion loading/error
- [ ] Tests composant + hook

## 📚 Ressources

- **Conventions détaillées** : `docs/conventions/backend.md`, `frontend.md`, `docker.md`
- **Architecture** : `docs/ARCHITECTURE.md`
- **Skills (templates)** : `.github/skills/`
- **Instructions ciblées** : `.github/instructions/` (backend, frontend, docker, testing)
