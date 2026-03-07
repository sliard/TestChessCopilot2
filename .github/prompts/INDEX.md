# 📝 Index des Prompts Copilot

> Navigation rapide vers les prompts disponibles

## 🎯 Par cas d'usage

### Création de features
- **[Implémenter une feature complète](./implement-feature.prompt.md)** — Depuis une spec dans `docs/features/`
- **[Créer un CRUD complet](./creer-crud-complet.prompt.md)** — Backend + Frontend + Tests en une seule fois

### Développement backend
- **[Créer une entité JPA](./creer-entite.prompt.md)** — Entité + Repository + Migration Flyway
- **[Ajouter un endpoint REST](./ajouter-endpoint.prompt.md)** — Nouveau endpoint dans un controller existant

### Qualité et tests
- **[Générer des tests](./generer-tests.prompt.md)** — Tests unitaires et d'intégration (backend + frontend)
- **[Corriger les conventions](./corriger-conventions.prompt.md)** — Audit et correction automatique

## 📖 Documentation

- **[README](./README.md)** — Documentation complète des prompts
- **[GUIDE](./GUIDE.md)** — Exemples pratiques et scénarios d'utilisation

## 🔗 Liens rapides

| Besoin | Prompt recommandé | Documentation |
|--------|-------------------|---------------|
| Nouvelle feature from scratch | [creer-crud-complet](./creer-crud-complet.prompt.md) | [GUIDE § Scénario 1](./GUIDE.md#scénario-1--créer-une-feature-crud-complète-product) |
| Implémenter une spec existante | [implement-feature](./implement-feature.prompt.md) | [GUIDE § Scénario 4](./GUIDE.md#scénario-4--implémenter-une-feature-depuis-une-spec) |
| Ajouter une table | [creer-entite](./creer-entite.prompt.md) | [GUIDE § Scénario 2](./GUIDE.md#scénario-2--ajouter-une-entité-simple-category) |
| Ajouter une route API | [ajouter-endpoint](./ajouter-endpoint.prompt.md) | [GUIDE § Scénario 3](./GUIDE.md#scénario-3--ajouter-un-endpoint-de-recherche) |
| Tester du code | [generer-tests](./generer-tests.prompt.md) | [GUIDE § Tests](./GUIDE.md) |
| Vérifier la conformité | [corriger-conventions](./corriger-conventions.prompt.md) | [GUIDE § Scénario 5](./GUIDE.md#scénario-5--audit-et-correction-dun-code-legacy) |

## 🚀 Démarrage rapide

### Utilisation dans Copilot Chat (officiel)

```text
/<nom-du-prompt> <arguments>
```

### Exemple concret

```text
/creer-crud-complet resource=Product fields=name:String,price:BigDecimal,description:String
```

### Fallback secondaire

```text
Utilise le prompt creer-crud-complet pour créer la ressource Product avec les champs name, price, description.
```

## 📊 Statistiques

- **Total de prompts** : 6
- **Catégories** :
  - Features : 2
  - Backend : 2
  - Qualité : 2
- **Lignes de documentation** : ~500+
- **Exemples de code** : 30+

## 🔄 Workflow standard

```text
1. Créer spec → docs/features/XXX-feature.md
2. Implémenter → /implement-feature feature=... scope=...
3. Tester → /generer-tests type=... target=...
4. Vérifier → /corriger-conventions scope=...
5. Commit → git commit -m "feat: ..."
```

## 📚 Voir aussi

- [AGENTS.md](../../AGENTS.md) — Agents IA et composition multi-agents
- [Skills README](../skills/README.md) — Templates de code réutilisables
- [Conventions README](../../docs/conventions/README.md) — Règles détaillées backend/frontend
- [AI_CONTEXT.md](../../docs/AI_CONTEXT.md) — Contexte technique complet

