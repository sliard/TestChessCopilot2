# 📝 Prompts GitHub Copilot

Ce dossier contient des prompts spécialisés pour guider GitHub Copilot dans l'implémentation de features selon les conventions du projet **JavaViteTemplate**.

## 🎯 Vue d'ensemble

Les prompts sont des fichiers Markdown structurés qui fournissent un contexte détaillé, des checklists et des exemples pour aider Copilot à générer du code conforme aux standards du projet.

## 📚 Prompts disponibles

| Prompt | Usage | Quand l'utiliser |
|--------|-------|------------------|
| **[implement-feature](./implement-feature.prompt.md)** | Implémenter une feature complète depuis les specs | Quand vous avez une spec dans `docs/features/` et voulez l'implémenter |
| **[creer-entite](./creer-entite.prompt.md)** | Créer une entité JPA + repository + migration | Quand vous devez ajouter une nouvelle table/entité au modèle de données |
| **[creer-crud-complet](./creer-crud-complet.prompt.md)** | Générer CRUD fullstack (backend + frontend + tests) | Quand vous devez créer une ressource CRUD de A à Z |
| **[ajouter-endpoint](./ajouter-endpoint.prompt.md)** | Ajouter un endpoint REST à un controller existant | Quand vous devez ajouter une route API spécifique |
| **[corriger-conventions](./corriger-conventions.prompt.md)** | Vérifier et corriger les violations de conventions | Après avoir codé, pour s'assurer de la conformité |
| **[generer-tests](./generer-tests.prompt.md)** | Générer tests unitaires et d'intégration | Quand vous devez tester du code existant |

## 🚀 Comment utiliser les prompts

### Méthode officielle : slash command

Dans GitHub Copilot Chat, invoquez directement le prompt :

```text
/creer-entite entity=Product fields=name:String,price:BigDecimal,description:String
```

### Fallback secondaire : Copilot Chat libre

Si la slash command n'est pas disponible dans votre contexte, utilisez une requête libre explicite :

```text
Utilise le prompt creer-entite pour créer une entité Product avec les champs name:String, price:BigDecimal, description:String.
```

### Méthode agent (optionnelle)

Pour des tâches complexes, déléguez aux agents IA du projet (voir `../../AGENTS.md`).

## ⚖️ Frontière de responsabilité

- **`implement-feature` = spec-driven** : part d'une spec existante dans `docs/features/<feature>.md` et suit son contenu.
- **`creer-crud-complet` = scaffold-driven** : génère un CRUD standard fullstack sans dépendre d'une spec détaillée préalable.

## 📖 Structure d'un prompt

Chaque prompt suit cette structure :

```markdown
---
name: nom-du-prompt
description: Description courte
argument-hint: "param1=<valeur> param2=<valeur>"
agent: agent
---

# Titre du Prompt

## 📚 Contexte
Références aux docs du projet

## 🔧 Tâche
Variables d'entrée ${input:variable:hint}

## ✅ Checklist d'implémentation
Étapes détaillées avec exemples de code

## 📤 Résultat attendu
Ce qui doit être produit
```

## 🎨 Variables d'entrée

Les prompts utilisent des variables sous la forme `${input:nom:description}` :

| Variable | Type | Exemple |
|----------|------|---------|
| `feature` | string | `user-management` |
| `scope` | enum | `backend`, `frontend`, `fullstack` |
| `entity` | string | `Product` |
| `fields` | string | `name:String,price:BigDecimal` |
| `method` | enum | `GET`, `POST`, `PUT`, `DELETE` |

## 🔄 Workflow typique

### Feature pilotée par spec

1. **Spec** → Créer/compléter `docs/features/00X-nom-feature.md` (template `_TEMPLATE.md`)
2. **Implémentation** → `/implement-feature feature=nom-feature scope=fullstack`
3. **Tests** → `/generer-tests type=all target=service,controller,component,hook`
4. **Conventions** → `/corriger-conventions scope=all`

### CRUD standard rapide (scaffold)

1. **CRUD** → `/creer-crud-complet resource=product fields=name:String,price:BigDecimal`
2. **Conventions** → `/corriger-conventions scope=all`

### Endpoint spécifique

1. **Endpoint** → `/ajouter-endpoint controller=ProductController method=GET path=/api/products/search`
2. **Tests** → `/generer-tests type=integration target=controller`

## 📚 Références

- **[AGENTS.md](../../AGENTS.md)** : Agents IA et composition multi-agents
- **[copilot-instructions.md](../copilot-instructions.md)** : Instructions globales Copilot
- **[docs/conventions/README.md](../../docs/conventions/README.md)** : Conventions détaillées backend/frontend
- **[docs/AI_CONTEXT.md](../../docs/AI_CONTEXT.md)** : Contexte technique complet
- **[Skills README](../skills/README.md)** : Templates de code réutilisables

## 🛠️ Maintenance des prompts

### Ajouter un nouveau prompt

1. Créer `nouveau-prompt.prompt.md` avec la structure standard
2. Ajouter dans ce README (tableau + workflow)
3. Tester avec plusieurs cas d'usage
4. Documenter dans `AGENTS.md` si lié à un agent

### Mettre à jour un prompt

1. Modifier le fichier `.prompt.md`
2. Tester les changements
3. Mettre à jour ce README si nécessaire
4. Versionner dans Git avec message explicite

