# Feature : Gestion des Ouvertures

> 📝 **Statut** : Ready
> 
> 📅 **Date de création** : 2026-02-15
> 
> 👤 **Auteur** : Équipe Chess Training

## 📋 Résumé

Permettre aux utilisateurs authentifiés de créer, modifier, supprimer et gérer leurs propres ouvertures. Les utilisateurs peuvent choisir de rendre leurs ouvertures publiques (visibles par tous) ou privées (visibles uniquement par eux-mêmes).

## ✅ Statut d'implémentation

### Consultation publique (implémenté ✅)

La consultation publique des ouvertures est entièrement implémentée :

**Backend :**
- `PublicOpeningController` — 3 endpoints REST sous `/api/v1/public/openings`
  - `GET /` — Liste paginée (tri par date de création décroissante)
  - `GET /{id}` — Détail d'une ouverture publique
  - `GET /search?q=` — Recherche par nom (insensible à la casse)
- `PublicOpeningService` / `PublicOpeningServiceImpl` — Logique métier avec mapping DTO
- `OpeningRepository` — Requêtes JPA avec `@EntityGraph` pour éviter les N+1
- DTOs : `OpeningListItemResponse`, `OpeningDetailResponse`, `PageResponse<T>`
- Endpoints publics (`permitAll()`) — aucune authentification requise

**Frontend :**
- `OpeningsListPage` — Grille de cartes avec recherche, pagination et CTA inscription
- `OpeningDetailPage` — Détail avec visualiseur de coups, description, badge ECO
- Composants : `OpeningCard`, `SearchBar`, `Pagination`, `ChessboardViewer`
- Service API : `publicOpeningService` (typé TypeScript)
- Hooks : `usePublicOpenings`, `usePublicOpening`
- Routes : `/openings` (liste), `/openings/:id` (détail)

**Tests :**
- Backend : 21 tests (service + controller)
- Frontend : 8 fichiers de tests (pages, composants, hooks)

### CRUD authentifié (à implémenter ⏳)

Les user stories US1 à US6 (création, modification, suppression, visibilité, consultation privée, validation des coups) restent à implémenter.

## 🎯 Objectifs

- [ ] Permettre la création d'ouvertures personnalisées
- [ ] Permettre l'édition et la suppression de ses propres ouvertures
- [ ] Gérer la visibilité (publique/privée) des ouvertures
- [ ] Organiser et retrouver facilement ses ouvertures
- [ ] Validation de la cohérence des coups saisis

## 👥 User Stories

### US1 : Créer une ouverture
**En tant que** utilisateur authentifié,  
**je veux** créer une nouvelle ouverture avec des coups personnalisés,  
**afin de** constituer mon répertoire personnel d'ouvertures.

**Critères d'acceptation :**
- [ ] Formulaire de création accessible depuis le dashboard
- [ ] Champs : nom, description, code ECO (optionnel), coups, visibilité (public/privé)
- [ ] Saisie des coups en notation algébrique
- [ ] Validation en temps réel des coups saisis (coups légaux)
- [ ] Prévisualisation sur échiquier pendant la saisie
- [ ] Message de confirmation après création
- [ ] Redirection vers la page de détail de l'ouverture créée

### US2 : Modifier une ouverture
**En tant que** utilisateur authentifié,  
**je veux** modifier une ouverture que j'ai créée,  
**afin de** corriger des erreurs ou affiner mes variantes.

**Critères d'acceptation :**
- [ ] Bouton "Modifier" visible uniquement sur mes propres ouvertures
- [ ] Formulaire pré-rempli avec les données existantes
- [ ] Possibilité de changer tous les champs (nom, description, coups, visibilité)
- [ ] Validation des coups modifiés
- [ ] Prévisualisation des changements
- [ ] Enregistrement avec confirmation

### US3 : Supprimer une ouverture
**En tant que** utilisateur authentifié,  
**je veux** supprimer une ouverture que j'ai créée,  
**afin de** nettoyer mon répertoire.

**Critères d'acceptation :**
- [ ] Bouton "Supprimer" visible uniquement sur mes propres ouvertures
- [ ] Confirmation avant suppression (modal ou dialogue)
- [ ] Suppression effective en base de données
- [ ] Message de confirmation après suppression
- [ ] Redirection vers la liste de mes ouvertures

### US4 : Gérer la visibilité
**En tant que** utilisateur authentifié,  
**je veux** choisir si mon ouverture est publique ou privée,  
**afin de** contrôler qui peut la voir.

**Critères d'acceptation :**
- [ ] Toggle ou radio button "Public/Privé" dans le formulaire
- [ ] Par défaut, nouvelles ouvertures sont privées
- [ ] Badge visible indiquant le statut (🔓 Public / 🔒 Privé)
- [ ] Possibilité de changer la visibilité à tout moment
- [ ] Les ouvertures privées n'apparaissent pas dans `/api/public/openings`

### US5 : Consulter mes ouvertures
**En tant que** utilisateur authentifié,  
**je veux** voir la liste de toutes mes ouvertures (publiques et privées),  
**afin de** les gérer et les consulter facilement.

**Critères d'acceptation :**
- [ ] Page dédiée "Mes Ouvertures" accessible depuis le menu
- [ ] Affichage de toutes mes ouvertures (privées + publiques)
- [ ] Indication visuelle de la visibilité de chaque ouverture
- [ ] Tri par date de création ou nom
- [ ] Recherche dans mes ouvertures
- [ ] Actions rapides (éditer, supprimer, voir détail)

### US6 : Validation des coups
**En tant que** utilisateur authentifié,  
**je veux** que le système valide les coups que je saisis,  
**afin de** garantir que mon ouverture est légale.

**Critères d'acceptation :**
- [ ] Utilisation de chess.js pour valider les coups
- [ ] Message d'erreur clair si coup illégal détecté
- [ ] Affichage de la position résultante en temps réel
- [ ] Empêcher la sauvegarde si coups invalides
- [ ] Suggestion de correction si possible

## 🏗️ Conception technique

### Backend

#### Entités
```
Opening (déjà définie en Feature 002)
├── id: UUID
├── name: String
├── description: String
├── ecoCode: String (nullable)
├── moves: String (notation algébrique)
├── isPublic: Boolean
├── userId: UUID (foreign key vers User)
├── createdAt: Instant
└── updatedAt: Instant
```

#### Endpoints API
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/openings` | Liste des ouvertures de l'utilisateur connecté | ✅ |
| POST | `/api/openings` | Créer une ouverture | ✅ |
| GET | `/api/openings/{id}` | Détail d'une ouverture (si propriétaire ou publique) | ✅ |
| PUT | `/api/openings/{id}` | Modifier une ouverture (si propriétaire) | ✅ |
| DELETE | `/api/openings/{id}` | Supprimer une ouverture (si propriétaire) | ✅ |
| PATCH | `/api/openings/{id}/visibility` | Changer la visibilité | ✅ |

#### DTOs
```java
// Requests
CreateOpeningRequest(
    String name,
    String description,
    String ecoCode,  // nullable
    String moves,
    Boolean isPublic
)

UpdateOpeningRequest(
    String name,
    String description,
    String ecoCode,
    String moves,
    Boolean isPublic
)

UpdateVisibilityRequest(
    Boolean isPublic
)

// Responses
OpeningResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    String moves,
    Boolean isPublic,
    UUID userId,
    String authorName,
    Instant createdAt,
    Instant updatedAt
)
```

#### Services
- `OpeningService` : Logique métier CRUD des ouvertures
  - `createOpening(userId, request)` : Validation + création
  - `updateOpening(userId, openingId, request)` : Vérification propriétaire + update
  - `deleteOpening(userId, openingId)` : Vérification propriétaire + suppression
  - `getUserOpenings(userId, pageable)` : Liste des ouvertures de l'utilisateur
  - `toggleVisibility(userId, openingId)` : Changer visibilité

#### Repositories
- `OpeningRepository` : Repository JPA
  - `findByUserId(UUID userId, Pageable pageable)`
  - `findByIdAndUserId(UUID id, UUID userId)` : Vérifier la propriété
  - `existsByIdAndUserId(UUID id, UUID userId)`

#### Exceptions
```java
OpeningNotFoundException extends RuntimeException
UnauthorizedAccessException extends RuntimeException
InvalidMovesException extends RuntimeException
```

### Frontend

#### Composants
- `MyOpeningsList` : Liste des ouvertures de l'utilisateur
  - Props: openings, onEdit, onDelete, onView
- `OpeningForm` : Formulaire création/édition
  - Props: opening (pour édition), onSubmit, onCancel
  - State: name, description, ecoCode, moves, isPublic
- `MovesEditor` : Éditeur de coups avec validation
  - Props: moves, onChange, onValidate
  - Utilise chess.js pour validation
- `VisibilityToggle` : Toggle public/privé
  - Props: isPublic, onChange
- `DeleteConfirmModal` : Modal de confirmation suppression
  - Props: isOpen, onConfirm, onCancel, openingName

#### Routes
| Route | Composant | Protection |
|-------|-----------|------------|
| `/my-openings` | MyOpeningsPage | Protégé |
| `/openings/new` | CreateOpeningPage | Protégé |
| `/openings/:id/edit` | EditOpeningPage | Protégé (propriétaire) |

#### Hooks
- `useMyOpenings()` : Récupère les ouvertures de l'utilisateur
- `useCreateOpening()` : Mutation de création
- `useUpdateOpening(id)` : Mutation de mise à jour
- `useDeleteOpening(id)` : Mutation de suppression
- `useValidateMoves(moves)` : Validation en temps réel des coups

#### Services
```typescript
// src/services/openingService.ts
export const openingService = {
  async getMyOpenings(page = 0, size = 20): Promise<PageResponse<Opening>>,
  async getOpening(id: string): Promise<Opening>,
  async createOpening(data: CreateOpeningRequest): Promise<Opening>,
  async updateOpening(id: string, data: UpdateOpeningRequest): Promise<Opening>,
  async deleteOpening(id: string): Promise<void>,
  async updateVisibility(id: string, isPublic: boolean): Promise<Opening>
}
```

#### Types
```typescript
// src/types/opening.ts
interface CreateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

interface UpdateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

interface Opening {
  id: string;
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
  userId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}
```

#### Validation
```typescript
// src/utils/movesValidator.ts
import { Chess } from 'chess.js';

export const validateMoves = (movesString: string): {
  valid: boolean;
  error?: string;
  position?: string; // FEN
} => {
  const chess = new Chess();
  const moves = movesString.split(/\s+/);
  
  try {
    for (const move of moves) {
      // Ignorer les numéros de coups (1., 2., etc.)
      if (/^\d+\./.test(move)) continue;
      
      const result = chess.move(move);
      if (!result) {
        return {
          valid: false,
          error: `Coup invalide : ${move}`
        };
      }
    }
    
    return {
      valid: true,
      position: chess.fen()
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};
```

## 🎨 Maquettes / Wireframes

### Page "Mes Ouvertures"
```
┌─────────────────────────────────────────────────────────────┐
│ ChessOT    [Mes Ouvertures] [Publiques]     [Profil] [⚙]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Mes Ouvertures                         [+ Nouvelle]        │
│                                                               │
│  [Rechercher...]                         Tri: [Date ▼]      │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔒 Ma Sicilienne Najdorf Personnalisée        [⋮]      ││
│  │    B90 · 18 coups · Privé                               ││
│  │    Modifié il y a 2 jours                               ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔓 Variante Caro-Kann Agressive               [⋮]      ││
│  │    B12 · 12 coups · Public                              ││
│  │    Créé il y a 1 semaine                                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Formulaire de Création
```
┌─────────────────────────────────────────────────────────────┐
│ Créer une nouvelle ouverture                [Annuler] [✓]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Nom *                                                       │
│  [Ma Sicilienne Dragon                            ]         │
│                                                               │
│  Description                                                 │
│  [Variante agressive de la Sicilienne...         ]         │
│  [                                                ]         │
│                                                               │
│  Code ECO (optionnel)                                       │
│  [B70                                             ]         │
│                                                               │
│  Coups *                                                     │
│  [1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6]         │
│                                                               │
│  ┌────────────────────┐                                      │
│  │   Prévisualisation │                                      │
│  │      (Échiquier)   │                                      │
│  └────────────────────┘                                      │
│                                                               │
│  Visibilité                                                  │
│  ( ) Public  (•) Privé                                      │
│                                                               │
│  [Annuler]                                  [Créer]         │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Données de test

```json
{
  "createOpeningRequest": {
    "name": "Ma Sicilienne Dragon Accélérée",
    "description": "Variante rapide de la Dragon, sans jouer d6",
    "ecoCode": "B35",
    "moves": "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6",
    "isPublic": false
  },
  "updateOpeningRequest": {
    "name": "Ma Sicilienne Dragon Accélérée (Améliorée)",
    "description": "Version améliorée avec continuation",
    "ecoCode": "B35",
    "moves": "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6 5.Nc3 Bg7",
    "isPublic": true
  }
}
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Validation des coups complexe | Élevé | Utiliser chess.js (librairie éprouvée) |
| Sécurité : accès aux ouvertures d'autrui | Élevé | Vérification stricte userId dans services |
| Performance avec nombreuses ouvertures | Moyen | Pagination + indexation sur userId |
| UX saisie des coups | Moyen | Autocomplétion, validation temps réel |
| Dépendance à Feature 001 (Auth) | Élevé | Feature 001 doit être complète |

## 📝 Notes

- Considérer l'ajout d'un éditeur visuel de coups (glisser-déposer) dans une version ultérieure
- Envisager un système de tags/catégories pour organiser les ouvertures
- Prévoir un système d'import/export PGN pour V1.1
- Limiter le nombre d'ouvertures par utilisateur pour le MVP (ex: 50 max)
- Ajouter des statistiques d'utilisation des ouvertures publiques (nombre de vues)

## ✅ Definition of Done

- [ ] Endpoints CRUD implémentés et sécurisés
- [ ] Vérification de propriété sur update/delete
- [ ] Tests unitaires services (>80% couverture)
- [ ] Tests d'intégration endpoints avec authentification
- [ ] Page "Mes Ouvertures" fonctionnelle
- [ ] Formulaire création avec validation en temps réel
- [ ] Formulaire édition avec pré-remplissage
- [ ] Modal de confirmation suppression
- [ ] Toggle de visibilité opérationnel
- [ ] Validation des coups avec chess.js
- [ ] Tests E2E du parcours complet (créer, éditer, supprimer)
- [ ] Documentation API OpenAPI
- [ ] Gestion des erreurs (401, 403, 404)

