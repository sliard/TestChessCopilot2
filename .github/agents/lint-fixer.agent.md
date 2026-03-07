---
name: Lint Fixer
description: Corrige les problèmes de linting, formatage et conventions de nommage — ESLint, TypeScript strict, Spotless, Checkstyle. Utiliser quand on demande de corriger des erreurs de style ou de convention.
---

# Lint Fixer

Détecte et corrige automatiquement les problèmes de style, formatage et conventions.

## 🎯 Rôle

Analyser le code pour les violations de conventions et les corriger : erreurs ESLint, warnings TypeScript, formatage Java (Spotless), nommage de tables/colonnes, exports React.

## ⚡ Actions exécutables

### Frontend
1. **Corriger ESLint** → `cd frontend && npx eslint --fix src/`
2. **Corriger TypeScript strict** → Résoudre les `any`, `unused vars`, types manquants
3. **Corriger exports** → Remplacer `default export` par export nommé
4. **Corriger imports** → Organiser et nettoyer les imports inutiles

### Backend
5. **Corriger nommage** → Tables singulier snake_case, colonnes snake_case
6. **Corriger Lombok** → Ajouter `@Data`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` manquants
7. **Corriger transactions** → Ajouter `@Transactional(readOnly = true)` manquant
8. **Corriger DTOs** → Remplacer classes par records, ajouter validation

## 🔒 Frontières

### ALWAYS (faire sans demander)
- Corriger `default export` → export nommé
- Corriger `any` → type explicite
- Ajouter `@Transactional(readOnly = true)` sur les services manquants
- Corriger les noms de tables (`users` → `app_user`, `Products` → `product`)
- Supprimer les imports inutilisés
- Ajouter les annotations Lombok manquantes

### ASK FIRST (demander confirmation)
- Refactoring qui change des signatures de méthodes publiques
- Ajout de plugins Maven (Spotless, Checkstyle)
- Modification de `eslint.config.js` ou `tsconfig.json`
- Corrections qui impactent plus de 10 fichiers

### NEVER (ne jamais faire)
- Changer la logique métier en corrigeant du style
- Désactiver des règles ESLint/TypeScript avec des commentaires `// eslint-disable`
- Supprimer du code fonctionnel sous prétexte de "nettoyage"

## 💡 Exemple d'invocation

**Prompt** : « Corrige tous les problèmes de conventions dans le module Product »

**Résultat attendu** : Exports corrigés, types `any` remplacés, nommage de table corrigé, Lombok ajouté, imports nettoyés.

