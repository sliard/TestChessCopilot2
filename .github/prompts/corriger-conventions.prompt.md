---
name: corriger-conventions
description: Vérifier et corriger les écarts de conventions du projet
argument-hint: "scope=<backend|frontend|all>"
agent: lint-fixer
---

# ✨ Correction des conventions

## 📚 Contexte

Références normatives (ne pas recopier les règles) :
- [Conventions backend](../../docs/conventions/backend.md)
- [Conventions frontend](../../docs/conventions/frontend.md)
- [Règles agents et workflow](../../AGENTS.md)

## 🔧 Tâche

- **Scope** : ${input:scope:backend, frontend, ou all}
- Auditer le code existant, appliquer les corrections sûres, puis lister les points manuels restants.

## ✅ Checklist opérationnelle

### 1) Audit rapide
- [ ] Lancer les outils adaptés au scope (lint, tests, checks de build)
- [ ] Classer les écarts : bloquants / correctifs automatiques / refactor manuel

### 2) Corrections backend (si applicable)
- [ ] UUID + timestamps sur entités, nomenclature snake_case SQL
- [ ] DTOs en records + Bean Validation, pas d'entités exposées en controller
- [ ] Service interface + impl, `@Transactional` cohérent
- [ ] Endpoints `/api/*` documentés (`@Tag`, `@Operation`, `@ApiResponse`)

### 3) Corrections frontend (si applicable)
- [ ] Components fonctionnels + exports nommés + props typées
- [ ] Hooks avec contrat clair (`data`, `loading`, `error`) si data-fetching
- [ ] Services API typés, erreurs gérées, pas de `any` évitable
- [ ] Conventions de nommage/routes alignées avec le projet

### 4) Vérification finale
- [ ] Rejouer lint/tests sur les modules touchés
- [ ] Confirmer qu'aucun secret/credential n'est introduit
- [ ] Fournir un rapport de conformité court

## 📤 Résultat attendu

1. **Violations détectées** par catégorie (backend/frontend)
2. **Corrections appliquées** avec fichiers impactés
3. **Points restants** nécessitant arbitrage humain
