---
name: Frontend Builder
description: Génère le code frontend complet pour une feature — types TypeScript, service API, hook custom, composant React et page. Utiliser quand on demande de créer une nouvelle fonctionnalité côté UI.
---

# Frontend Builder

Génère une feature frontend complète en respectant l'architecture fonctionnelle React/TypeScript du projet.

## 🎯 Rôle

Créer tous les fichiers frontend nécessaires pour afficher et interagir avec une ressource : types TypeScript, service API, hook custom, composants réutilisables et page.

## ⚡ Actions exécutables

1. **Créer les types** → `frontend/src/types/{entity}.ts`
2. **Créer le service API** → `frontend/src/services/{entity}Service.ts`
3. **Créer le hook** → `frontend/src/hooks/use{Entity}.tsx`
4. **Créer le composant** → `frontend/src/components/{Entity}Card.tsx` (ou autre)
5. **Créer la page** → `frontend/src/pages/{Entity}Page.tsx`
6. **Ajouter la route** dans `App.tsx` ou le fichier de routing

## 🔒 Frontières

### ALWAYS (faire sans demander)
- Composants fonctionnels uniquement, export nommé (jamais `default export`)
- Props typées avec interface suffixée `Props`
- Hooks préfixés `use`, retour typé `{ data, loading, error }`
- Service API avec `import.meta.env.VITE_API_URL` comme base URL
- JWT en header `Authorization: Bearer {token}`
- Gestion des états loading / error / data dans chaque hook
- TypeScript strict, pas de `any`

### ASK FIRST (demander confirmation)
- Choix de librairie UI (composants custom vs librairie externe)
- Ajout de state global Zustand pour la feature
- Formulaires complexes (react-hook-form + zod)
- Routes protégées par rôle
- Lazy loading de la page

### NEVER (ne jamais faire)
- Utiliser `default export`
- Utiliser `any` comme type
- Mettre de la logique API directement dans un composant (toujours via hook/service)
- Désactiver le mode strict TypeScript
- Hardcoder des URLs d'API

## 📚 Skills de référence

Pour les templates de code détaillés, consulter :
- `frontend-component` → `.github/skills/frontend-component/SKILL.md`
- `frontend-hooks` → `.github/skills/frontend-hooks/SKILL.md`
- `frontend-services` → `.github/skills/frontend-services/SKILL.md`
- `frontend-routing` → `.github/skills/frontend-routing/SKILL.md`
- `frontend-auth` → `.github/skills/frontend-auth/SKILL.md`

## 💡 Exemple d'invocation

**Prompt** : « Crée la feature frontend Product avec liste paginée, carte produit et page détail »

**Résultat attendu** : `types/product.ts`, `services/productService.ts`, `hooks/useProducts.tsx`, `components/ProductCard.tsx`, `pages/ProductListPage.tsx`, `pages/ProductDetailPage.tsx`, route ajoutée.

