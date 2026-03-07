# Feature : Internationalisation (i18n) - Multilingue

> 📝 **Statut** : Ready
> 
> 📅 **Date de création** : 2026-02-15
> 
> 👤 **Auteur** : Équipe Chess Training

## 📋 Résumé

Implémenter un système d'internationalisation (i18n) sur le frontend permettant aux utilisateurs de naviguer sur le site en français ou en anglais. Cette feature utilise la bibliothèque `react-i18next` conformément aux standards i18n et permet une expérience utilisateur localisée complète.

## 🎯 Objectifs

- [ ] Intégrer react-i18next pour la gestion des traductions
- [ ] Supporter deux langues : Français (fr) et Anglais (en)
- [ ] Permettre le changement de langue dynamique sans rechargement
- [ ] Persister le choix de langue de l'utilisateur
- [ ] Détecter automatiquement la langue du navigateur
- [ ] Traduire tous les textes statiques de l'interface

## 👥 User Stories

### US1 : Détection automatique de la langue
**En tant que** visiteur,  
**je veux** que le site détecte automatiquement la langue de mon navigateur,  
**afin de** voir le contenu dans ma langue préférée dès la première visite.

**Critères d'acceptation :**
- [ ] Détection de la langue du navigateur au premier chargement
- [ ] Si la langue détectée est supportée (fr/en), elle est appliquée
- [ ] Si la langue n'est pas supportée, fallback sur l'anglais (en)
- [ ] La détection ne s'applique que si aucun choix n'a été sauvegardé

### US2 : Changement manuel de langue
**En tant que** utilisateur,  
**je veux** pouvoir changer la langue du site manuellement,  
**afin de** consulter le contenu dans la langue de mon choix.

**Critères d'acceptation :**
- [ ] Sélecteur de langue visible dans le header/navbar
- [ ] Options : 🇫🇷 Français, 🇬🇧 English
- [ ] Changement instantané sans rechargement de page
- [ ] Indication visuelle de la langue active
- [ ] Accessible au clavier et lecteurs d'écran

### US3 : Persistence du choix de langue
**En tant que** utilisateur,  
**je veux** que mon choix de langue soit mémorisé,  
**afin de** retrouver le site dans ma langue à chaque visite.

**Critères d'acceptation :**
- [ ] Stockage du choix dans localStorage
- [ ] Restauration du choix au chargement de l'application
- [ ] Priorité : localStorage > détection navigateur > défaut (en)

### US4 : Contenu traduit
**En tant que** utilisateur,  
**je veux** voir tous les textes de l'interface dans la langue sélectionnée,  
**afin de** comprendre facilement toutes les fonctionnalités.

**Critères d'acceptation :**
- [ ] Navigation (menu, liens) traduits
- [ ] Formulaires (labels, placeholders, erreurs) traduits
- [ ] Messages de feedback (succès, erreur) traduits
- [ ] Boutons et actions traduits
- [ ] Pages d'erreur (404, etc.) traduites
- [ ] Métadonnées (titre de page) traduites

### US5 : Formatage localisé
**En tant que** utilisateur,  
**je veux** voir les dates et nombres formatés selon ma locale,  
**afin de** comprendre les informations dans un format familier.

**Critères d'acceptation :**
- [ ] Dates formatées selon la locale (ex: 15/02/2026 vs 02/15/2026)
- [ ] Nombres formatés selon la locale (ex: 1 234,56 vs 1,234.56)
- [ ] Utilisation de l'API Intl native ou date-fns

## 🏗️ Conception technique

### Frontend

#### Dépendances à installer

```bash
npm install i18next react-i18next i18next-browser-languagedetector i18next-http-backend
```

| Package | Version | Description |
|---------|---------|-------------|
| `i18next` | ^23.x | Bibliothèque i18n principale |
| `react-i18next` | ^14.x | Intégration React pour i18next |
| `i18next-browser-languagedetector` | ^7.x | Détection automatique de la langue |
| `i18next-http-backend` | ^2.x | Chargement lazy des fichiers de traduction (optionnel) |

#### Structure des fichiers

```
frontend/src/
├── i18n/
│   ├── index.ts              # Configuration i18next
│   ├── locales/
│   │   ├── en/
│   │   │   ├── common.json   # Traductions communes
│   │   │   ├── auth.json     # Traductions authentification
│   │   │   ├── openings.json # Traductions ouvertures
│   │   │   └── errors.json   # Messages d'erreur
│   │   └── fr/
│   │       ├── common.json
│   │       ├── auth.json
│   │       ├── openings.json
│   │       └── errors.json
├── components/
│   └── ui/
│       └── LanguageSwitcher.tsx  # Composant sélecteur de langue
├── hooks/
│   └── useLanguage.ts            # Hook personnalisé pour la langue
└── types/
    └── i18n.d.ts                 # Types TypeScript pour i18n
```

#### Configuration i18next

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Imports des traductions
import enCommon from './locales/en/common.json';
import enAuth from './locales/en/auth.json';
import enOpenings from './locales/en/openings.json';
import enErrors from './locales/en/errors.json';

import frCommon from './locales/fr/common.json';
import frAuth from './locales/fr/auth.json';
import frOpenings from './locales/fr/openings.json';
import frErrors from './locales/fr/errors.json';

export const defaultNS = 'common';
export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    openings: enOpenings,
    errors: enErrors,
  },
  fr: {
    common: frCommon,
    auth: frAuth,
    openings: frOpenings,
    errors: frErrors,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    defaultNS,
    fallbackLng: 'en',
    supportedLngs: ['en', 'fr'],
    interpolation: {
      escapeValue: false, // React gère déjà l'échappement
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
```

#### Composants

##### LanguageSwitcher

```tsx
// src/components/ui/LanguageSwitcher.tsx
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
  showLabel?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps>;
```

**Fonctionnalités :**
- Deux variantes : dropdown menu ou boutons
- Affichage optionnel des drapeaux emoji (🇫🇷, 🇬🇧)
- Affichage optionnel du libellé de la langue
- Accessible (aria-label, rôle, navigation clavier)

#### Hooks

##### useLanguage

```tsx
// src/hooks/useLanguage.ts
interface UseLanguageResult {
  currentLanguage: 'en' | 'fr';
  changeLanguage: (lng: 'en' | 'fr') => Promise<void>;
  languages: Array<{ code: 'en' | 'fr'; label: string; flag: string }>;
  t: TFunction;
}

export const useLanguage = (): UseLanguageResult;
```

**Fonctionnalités :**
- Accès à la langue courante
- Fonction de changement de langue
- Liste des langues disponibles
- Fonction de traduction `t` prête à l'emploi

#### Exemples de fichiers de traduction

##### common.json (EN)

```json
{
  "app": {
    "name": "Chess Training",
    "tagline": "Master your openings"
  },
  "nav": {
    "home": "Home",
    "openings": "Openings",
    "myOpenings": "My Openings",
    "login": "Login",
    "register": "Sign Up",
    "logout": "Logout",
    "profile": "Profile"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "clear": "Clear",
    "submit": "Submit",
    "loading": "Loading..."
  },
  "pagination": {
    "previous": "Previous",
    "next": "Next",
    "page": "Page {{current}} of {{total}}",
    "showing": "Showing {{from}} to {{to}} of {{total}} results"
  },
  "language": {
    "select": "Select language",
    "en": "English",
    "fr": "French"
  }
}
```

##### common.json (FR)

```json
{
  "app": {
    "name": "Chess Training",
    "tagline": "Maîtrisez vos ouvertures"
  },
  "nav": {
    "home": "Accueil",
    "openings": "Ouvertures",
    "myOpenings": "Mes Ouvertures",
    "login": "Connexion",
    "register": "Inscription",
    "logout": "Déconnexion",
    "profile": "Profil"
  },
  "actions": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "edit": "Modifier",
    "create": "Créer",
    "search": "Rechercher",
    "clear": "Effacer",
    "submit": "Envoyer",
    "loading": "Chargement..."
  },
  "pagination": {
    "previous": "Précédent",
    "next": "Suivant",
    "page": "Page {{current}} sur {{total}}",
    "showing": "Affichage de {{from}} à {{to}} sur {{total}} résultats"
  },
  "language": {
    "select": "Choisir la langue",
    "en": "Anglais",
    "fr": "Français"
  }
}
```

##### auth.json (EN)

```json
{
  "login": {
    "title": "Sign In",
    "email": "Email address",
    "password": "Password",
    "submit": "Sign In",
    "forgotPassword": "Forgot your password?",
    "noAccount": "Don't have an account?",
    "signUpLink": "Sign up"
  },
  "register": {
    "title": "Create Account",
    "firstName": "First name",
    "lastName": "Last name",
    "email": "Email address",
    "password": "Password",
    "confirmPassword": "Confirm password",
    "submit": "Create Account",
    "hasAccount": "Already have an account?",
    "signInLink": "Sign in"
  },
  "validation": {
    "emailRequired": "Email is required",
    "emailInvalid": "Invalid email address",
    "passwordRequired": "Password is required",
    "passwordMinLength": "Password must be at least {{min}} characters",
    "passwordMismatch": "Passwords do not match"
  }
}
```

##### auth.json (FR)

```json
{
  "login": {
    "title": "Connexion",
    "email": "Adresse email",
    "password": "Mot de passe",
    "submit": "Se connecter",
    "forgotPassword": "Mot de passe oublié ?",
    "noAccount": "Pas encore de compte ?",
    "signUpLink": "Inscrivez-vous"
  },
  "register": {
    "title": "Créer un compte",
    "firstName": "Prénom",
    "lastName": "Nom",
    "email": "Adresse email",
    "password": "Mot de passe",
    "confirmPassword": "Confirmer le mot de passe",
    "submit": "Créer mon compte",
    "hasAccount": "Vous avez déjà un compte ?",
    "signInLink": "Connectez-vous"
  },
  "validation": {
    "emailRequired": "L'email est obligatoire",
    "emailInvalid": "Adresse email invalide",
    "passwordRequired": "Le mot de passe est obligatoire",
    "passwordMinLength": "Le mot de passe doit contenir au moins {{min}} caractères",
    "passwordMismatch": "Les mots de passe ne correspondent pas"
  }
}
```

##### openings.json (EN)

```json
{
  "list": {
    "title": "Chess Openings",
    "empty": "No openings found",
    "searchPlaceholder": "Search openings..."
  },
  "detail": {
    "moves": "Moves",
    "description": "Description",
    "ecoCode": "ECO Code",
    "createdBy": "Created by",
    "createdAt": "Created on"
  },
  "form": {
    "createTitle": "Create Opening",
    "editTitle": "Edit Opening",
    "name": "Opening name",
    "namePlaceholder": "e.g., Sicilian Defense",
    "description": "Description",
    "descriptionPlaceholder": "Describe this opening...",
    "moves": "Moves (PGN notation)",
    "movesPlaceholder": "1. e4 c5 2. Nf3...",
    "isPublic": "Make this opening public",
    "success": {
      "created": "Opening created successfully",
      "updated": "Opening updated successfully",
      "deleted": "Opening deleted successfully"
    }
  },
  "cta": {
    "register": "Create an account to save your favorite openings and create your own!",
    "registerButton": "Sign Up Free"
  }
}
```

##### openings.json (FR)

```json
{
  "list": {
    "title": "Ouvertures d'échecs",
    "empty": "Aucune ouverture trouvée",
    "searchPlaceholder": "Rechercher une ouverture..."
  },
  "detail": {
    "moves": "Coups",
    "description": "Description",
    "ecoCode": "Code ECO",
    "createdBy": "Créé par",
    "createdAt": "Créé le"
  },
  "form": {
    "createTitle": "Créer une ouverture",
    "editTitle": "Modifier l'ouverture",
    "name": "Nom de l'ouverture",
    "namePlaceholder": "ex: Défense sicilienne",
    "description": "Description",
    "descriptionPlaceholder": "Décrivez cette ouverture...",
    "moves": "Coups (notation PGN)",
    "movesPlaceholder": "1. e4 c5 2. Cf3...",
    "isPublic": "Rendre cette ouverture publique",
    "success": {
      "created": "Ouverture créée avec succès",
      "updated": "Ouverture mise à jour avec succès",
      "deleted": "Ouverture supprimée avec succès"
    }
  },
  "cta": {
    "register": "Créez un compte pour sauvegarder vos ouvertures favorites et créer les vôtres !",
    "registerButton": "S'inscrire gratuitement"
  }
}
```

##### errors.json (EN)

```json
{
  "generic": "An error occurred. Please try again.",
  "network": "Network error. Please check your connection.",
  "unauthorized": "Please log in to continue.",
  "forbidden": "You don't have permission to access this resource.",
  "notFound": "The requested resource was not found.",
  "validation": "Please check the form for errors.",
  "server": "Server error. Please try again later.",
  "pages": {
    "notFound": {
      "title": "Page Not Found",
      "message": "The page you're looking for doesn't exist.",
      "backHome": "Back to Home"
    }
  }
}
```

##### errors.json (FR)

```json
{
  "generic": "Une erreur est survenue. Veuillez réessayer.",
  "network": "Erreur réseau. Vérifiez votre connexion.",
  "unauthorized": "Veuillez vous connecter pour continuer.",
  "forbidden": "Vous n'avez pas la permission d'accéder à cette ressource.",
  "notFound": "La ressource demandée n'a pas été trouvée.",
  "validation": "Veuillez vérifier les erreurs du formulaire.",
  "server": "Erreur serveur. Veuillez réessayer plus tard.",
  "pages": {
    "notFound": {
      "title": "Page non trouvée",
      "message": "La page que vous recherchez n'existe pas.",
      "backHome": "Retour à l'accueil"
    }
  }
}
```

#### Typage TypeScript

```typescript
// src/types/i18n.d.ts
import 'i18next';
import { resources, defaultNS } from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
  }
}
```

#### Intégration dans l'application

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Initialisation i18n
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

#### Utilisation dans les composants

```tsx
// Exemple d'utilisation
import { useTranslation } from 'react-i18next';

export const LoginForm: React.FC = () => {
  const { t } = useTranslation('auth');

  return (
    <form>
      <h1>{t('login.title')}</h1>
      <label>{t('login.email')}</label>
      <input type="email" placeholder={t('login.email')} />
      <label>{t('login.password')}</label>
      <input type="password" />
      <button type="submit">{t('login.submit')}</button>
    </form>
  );
};
```

### Routes

| Route | Impact |
|-------|--------|
| Toutes | Les textes doivent utiliser les traductions |

### Tests

#### Tests unitaires

```typescript
// LanguageSwitcher.test.tsx
describe('LanguageSwitcher', () => {
  it('should display current language');
  it('should change language when option is selected');
  it('should persist language choice in localStorage');
  it('should be accessible with keyboard');
});

// useLanguage.test.ts
describe('useLanguage', () => {
  it('should return current language');
  it('should change language');
  it('should list available languages');
});
```

#### Tests d'intégration

```typescript
describe('i18n integration', () => {
  it('should detect browser language on first load');
  it('should fallback to English for unsupported languages');
  it('should restore language from localStorage');
  it('should translate all UI elements');
});
```

## 🎨 Maquettes / Wireframes

### Sélecteur de langue (Header)

```
┌────────────────────────────────────────────────────────────────┐
│  🏠 Chess Training          [Openings] [My Openings]  [🇫🇷 FR ▼] │
│                                                        ├──────┤
│                                                        │🇬🇧 EN │
│                                                        │🇫🇷 FR │
│                                                        └──────┘
└────────────────────────────────────────────────────────────────┘
```

### Variante boutons

```
┌────────────────────────────────────────────────────────────────┐
│  🏠 Chess Training     [Openings] [My Openings]   [EN] [FR]    │
└────────────────────────────────────────────────────────────────┘
```

## 📊 Données de test

Les fichiers de traduction servent de données de test. Vérifier que toutes les clés sont présentes dans les deux langues.

Script de validation :

```typescript
// scripts/validate-translations.ts
const validateTranslations = () => {
  const enKeys = getAllKeys(enTranslations);
  const frKeys = getAllKeys(frTranslations);
  
  const missingInFr = enKeys.filter(k => !frKeys.includes(k));
  const missingInEn = frKeys.filter(k => !enKeys.includes(k));
  
  if (missingInFr.length || missingInEn.length) {
    console.error('Missing translations:', { missingInFr, missingInEn });
    process.exit(1);
  }
};
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Traductions manquantes | Texte en anglais par défaut | Script de validation CI |
| Performance (gros fichiers JSON) | Chargement initial lent | Namespace splitting, lazy loading |
| Clés de traduction incorrectes | Crash ou texte manquant | TypeScript strict, tests |
| Contenu dynamique (API) | Non traduit | Backend i18n si nécessaire (phase 2) |

## 📝 Notes

### Conventions de nommage des clés

- Utiliser le format `namespace.section.key`
- Clés en camelCase
- Grouper par fonctionnalité

### Extensions futures possibles

1. **Phase 2** : Ajouter d'autres langues (espagnol, allemand, etc.)
2. **Phase 2** : Traduction du contenu dynamique (backend i18n)
3. **Phase 2** : Détection par IP/géolocalisation
4. **Phase 2** : URL localisées (/fr/ouvertures, /en/openings)

### Accessibilité

- Attribut `lang` sur le `<html>` mis à jour dynamiquement
- Labels aria pour le sélecteur de langue
- Annonce du changement de langue aux lecteurs d'écran

## ✅ Definition of Done

- [ ] Configuration i18next fonctionnelle
- [ ] Fichiers de traduction EN/FR complets
- [ ] Composant LanguageSwitcher implémenté
- [ ] Hook useLanguage implémenté
- [ ] Détection automatique de la langue
- [ ] Persistence du choix dans localStorage
- [ ] Tous les textes statiques traduits
- [ ] Tests unitaires (>80% couverture)
- [ ] Tests d'intégration i18n
- [ ] Documentation mise à jour
- [ ] Code review effectué
- [ ] Accessible (WCAG 2.1 AA)

