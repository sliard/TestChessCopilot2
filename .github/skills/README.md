# Skills GitHub Copilot

> Ce dossier contient les skills (instructions spécialisées) que GitHub Copilot charge automatiquement selon le contexte de votre prompt.

## 📋 Fonctionnement

1. Chaque skill est un **dossier** dans `.github/skills/` avec un nom en `kebab-case`
2. Chaque dossier contient un fichier **`SKILL.md`** avec un frontmatter YAML obligatoire
3. Copilot détecte automatiquement le skill approprié via la `description` du frontmatter

## 📁 Structure d'un skill

```
.github/skills/
└── mon-nouveau-skill/
    ├── SKILL.md          # Instructions (requis)
    ├── example.ts        # Exemple de code (optionnel)
    └── template.java     # Template (optionnel)
```

## ✏️ Format du fichier `SKILL.md`

```markdown
---
name: mon-nouveau-skill
description: Description claire de ce que fait le skill et quand Copilot doit l'utiliser.
---

# Titre du skill

Instructions détaillées en Markdown : guidelines, exemples de code, conventions à respecter.
```

### Frontmatter YAML requis

| Champ | Obligatoire | Description |
|-------|:-----------:|-------------|
| `name` | ✅ | Identifiant unique en `kebab-case` |
| `description` | ✅ | Phrase décrivant le déclencheur et le rôle du skill |

> **Conseil** : La `description` est ce que Copilot utilise pour décider s'il doit charger le skill. Soyez précis sur les mots-clés déclencheurs (ex : "entité JPA", "composant React", "migration Flyway").

## 🆕 Ajouter un nouveau skill

1. Créer un dossier dans `.github/skills/` avec un nom en `kebab-case`
2. Créer un fichier `SKILL.md` avec le frontmatter `name` + `description`
3. Rédiger les instructions détaillées (conventions, exemples, checklist)
4. Optionnellement, ajouter des fichiers d'exemple ou de template
5. Mettre à jour le tableau des skills dans `AGENTS.md` (section 📦 Skills)
6. Mettre à jour le catalogue dans `docs/AI_CONTEXT.md` (section 🤖 Assistance IA)

## 📦 Skills existants

| Skill | Domaine | Description |
|-------|---------|-------------|
| `backend-entity` | Backend | Entités JPA |
| `backend-service` | Backend | Services et repositories |
| `backend-controller` | Backend | Controllers REST |
| `backend-dto-mapper` | Backend | Mappers DTO / MapStruct |
| `backend-security` | Backend | Spring Security + JWT |
| `backend-exception` | Backend | Exceptions et error handling |
| `backend-migration` | Backend | Migrations Flyway SQL |
| `backend-testing` | Backend | Tests JUnit 5, Mockito, Testcontainers |
| `frontend-component` | Frontend | Composants React TypeScript |
| `frontend-hooks` | Frontend | Hooks personnalisés |
| `frontend-services` | Frontend | Services API |
| `frontend-auth` | Frontend | Authentification React |
| `frontend-form` | Frontend | Formulaires react-hook-form + zod |
| `frontend-routing` | Frontend | React Router, lazy loading |
| `frontend-state` | Frontend | State management Zustand |
| `frontend-testing` | Frontend | Tests Vitest, Testing Library, MSW |
| `docker-compose` | Infra | Docker Compose, Dockerfile, Nginx |
| `github-actions` | Infra | Workflows CI/CD |
| `feature-spec` | Doc | Spécifications de features |
| `project-spec` | Doc | Vision projet, MVP |

