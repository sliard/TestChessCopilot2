---
name: creer-crud-complet
description: Générer un CRUD fullstack standard (backend + frontend + tests)
argument-hint: "resource=<nom> fields=<champ1:type,champ2:type>"
agent: agent
---

# 🚀 Création CRUD complet (scaffold-driven)

## 📚 Contexte

Ce prompt sert à produire un **scaffold CRUD standard** rapide.
Références à appliquer :
- [Conventions backend](../../docs/conventions/backend.md)
- [Conventions frontend](../../docs/conventions/frontend.md)
- [Règles agents](../../AGENTS.md)

## 🔧 Tâche

- **Ressource** : ${input:resource:nom métier au singulier}
- **Champs** : ${input:fields:champ1:Type,champ2:Type}

## ✅ Checklist opérationnelle

### 1) Backend
- [ ] Entité JPA UUID + `createdAt`/`updatedAt`
- [ ] DTOs `Request`/`Response` en records avec validation
- [ ] Repository JPA + service interface/impl + controller `/api/...`
- [ ] OpenAPI minimal sur controller (`@Tag`, `@Operation`, `@ApiResponse`)
- [ ] Migration Flyway `V{n}__create_<resource>.sql`

### 2) Frontend
- [ ] Types TS alignés sur DTOs backend
- [ ] Service API typé (`create/getAll/getById/update/delete`)
- [ ] Hook custom si logique non triviale
- [ ] Composants CRUD (liste + formulaire + page)

### 3) Tests
- [ ] Backend : service unit + controller integration (+ repository si pertinent)
- [ ] Frontend : composants/hook (cas nominal + erreur)

### 4) Vérifications
- [ ] Lancer tests/lint sur modules modifiés
- [ ] Signaler hypothèses prises (noms, validations, pagination)

## 📤 Résultat attendu

1. Liste des fichiers créés/modifiés (backend, frontend, tests, migration)
2. Endpoints CRUD disponibles et chemins API
3. Écarts éventuels à finaliser manuellement
