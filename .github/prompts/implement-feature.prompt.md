---
name: implement-feature
description: Implémenter une feature métier depuis sa spécification
argument-hint: "feature=<nom> scope=<backend|frontend|fullstack>"
agent: agent
---

# 🎯 Implémentation de feature (spec-driven)

## 📚 Contexte à lire en premier

- [Template de spec feature](../../docs/features/_TEMPLATE.md) et le fichier ciblé `../../docs/features/<feature>.md` (source de vérité)
- [Conventions backend](../../docs/conventions/backend.md)
- [Conventions frontend](../../docs/conventions/frontend.md)
- [Règles agents](../../AGENTS.md)

## 🔧 Tâche

- **Feature** : ${input:feature:slug de feature correspondant à docs/features/<feature>.md}
- **Scope** : ${input:scope:backend, frontend, ou fullstack}

## ✅ Checklist opérationnelle

### 1) Analyse
- [ ] Ouvrir `docs/features/<feature>.md`
- [ ] Lister user stories, critères d'acceptation et hors-scope
- [ ] Déduire les fichiers backend/frontend à créer ou modifier

### 2) Implémentation
- [ ] Backend (si demandé) : entity/DTO/service/controller/migration selon conventions
- [ ] Frontend (si demandé) : types/services/hooks/pages/components selon conventions
- [ ] OpenAPI sur endpoints ajoutés (`@Tag`, `@Operation`, `@ApiResponse`)

### 3) Qualité
- [ ] Ajouter/adapter les tests unitaires et d'intégration
- [ ] Vérifier lint/tests sur modules touchés
- [ ] Documenter les hypothèses quand la spec est ambiguë

## 📤 Résultat attendu

1. Fichiers créés/modifiés groupés par couche
2. Mapping clair entre critères d'acceptation et implémentation
3. Points bloquants ou arbitrages à valider
