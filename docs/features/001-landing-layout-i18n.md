# Feature 001 : Landing Page, Layout Partagé & Internationalisation (i18n)

> 📝 **Statut** : Ready
> 
> 📅 **Date de création** : 2026-03-08
> 
> 👤 **Auteur** : Équipe Chess Training
> 
> 🏷️ **Tags** : frontend, layout, i18n, landing

## 📋 Résumé

Mettre en place les fondations visuelles et transversales de l'application : une **landing page publique** (`/`) présentant le service et orientant les visiteurs, un **layout partagé** (header + footer) cohérent sur toutes les pages, et un système d'**internationalisation** (i18n) bilingue français/anglais. Cette feature est la toute première car elle ne dépend d'aucune autre et fournit le socle visuel et linguistique sur lequel toutes les features suivantes s'appuient.

## 🎯 Objectifs

- [ ] Proposer une landing page `/` informative et accessible à tous (anonyme ou connecté)
- [ ] Fournir un layout partagé (header + footer) utilisé par toutes les pages de l'application
- [ ] Intégrer `react-i18next` pour supporter deux langues (français, anglais)
- [ ] Permettre le changement de langue dynamique depuis le header, sans rechargement
- [ ] Persister le choix de langue dans `localStorage`
- [ ] Détecter automatiquement la langue du navigateur au premier chargement
- [ ] Traduire tous les textes statiques de l'interface (navigation, labels, boutons, messages d'erreur)

## 👥 User Stories

### US1 : Landing page informative
**En tant que** visiteur (anonyme ou connecté),  
**je veux** voir une page d'accueil qui présente clairement la valeur du service,  
**afin de** comprendre rapidement ce que propose l'application et où commencer.

**Critères d'acceptation :**
- [ ] La route `/` affiche une **hero section** avec titre « Maîtrisez les ouvertures d'échecs », sous-titre explicatif et CTA « Explorer les ouvertures » (→ `/openings`)
- [ ] Une **section valeur** affiche l'objectif du service qui est de travailler ses ouvertures aux echecs (3 cartes)
- [ ] Une **section aperçu** montre un extrait de 3 ouvertures populaires (données statiques ou appel API public optionnel)
- [ ] Une **section CTA inscription** avec bannière « Créez votre compte gratuitement » (→ `/register`)
- [ ] Le contenu principal reste informatif pour tous, sans dépendre de l'authentification
- [ ] Si l'utilisateur est connecté, la section CTA inscription est remplacée par un lien « Accéder au tableau de bord » (→ `/dashboard`)
- [ ] La page est entièrement responsive (desktop, tablette, mobile)

**Règles métier :**
- La landing ne bloque jamais l'accès au contenu ; les CTA sont incitatifs, non bloquants
- Le contenu doit être traduit via i18n (FR/EN)

---

### US2 : Layout partagé (header + footer)
**En tant que** visiteur (anonyme ou connecté),  
**je veux** voir un header et un footer cohérents sur toutes les pages,  
**afin de** naviguer facilement et avoir une expérience visuelle unifiée.

**Critères d'acceptation :**
- [ ] Un composant `Layout` enveloppe toutes les pages via `<Outlet />` (React Router)
- [ ] **Header** : logo/nom de l'app (lien vers `/`), lien « Ouvertures » (→ `/openings`), sélecteur de langue (`LanguageSwitcher`), zone d'actions utilisateur
- [ ] **Header — mode anonyme** : boutons « Connexion » (→ `/login`) et « Inscription » (→ `/register`)
- [ ] **Header — mode connecté** : nom de l'utilisateur, lien « Tableau de bord » (→ `/dashboard`), bouton « Déconnexion »
- [ ] **Footer** : copyright « © 2026 Chess Training »
- [ ] Le header est sticky (reste visible au scroll)
- [ ] Le layout est responsive avec menu hamburger sur mobile
- [ ] Tous les textes du header/footer passent par i18n

---

### US3 : Mode sans authentification
**En tant que** visiteur anonyme,  
**je veux** pouvoir naviguer sur la landing et accéder aux ouvertures publiques sans créer de compte,  
**afin de** découvrir le service avant de m'engager.

**Critères d'acceptation :**
- [ ] La route `/` est accessible sans aucune authentification
- [ ] Le header affiche les boutons Connexion / Inscription en mode anonyme
- [ ] Les CTA d'inscription sont visibles mais non bloquants sur la landing
- [ ] La navigation vers `/openings` est directement accessible depuis le header et la landing
- [ ] Aucune redirection forcée vers `/login` depuis les pages publiques

**Règles métier :**
- Le mode anonyme est le mode par défaut de l'application
- Toutes les pages publiques (`/`, `/openings`, `/openings/:id`) sont accessibles sans token JWT

---

### US4 : Détection automatique de la langue
**En tant que** visiteur,  
**je veux** que le site détecte automatiquement la langue de mon navigateur,  
**afin de** voir le contenu dans ma langue préférée dès la première visite.

**Critères d'acceptation :**
- [ ] Détection de la langue du navigateur au premier chargement
- [ ] Si la langue détectée est supportée (fr/en), elle est appliquée
- [ ] Si la langue n'est pas supportée, fallback sur le français (fr)
- [ ] La détection ne s'applique que si aucun choix n'a été sauvegardé

---

### US5 : Changement manuel de langue
**En tant que** utilisateur,  
**je veux** pouvoir changer la langue du site manuellement via le header,  
**afin de** consulter le contenu dans la langue de mon choix.

**Critères d'acceptation :**
- [ ] Sélecteur de langue (`LanguageSwitcher`) visible dans le header
- [ ] Options : 🇫🇷 Français, 🇬🇧 English
- [ ] Changement instantané sans rechargement de page
- [ ] Indication visuelle de la langue active
- [ ] Accessible au clavier et lecteurs d'écran

---

### US6 : Persistence du choix de langue
**En tant que** utilisateur,  
**je veux** que mon choix de langue soit mémorisé,  
**afin de** retrouver le site dans ma langue à chaque visite.

**Critères d'acceptation :**
- [ ] Stockage du choix dans `localStorage`
- [ ] Restauration du choix au chargement de l'application
- [ ] Priorité : `localStorage` > détection navigateur > défaut (fr)

---

### US7 : Contenu traduit et formatage localisé
**En tant que** utilisateur,  
**je veux** voir tous les textes de l'interface et les dates/nombres formatés selon ma langue,  
**afin de** comprendre facilement toutes les fonctionnalités.

**Critères d'acceptation :**
- [ ] Navigation (menu, liens) traduite
- [ ] Boutons et actions traduits
- [ ] Messages de feedback (succès, erreur) traduits
- [ ] Pages d'erreur (404, etc.) traduites
- [ ] Métadonnées (titre de page) traduites
- [ ] Dates formatées selon la locale (ex : 15/02/2026 vs 02/15/2026)
- [ ] Attribut `lang` sur le `<html>` mis à jour dynamiquement

---

## 🏗️ Conception Technique

### Backend

Aucun endpoint backend spécifique pour cette feature. Le frontend est entièrement autonome pour la landing, le layout et l'i18n.

> **Note** : Les traductions du contenu dynamique (données API) seront traitées dans une phase ultérieure côté backend si nécessaire.

---

### Frontend

#### Dépendances à installer

```bash
npm install i18next react-i18next i18next-browser-languagedetector
```

| Package | Version | Description |
|---------|---------|-------------|
| `i18next` | ^23.x | Bibliothèque i18n principale |
| `react-i18next` | ^14.x | Intégration React pour i18next |
| `i18next-browser-languagedetector` | ^7.x | Détection automatique de la langue |

#### Structure des fichiers

```
frontend/src/
├── i18n/
│   ├── index.ts                  # Configuration i18next
│   └── locales/
│       ├── en/
│       │   ├── common.json       # Traductions communes (nav, actions, pagination)
│       │   ├── auth.json         # Traductions authentification
│       │   ├── openings.json     # Traductions ouvertures
│       │   └── errors.json       # Messages d'erreur
│       └── fr/
│           ├── common.json
│           ├── auth.json
│           ├── openings.json
│           └── errors.json
├── components/
│   ├── Layout.tsx                # Layout partagé (header + footer + Outlet)
│   └── LanguageSwitcher.tsx      # Sélecteur de langue
├── hooks/
│   └── useLanguage.ts            # Hook personnalisé pour la langue
├── pages/
│   └── HomePage.tsx              # Landing page (refonte)
└── types/
    └── i18n.d.ts                 # Types TypeScript pour i18n
```

#### Configuration i18next

```typescript
// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

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
    fallbackLng: 'fr',
    supportedLngs: ['en', 'fr'],
    interpolation: {
      escapeValue: false,
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

##### Layout

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom';

interface LayoutProps {}

export const Layout: React.FC<LayoutProps>;
```

**Responsabilités :**
- Affiche le `Header` (logo, navigation, LanguageSwitcher, zone utilisateur)
- Rend le contenu enfant via `<Outlet />`
- Affiche le `Footer` (copyright, liens)
- Adapte le header selon l'état d'authentification via `useAuth()`
- Menu hamburger responsive sur mobile

##### LanguageSwitcher

```tsx
// src/components/LanguageSwitcher.tsx
interface LanguageSwitcherProps {
  variant?: 'dropdown' | 'buttons';
  showFlags?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps>;
```

**Fonctionnalités :**
- Deux variantes : dropdown menu ou boutons
- Affichage des drapeaux emoji (🇫🇷, 🇬🇧)
- Accessible (aria-label, rôle, navigation clavier)

##### HomePage (refonte)

```tsx
// src/pages/HomePage.tsx
export const HomePage: React.FC;
```

**Sections :**
1. **Hero** : titre traduit, sous-titre, CTA « Explorer les ouvertures »
2. **Valeur** : 3 cartes (Bibliothèque, Échiquier interactif, Progression)
3. **Aperçu** : 3 ouvertures populaires (statique)
4. **CTA inscription** (anonyme) ou **lien dashboard** (connecté)

#### Hooks

##### useLanguage

```typescript
// src/hooks/useLanguage.ts
interface UseLanguageResult {
  currentLanguage: 'en' | 'fr';
  changeLanguage: (lng: 'en' | 'fr') => Promise<void>;
  languages: Array<{ code: 'en' | 'fr'; label: string; flag: string }>;
  t: TFunction;
}

export const useLanguage = (): UseLanguageResult;
```

#### Routes (mise à jour de App.tsx)

```tsx
// App.tsx — structure avec Layout parent
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/openings" element={<OpeningsListPage />} />
    <Route path="/openings/:id" element={<OpeningDetailPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
  </Route>
</Routes>
```

| Route | Composant | Auth | Description |
|-------|-----------|------|-------------|
| `/` | HomePage | ❌ | Landing page informative |
| `/login` | LoginPage | ❌ | Connexion |
| `/register` | RegisterPage | ❌ | Inscription |
| `/openings` | OpeningsListPage | ❌ | Liste ouvertures publiques (Feature 003) |
| `/openings/:id` | OpeningDetailPage | ❌ | Détail ouverture (Feature 003) |
| `/dashboard` | DashboardPage | ✅ | Tableau de bord (Feature 002) |

#### Fichiers de traduction

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
    "dashboard": "Tableau de bord",
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
  },
  "landing": {
    "hero": {
      "title": "Maîtrisez les ouvertures d'échecs",
      "subtitle": "Explorez, apprenez et entraînez-vous sur les ouvertures classiques et modernes grâce à notre bibliothèque interactive.",
      "cta": "Explorer les ouvertures"
    },
    "features": {
      "library": {
        "title": "Bibliothèque d'ouvertures",
        "description": "Accédez à une collection complète d'ouvertures classées par code ECO, avec descriptions et variantes."
      },
      "chessboard": {
        "title": "Échiquier interactif",
        "description": "Visualisez chaque ouverture coup par coup sur un échiquier interactif avec navigation intuitive."
      },
      "progress": {
        "title": "Progression personnelle",
        "description": "Créez vos propres répertoires, sauvegardez vos ouvertures favorites et suivez votre progression."
      }
    },
    "preview": {
      "title": "Ouvertures populaires",
      "subtitle": "Découvrez quelques-unes des ouvertures les plus jouées au monde."
    },
    "cta": {
      "title": "Prêt à progresser ?",
      "subtitle": "Créez votre compte gratuitement et commencez à construire votre répertoire d'ouvertures.",
      "button": "S'inscrire gratuitement"
    },
    "authenticated": {
      "welcome": "Bonjour {{firstName}} !",
      "dashboardLink": "Accéder au tableau de bord"
    }
  },
  "footer": {
    "copyright": "© 2026 Chess Training. Tous droits réservés."
  }
}
```

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
    "dashboard": "Dashboard",
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
  },
  "landing": {
    "hero": {
      "title": "Master chess openings",
      "subtitle": "Explore, learn and practice classic and modern openings with our interactive library.",
      "cta": "Explore openings"
    },
    "features": {
      "library": {
        "title": "Opening library",
        "description": "Access a comprehensive collection of openings classified by ECO code, with descriptions and variations."
      },
      "chessboard": {
        "title": "Interactive chessboard",
        "description": "Visualize each opening move by move on an interactive chessboard with intuitive navigation."
      },
      "progress": {
        "title": "Personal progress",
        "description": "Create your own repertoires, save your favorite openings and track your progress."
      }
    },
    "preview": {
      "title": "Popular openings",
      "subtitle": "Discover some of the most played openings in the world."
    },
    "cta": {
      "title": "Ready to improve?",
      "subtitle": "Create your free account and start building your opening repertoire.",
      "button": "Sign up for free"
    },
    "authenticated": {
      "welcome": "Hello {{firstName}}!",
      "dashboardLink": "Go to dashboard"
    }
  },
  "footer": {
    "copyright": "© 2026 Chess Training. All rights reserved."
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
    "namePlaceholder": "ex : Défense sicilienne",
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

#### Typage TypeScript

```typescript
// src/types/i18n.d.ts
import 'i18next';
import { resources, defaultNS } from '../i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['fr'];
  }
}
```

#### Intégration dans l'application

```tsx
// src/main.tsx — ajouter l'import i18n
import './i18n';
```

---

## 🔒 Sécurité

### Autorisations

| Action | Visiteur | USER | ADMIN |
|--------|----------|------|-------|
| Voir landing `/` | ✅ | ✅ | ✅ |
| Voir header/footer | ✅ | ✅ | ✅ |
| Changer de langue | ✅ | ✅ | ✅ |
| Voir lien Dashboard | ❌ | ✅ | ✅ |
| Voir boutons Connexion/Inscription | ✅ | ❌ | ❌ |

---

## 🎨 Maquettes / Wireframes

### Layout — Header (Desktop, anonyme)

```
┌────────────────────────────────────────────────────────────────────┐
│  ♟ Chess Training       [Ouvertures]      [🇫🇷 FR ▼]  [Connexion] [Inscription] │
└────────────────────────────────────────────────────────────────────┘
```

### Layout — Header (Desktop, connecté)

```
┌────────────────────────────────────────────────────────────────────┐
│  ♟ Chess Training       [Ouvertures]      [🇫🇷 FR ▼]  [Dashboard]  [Déconnexion] │
└────────────────────────────────────────────────────────────────────┘
```

### Layout — Header (Mobile)

```
┌──────────────────────────┐
│  ♟ Chess Training    [☰] │
└──────────────────────────┘
        ┌──────────────┐
        │ Ouvertures   │
        │ 🇫🇷 Français  │
        │ Connexion    │
        │ Inscription  │
        └──────────────┘
```

### Landing `/` (Desktop)

```
┌────────────────────────────────────────────────────────────────────┐
│  [HEADER]                                                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│        Maîtrisez les ouvertures d'échecs                          │
│        Explorez, apprenez et entraînez-vous sur les ouvertures    │
│        classiques et modernes grâce à notre bibliothèque          │
│        interactive.                                                │
│                                                                    │
│                  [ Explorer les ouvertures ]                       │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   │
│  │ 📚                │ │ ♟                 │ │ 📈                │   │
│  │ Bibliothèque      │ │ Échiquier         │ │ Progression       │   │
│  │ d'ouvertures      │ │ interactif        │ │ personnelle       │   │
│  │                    │ │                   │ │                   │   │
│  │ Accédez à une     │ │ Visualisez chaque │ │ Créez vos propres│   │
│  │ collection         │ │ ouverture coup    │ │ répertoires,     │   │
│  │ complète...        │ │ par coup...       │ │ sauvegardez...   │   │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘   │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Ouvertures populaires                                             │
│  Découvrez quelques-unes des ouvertures les plus jouées            │
│                                                                    │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   │
│  │ Défense Sicilienne│ │ Ruy Lopez        │ │ Gambit du Roi    │   │
│  │ B20               │ │ C60              │ │ C30              │   │
│  │ 1.e4 c5           │ │ 1.e4 e5 2.Nf3   │ │ 1.e4 e5 2.f4    │   │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘   │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│        Prêt à progresser ?                                         │
│        Créez votre compte gratuitement et commencez à             │
│        construire votre répertoire d'ouvertures.                  │
│                                                                    │
│                [ S'inscrire gratuitement ]                          │
│                                                                    │
├────────────────────────────────────────────────────────────────────┤
│  [FOOTER]  © 2026 Chess Training. Tous droits réservés.           │
└────────────────────────────────────────────────────────────────────┘
```

### Sélecteur de langue (Header)

```
┌──────────────────────────────────────────────────────────────────┐
│  ♟ Chess Training       [Ouvertures]        [🇫🇷 FR ▼] [Connexion] │
│                                              ├────────┤            │
│                                              │ 🇬🇧 EN  │            │
│                                              │ 🇫🇷 FR  │            │
│                                              └────────┘            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📊 Données de Test

### Ouvertures populaires (affichage statique sur la landing)

```json
[
  {
    "name": "Défense Sicilienne",
    "ecoCode": "B20",
    "moves": "1.e4 c5",
    "description": "Une des ouvertures les plus populaires au plus haut niveau."
  },
  {
    "name": "Ruy Lopez",
    "ecoCode": "C60",
    "moves": "1.e4 e5 2.Nf3 Nc6 3.Bb5",
    "description": "Ouverture classique nommée d'après un prêtre espagnol du 16e siècle."
  },
  {
    "name": "Gambit du Roi",
    "ecoCode": "C30",
    "moves": "1.e4 e5 2.f4",
    "description": "Ouverture agressive sacrifiant un pion pour le développement."
  }
]
```

---

## 🧪 Scénarios de Test

### Frontend

| Scénario | Actions | Expected |
|----------|---------|----------|
| Landing anonyme | Charger `/` sans token | Hero, cartes valeur, aperçu, CTA inscription |
| Landing connecté | Charger `/` avec token | Hero, cartes valeur, aperçu, lien dashboard |
| Header anonyme | Charger une page sans token | Logo, lien Ouvertures, boutons Connexion/Inscription, LanguageSwitcher |
| Header connecté | Charger une page avec token | Logo, lien Ouvertures, lien Dashboard, bouton Déconnexion, LanguageSwitcher |
| Changement de langue | Cliquer sur 🇬🇧 EN | Tous les textes passent en anglais instantanément |
| Persistence langue | Changer en EN, recharger la page | La page s'affiche en anglais |
| Détection langue | Navigateur en anglais, pas de localStorage | Le site s'affiche en anglais |
| Fallback langue | Navigateur en allemand, pas de localStorage | Le site s'affiche en français |
| Mobile hamburger | Charger sur mobile | Menu hamburger, liens dans le drawer |
| Footer | Charger une page | Copyright visible en bas |

### Tests unitaires

```typescript
// Layout.test.tsx
describe('Layout', () => {
  it('should render header with logo and navigation links');
  it('should render footer with copyright');
  it('should show login/register buttons when not authenticated');
  it('should show dashboard/logout buttons when authenticated');
  it('should render LanguageSwitcher in header');
  it('should render child content via Outlet');
});

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

// HomePage.test.tsx
describe('HomePage', () => {
  it('should render hero section with title and CTA');
  it('should render 3 feature cards');
  it('should render popular openings preview');
  it('should show register CTA when not authenticated');
  it('should show dashboard link when authenticated');
  it('should translate content when language changes');
});
```

---

## ⚠️ Risques et Dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Traductions manquantes | Texte en français par défaut | Script de validation CI, `fallbackLng: 'fr'` |
| Performance (fichiers JSON) | Chargement initial lent | Namespace splitting, imports statiques |
| Clés de traduction incorrectes | Crash ou texte manquant | TypeScript strict, types `i18n.d.ts`, tests |
| Layout responsive complexe | Temps de dev accru | Utiliser flexbox/grid, tester sur breakpoints |

---

## 📈 Métriques de Succès

| Métrique | Objectif |
|----------|----------|
| Temps de chargement landing | < 500ms |
| Couverture de tests | > 80% |
| Clés de traduction manquantes | 0 |
| Score Lighthouse (mobile) | > 90 |

---

## 📝 Notes

- 2026-03-08 : Création de cette feature en extrayant la landing de la Feature 003 (ex-002) et en intégrant l'i18n (ex-006) pour former les fondations transversales de l'app.
- Le composant `Layout` est le socle visuel de toute l'application ; toutes les features suivantes héritent de ce layout.
- Les fichiers de traduction `auth.json` et `openings.json` fournissent le squelette initial ; ils seront complétés au fur et à mesure de l'implémentation des features 002 et 003.
- Le `LanguageSwitcher` vit dans le header du `Layout` — interdépendance naturelle entre layout et i18n.
- Considérer l'ajout d'autres langues (espagnol, allemand) dans une phase ultérieure.
- Prévoir la traduction du contenu dynamique (backend i18n) en phase 2 si nécessaire.

### Accessibilité

- Attribut `lang` sur le `<html>` mis à jour dynamiquement par `i18next`
- Labels aria pour le sélecteur de langue
- Annonce du changement de langue aux lecteurs d'écran
- Navigation au clavier dans le header et le menu mobile

---

## 📅 Historique

| Date | Auteur | Modification |
|------|--------|--------------|
| 2026-03-08 | Équipe Chess Training | Création initiale — extraction de la landing (ex-Feature 002), intégration de l'i18n (ex-Feature 006), ajout du layout partagé |

---

## ✅ Definition of Done

- [ ] Landing page `/` avec hero, cartes valeur, aperçu, CTA — responsive
- [ ] Composant `Layout` (header + footer) intégré sur toutes les routes
- [ ] Header : logo, navigation, LanguageSwitcher, zone utilisateur (anonyme/connecté)
- [ ] Footer : copyright
- [ ] Menu hamburger sur mobile
- [ ] Configuration i18next fonctionnelle (FR/EN)
- [ ] Fichiers de traduction FR/EN complets (common, auth, openings, errors)
- [ ] Composant `LanguageSwitcher` implémenté et intégré dans le header
- [ ] Hook `useLanguage` implémenté
- [ ] Détection automatique de la langue du navigateur
- [ ] Persistence du choix de langue dans `localStorage`
- [ ] Tous les textes statiques traduits via `t()`
- [ ] Typage TypeScript strict pour i18n (`i18n.d.ts`)
- [ ] Tests unitaires (>80% couverture)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Documentation mise à jour

