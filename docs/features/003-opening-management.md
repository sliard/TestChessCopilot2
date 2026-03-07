# Feature 003 : Gestion des Ouvertures — CRUD Authentifié

> 📝 **Statut** : Ready
>
> 📅 **Date de création** : 2026-02-15
>
> 📅 **Dernière mise à jour** : 2026-03-07
>
> 👤 **Auteur** : Équipe Chess Training
>
> 🔗 **Dépendances** : [Feature 001 — Authentification](001-user-authentication.md), [Feature 002 — Consultation publique](002-public-openings-browsing.md)

## 📋 Résumé

Permettre aux utilisateurs authentifiés de **créer, modifier, supprimer et gérer** leurs propres ouvertures d'échecs. Chaque ouverture peut être **publique** (visible par tous via Feature 002) ou **privée** (visible uniquement par son propriétaire). Les coups saisis sont validés côté client via `chess.js` pour garantir leur légalité.

> **Périmètre** : Cette feature couvre uniquement les opérations CRUD authentifiées. La consultation publique en lecture seule est traitée dans [Feature 002](002-public-openings-browsing.md).

## ✅ Statut d'implémentation

| Composant | Statut |
|-----------|--------|
| Entité `Opening` + migration DB | ✅ Implémenté (Feature 002) |
| `OpeningRepository` (méthodes publiques) | ✅ Implémenté (Feature 002) |
| `OpeningRepository` (méthodes utilisateur) | ⏳ À implémenter |
| `UserOpeningService` / `UserOpeningServiceImpl` | ⏳ À implémenter |
| `UserOpeningController` (6 endpoints) | ⏳ À implémenter |
| DTOs Request/Response CRUD | ⏳ À implémenter |
| Frontend — pages, composants, hooks, service | ⏳ À implémenter |
| Tests backend + frontend | ⏳ À implémenter |

## 🎯 Objectifs

- [ ] Permettre la création d'ouvertures personnalisées
- [ ] Permettre l'édition et la suppression de ses propres ouvertures
- [ ] Gérer la visibilité (publique/privée) des ouvertures
- [ ] Organiser et retrouver facilement ses ouvertures
- [ ] Valider la cohérence des coups saisis (coups légaux uniquement)

## 👥 User Stories

### US1 : Créer une ouverture

**En tant que** utilisateur authentifié,
**je veux** créer une nouvelle ouverture avec des coups personnalisés,
**afin de** constituer mon répertoire personnel d'ouvertures.

**Critères d'acceptation :**

- [ ] Formulaire de création accessible depuis la page "Mes Ouvertures"
- [ ] Champs : nom (requis), description, code ECO (optionnel), coups (requis), visibilité
- [ ] Saisie des coups en notation algébrique standard (SAN)
- [ ] Validation en temps réel des coups via `chess.js` (coups légaux uniquement)
- [ ] Prévisualisation de la position sur échiquier pendant la saisie
- [ ] Nouvelles ouvertures privées par défaut
- [ ] Après création : redirection vers la page "Mes Ouvertures" avec message de confirmation
- [ ] L'API retourne `201 Created` avec l'ouverture créée

### US2 : Modifier une ouverture

**En tant que** utilisateur authentifié,
**je veux** modifier une ouverture que j'ai créée,
**afin de** corriger des erreurs ou affiner mes variantes.

**Critères d'acceptation :**

- [ ] Bouton "Modifier" visible uniquement sur les ouvertures dont je suis propriétaire
- [ ] Formulaire pré-rempli avec les données existantes
- [ ] Possibilité de modifier tous les champs (nom, description, code ECO, coups, visibilité)
- [ ] Validation des coups modifiés avant sauvegarde
- [ ] Prévisualisation de la position mise à jour
- [ ] Après modification : redirection vers "Mes Ouvertures" avec message de confirmation
- [ ] L'API retourne `403 Forbidden` si l'utilisateur n'est pas propriétaire

### US3 : Supprimer une ouverture

**En tant que** utilisateur authentifié,
**je veux** supprimer une ouverture que j'ai créée,
**afin de** nettoyer mon répertoire.

**Critères d'acceptation :**

- [ ] Bouton "Supprimer" visible uniquement sur mes propres ouvertures
- [ ] Modal de confirmation avant suppression (affiche le nom de l'ouverture)
- [ ] Suppression effective en base de données
- [ ] Après suppression : message de confirmation, liste rafraîchie
- [ ] L'API retourne `204 No Content` en cas de succès
- [ ] L'API retourne `403 Forbidden` si l'utilisateur n'est pas propriétaire

### US4 : Gérer la visibilité

**En tant que** utilisateur authentifié,
**je veux** choisir si mon ouverture est publique ou privée,
**afin de** contrôler qui peut la voir.

**Critères d'acceptation :**

- [ ] Toggle "Public/Privé" dans le formulaire de création et d'édition
- [ ] Par défaut, nouvelles ouvertures sont **privées**
- [ ] Badge visuel indiquant le statut : 🔓 Public / 🔒 Privé
- [ ] Possibilité de changer la visibilité via endpoint PATCH dédié
- [ ] Les ouvertures privées n'apparaissent **pas** dans `/api/v1/public/openings`
- [ ] Les ouvertures rendues publiques apparaissent immédiatement dans la consultation publique

### US5 : Consulter mes ouvertures

**En tant que** utilisateur authentifié,
**je veux** voir la liste de toutes mes ouvertures (publiques et privées),
**afin de** les gérer et les consulter facilement.

**Critères d'acceptation :**

- [ ] Page dédiée "Mes Ouvertures" accessible depuis le menu (navigation authentifiée)
- [ ] Affichage de toutes mes ouvertures (privées + publiques)
- [ ] Badge de visibilité sur chaque carte (🔓/🔒)
- [ ] Tri par date de création (défaut, décroissant) ou par nom
- [ ] Recherche textuelle dans mes ouvertures (nom)
- [ ] Pagination (20 éléments par page par défaut)
- [ ] Actions rapides sur chaque carte : Modifier, Supprimer, Voir détail
- [ ] État vide : message d'encouragement + bouton "Créer ma première ouverture"

### US6 : Validation des coups

**En tant que** utilisateur authentifié,
**je veux** que le système valide les coups que je saisis,
**afin de** garantir que mon ouverture est légale.

**Critères d'acceptation :**

- [ ] Validation côté client via `chess.js` à chaque modification du champ "coups"
- [ ] Message d'erreur clair si coup illégal détecté (ex: "Coup invalide : Nf5")
- [ ] Affichage de la position résultante (FEN) en temps réel sur l'échiquier
- [ ] Le bouton "Créer" / "Enregistrer" est désactivé tant que les coups sont invalides
- [ ] Support de la notation algébrique standard avec numéros de coups (ex: `1.e4 e5 2.Nf3`)

---

## 🏗️ Conception technique

### Backend

#### Entité existante

L'entité `Opening` est déjà définie (Feature 002). Aucune modification de schéma nécessaire.

```
Opening
├── id: UUID (PK, auto-generated)
├── name: String (NOT NULL, max 255)
├── description: String (TEXT, nullable)
├── ecoCode: String (max 10, nullable)
├── moves: String (TEXT, nullable)
├── isPublic: Boolean (NOT NULL, default TRUE)
├── user: User (ManyToOne, LAZY, FK → app_user.id)
├── createdAt: Instant (@CreatedDate)
└── updatedAt: Instant (@LastModifiedDate)
```

Index existant : `idx_opening_user_id` sur `user_id`.

#### Endpoints API

Tous les endpoints sont protégés par authentification JWT (`Authorization: Bearer {token}`).
Le préfixe est `/api/v1/openings` — cohérent avec `/api/v1/auth/` et `/api/v1/public/openings`.

| Méthode | Endpoint | Description | Succès | Erreurs |
|---------|----------|-------------|--------|---------|
| `GET` | `/api/v1/openings` | Liste paginée des ouvertures de l'utilisateur connecté | `200 OK` | `401 Unauthorized` |
| `POST` | `/api/v1/openings` | Créer une ouverture | `201 Created` | `400 Bad Request`, `401 Unauthorized` |
| `GET` | `/api/v1/openings/{id}` | Détail d'une ouverture (si propriétaire) | `200 OK` | `401 Unauthorized`, `404 Not Found` |
| `PUT` | `/api/v1/openings/{id}` | Modifier une ouverture (si propriétaire) | `200 OK` | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |
| `DELETE` | `/api/v1/openings/{id}` | Supprimer une ouverture (si propriétaire) | `204 No Content` | `401 Unauthorized`, `404 Not Found` |
| `PATCH` | `/api/v1/openings/{id}/visibility` | Changer la visibilité (si propriétaire) | `200 OK` | `400 Bad Request`, `401 Unauthorized`, `404 Not Found` |

> **Note sécurité** : Les endpoints `GET/{id}`, `PUT`, `DELETE` et `PATCH` retournent `404 Not Found` (et non `403 Forbidden`) quand l'ouverture n'appartient pas à l'utilisateur. Cela évite de révéler l'existence d'une ressource à un utilisateur non autorisé.

**Paramètres de pagination (`GET /api/v1/openings`) :**

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `page` | int | `0` | Numéro de page (0-indexed) |
| `size` | int | `20` | Nombre d'éléments par page |
| `sort` | string | `createdAt` | Champ de tri (`createdAt`, `updatedAt`, `name`) |
| `order` | string | `desc` | Ordre de tri (`asc`, `desc`) |
| `q` | string | — | Recherche textuelle sur le nom (insensible à la casse) |

#### DTOs

**Requests** (Java records avec Bean Validation) :

```java
public record CreateOpeningRequest(
    @NotBlank @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @Size(max = 10) String ecoCode,
    @NotBlank String moves,
    @NotNull Boolean isPublic
) {}

public record UpdateOpeningRequest(
    @NotBlank @Size(max = 255) String name,
    @Size(max = 2000) String description,
    @Size(max = 10) String ecoCode,
    @NotBlank String moves,
    @NotNull Boolean isPublic
) {}

public record UpdateVisibilityRequest(
    @NotNull Boolean isPublic
) {}
```

**Responses** (Java records) :

```java
// Réponse détaillée pour le propriétaire (création, lecture, modification)
public record UserOpeningResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    String moves,
    Integer movesCount,
    Boolean isPublic,
    String authorName,
    Instant createdAt,
    Instant updatedAt
) {}

// Réponse liste pour "Mes Ouvertures"
public record UserOpeningListItemResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    Integer movesCount,
    Boolean isPublic,
    Instant createdAt,
    Instant updatedAt
) {}
```

> **Note** : Le `userId` n'est pas exposé dans les réponses — l'utilisateur connecté est toujours le propriétaire dans ce contexte. Le champ `authorName` est inclus pour cohérence d'affichage.

**Réponse paginée** (réutilisation de `PageResponse<T>` existant) :

```java
// Déjà existant — réutilisé tel quel
public record PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages,
    boolean first,
    boolean last
) {}
```

#### Réponses d'erreur

Le `GlobalExceptionHandler` existant gère déjà les exceptions suivantes — aucune classe d'exception custom n'est nécessaire :

| Cas d'erreur | Exception levée | HTTP Status | Code erreur |
|-------------|----------------|-------------|-------------|
| Ouverture non trouvée (ou pas propriétaire) | `EntityNotFoundException` | `404` | `NOT_FOUND` |
| Validation DTO échouée | `MethodArgumentNotValidException` | `400` | `VALIDATION_ERROR` |
| Token JWT absent ou invalide | Géré par Spring Security | `401` | — |
| Coups invalides (si validation serveur) | `IllegalArgumentException` | `400` | `BAD_REQUEST` |

Format de réponse erreur (existant) :

```json
{
  "code": "NOT_FOUND",
  "message": "Ouverture non trouvée",
  "status": 404,
  "path": "/api/v1/openings/550e8400-e29b-41d4-a716-446655440000",
  "timestamp": "2026-03-07T10:30:00Z",
  "errors": null
}
```

#### Controller

```java
@RestController
@RequestMapping("/api/v1/openings")
@RequiredArgsConstructor
@Tag(name = "User Openings", description = "Gestion des ouvertures de l'utilisateur connecté")
public class UserOpeningController {

    private final UserOpeningService userOpeningService;

    @GetMapping
    @Operation(summary = "Lister mes ouvertures")
    public PageResponse<UserOpeningListItemResponse> getMyOpenings(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String order,
            @RequestParam(required = false) String q) { ... }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Créer une ouverture")
    public UserOpeningResponse createOpening(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CreateOpeningRequest request) { ... }

    @GetMapping("/{id}")
    @Operation(summary = "Détail d'une de mes ouvertures")
    public UserOpeningResponse getOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) { ... }

    @PutMapping("/{id}")
    @Operation(summary = "Modifier une de mes ouvertures")
    public UserOpeningResponse updateOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateOpeningRequest request) { ... }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer une de mes ouvertures")
    public void deleteOpening(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id) { ... }

    @PatchMapping("/{id}/visibility")
    @Operation(summary = "Changer la visibilité d'une ouverture")
    public UserOpeningResponse updateVisibility(
            @AuthenticationPrincipal User user,
            @PathVariable UUID id,
            @Valid @RequestBody UpdateVisibilityRequest request) { ... }
}
```

> **Pattern auth** : `@AuthenticationPrincipal User user` injecte directement l'entité `User` (qui implémente `UserDetails`). Le `user.getId()` fournit l'UUID du propriétaire.

#### Service

```java
// Interface
public interface UserOpeningService {
    PageResponse<UserOpeningListItemResponse> getUserOpenings(UUID userId, String query, Pageable pageable);
    UserOpeningResponse createOpening(UUID userId, CreateOpeningRequest request);
    UserOpeningResponse getOpening(UUID userId, UUID openingId);
    UserOpeningResponse updateOpening(UUID userId, UUID openingId, UpdateOpeningRequest request);
    void deleteOpening(UUID userId, UUID openingId);
    UserOpeningResponse updateVisibility(UUID userId, UUID openingId, UpdateVisibilityRequest request);
}

// Implémentation
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserOpeningServiceImpl implements UserOpeningService {

    private final OpeningRepository openingRepository;
    private final UserRepository userRepository;

    @Override
    public PageResponse<UserOpeningListItemResponse> getUserOpenings(
            UUID userId, String query, Pageable pageable) {
        // Si query non null : recherche par nom + userId
        // Sinon : findByUserId avec pagination
    }

    @Override
    @Transactional
    public UserOpeningResponse createOpening(UUID userId, CreateOpeningRequest request) {
        // 1. Charger le User
        // 2. Mapper request → Opening entity
        // 3. Sauvegarder
        // 4. Retourner UserOpeningResponse
    }

    @Override
    public UserOpeningResponse getOpening(UUID userId, UUID openingId) {
        // findByIdAndUserId → sinon EntityNotFoundException
    }

    @Override
    @Transactional
    public UserOpeningResponse updateOpening(UUID userId, UUID openingId, UpdateOpeningRequest request) {
        // 1. findByIdAndUserId → sinon EntityNotFoundException
        // 2. Mettre à jour les champs
        // 3. Sauvegarder
        // 4. Retourner UserOpeningResponse
    }

    @Override
    @Transactional
    public void deleteOpening(UUID userId, UUID openingId) {
        // findByIdAndUserId → sinon EntityNotFoundException
        // Supprimer
    }

    @Override
    @Transactional
    public UserOpeningResponse updateVisibility(UUID userId, UUID openingId, UpdateVisibilityRequest request) {
        // findByIdAndUserId → sinon EntityNotFoundException
        // Mettre à jour isPublic
        // Retourner UserOpeningResponse
    }

    // --- Méthodes privées de mapping ---
    private UserOpeningResponse toResponse(Opening opening) { ... }
    private UserOpeningListItemResponse toListItemResponse(Opening opening) { ... }
    private int countMoves(String moves) { ... }
}
```

#### Repository — Méthodes à ajouter

Ajouter ces méthodes à l'`OpeningRepository` existant :

```java
// Avec @EntityGraph pour prévention N+1
@EntityGraph(attributePaths = {"user"})
Page<Opening> findByUserId(UUID userId, Pageable pageable);

@EntityGraph(attributePaths = {"user"})
Optional<Opening> findByIdAndUserId(UUID id, UUID userId);

@EntityGraph(attributePaths = {"user"})
@Query("SELECT o FROM Opening o WHERE o.user.id = :userId AND LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))")
Page<Opening> searchByUserIdAndName(@Param("userId") UUID userId, @Param("query") String query, Pageable pageable);
```

---

### Frontend

#### Types

Ajouter dans `src/types/opening.ts` (compléter les types existants) :

```typescript
// Types pour le CRUD authentifié
export interface UserOpening {
  id: string;
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  movesCount: number;
  isPublic: boolean;
  authorName: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserOpeningListItem {
  id: string;
  name: string;
  description: string;
  ecoCode?: string;
  movesCount: number;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

export interface UpdateOpeningRequest {
  name: string;
  description: string;
  ecoCode?: string;
  moves: string;
  isPublic: boolean;
}

export interface UpdateVisibilityRequest {
  isPublic: boolean;
}

export interface MovesValidationResult {
  valid: boolean;
  error?: string;
  position?: string; // FEN de la position résultante
}
```

#### Service API

Nouveau fichier `src/services/userOpeningService.ts` (séparé de `publicOpeningService.ts`) :

```typescript
import { apiClient } from './apiClient';
import type { PageResponse } from '../types/common';
import type {
  UserOpening,
  UserOpeningListItem,
  CreateOpeningRequest,
  UpdateOpeningRequest,
  UpdateVisibilityRequest,
} from '../types/opening';

const BASE_URL = '/api/v1/openings';

export const userOpeningService = {
  async getMyOpenings(params?: {
    page?: number;
    size?: number;
    sort?: string;
    order?: string;
    q?: string;
  }): Promise<PageResponse<UserOpeningListItem>> {
    const searchParams = new URLSearchParams();
    if (params?.page !== undefined) searchParams.set('page', String(params.page));
    if (params?.size) searchParams.set('size', String(params.size));
    if (params?.sort) searchParams.set('sort', params.sort);
    if (params?.order) searchParams.set('order', params.order);
    if (params?.q) searchParams.set('q', params.q);
    const query = searchParams.toString();
    return apiClient.get(`${BASE_URL}${query ? `?${query}` : ''}`);
  },

  async getOpening(id: string): Promise<UserOpening> {
    return apiClient.get(`${BASE_URL}/${id}`);
  },

  async createOpening(data: CreateOpeningRequest): Promise<UserOpening> {
    return apiClient.post(BASE_URL, data);
  },

  async updateOpening(id: string, data: UpdateOpeningRequest): Promise<UserOpening> {
    return apiClient.put(`${BASE_URL}/${id}`, data);
  },

  async deleteOpening(id: string): Promise<void> {
    return apiClient.delete(`${BASE_URL}/${id}`);
  },

  async updateVisibility(id: string, data: UpdateVisibilityRequest): Promise<UserOpening> {
    return apiClient.patch(`${BASE_URL}/${id}/visibility`, data);
  },
};
```

#### Hooks

```typescript
// src/hooks/useMyOpenings.ts
// Récupère la liste paginée des ouvertures de l'utilisateur connecté
// Params : page, search, sort, order, size
// Retourne : { openings, page, loading, error, refetch }

// src/hooks/useCreateOpening.ts
// Mutation de création d'ouverture
// Retourne : { createOpening, loading, error, success }

// src/hooks/useUpdateOpening.ts
// Mutation de mise à jour d'ouverture
// Retourne : { updateOpening, loading, error, success }

// src/hooks/useDeleteOpening.ts
// Mutation de suppression d'ouverture
// Retourne : { deleteOpening, loading, error, success }

// src/hooks/useValidateMoves.ts
// Validation en temps réel des coups via chess.js (côté client uniquement)
// Params : moves (string)
// Retourne : { valid, error, position (FEN) }
```

#### Composants

| Composant | Fichier | Props | Description |
|-----------|---------|-------|-------------|
| `MyOpeningCard` | `components/MyOpeningCard.tsx` | `opening: UserOpeningListItem`, `onEdit`, `onDelete` | Carte avec badge visibilité et menu actions |
| `OpeningForm` | `components/OpeningForm.tsx` | `initialValues?`, `onSubmit`, `onCancel`, `submitLabel` | Formulaire création/édition avec validation `chess.js` |
| `MovesInput` | `components/MovesInput.tsx` | `value`, `onChange`, `validationResult` | Champ de saisie des coups avec feedback en temps réel |
| `VisibilityBadge` | `components/VisibilityBadge.tsx` | `isPublic: boolean` | Badge 🔓 Public / 🔒 Privé |
| `DeleteConfirmModal` | `components/DeleteConfirmModal.tsx` | `isOpen`, `onConfirm`, `onCancel`, `openingName` | Modal de confirmation de suppression |

#### Pages

| Route | Page | Protection | Description |
|-------|------|------------|-------------|
| `/my-openings` | `MyOpeningsPage` | 🔒 Authentifié | Liste de mes ouvertures avec recherche, tri, pagination |
| `/openings/new` | `CreateOpeningPage` | 🔒 Authentifié | Formulaire de création |
| `/openings/:id/edit` | `EditOpeningPage` | 🔒 Authentifié + propriétaire | Formulaire d'édition pré-rempli |

#### Validation des coups (utilitaire client)

```typescript
// src/utils/movesValidator.ts
import { Chess } from 'chess.js';

export const validateMoves = (movesString: string): MovesValidationResult => {
  if (!movesString.trim()) {
    return { valid: false, error: 'Les coups sont requis' };
  }

  const chess = new Chess();
  const tokens = movesString.trim().split(/\s+/);

  try {
    for (const token of tokens) {
      // Ignorer les numéros de coups (1., 2., 12., etc.)
      if (/^\d+\.+$/.test(token)) continue;

      const result = chess.move(token);
      if (!result) {
        return { valid: false, error: `Coup invalide : ${token}` };
      }
    }
    return { valid: true, position: chess.fen() };
  } catch (err) {
    return { valid: false, error: `Erreur de parsing : ${(err as Error).message}` };
  }
};
```

---

## 🎨 Maquettes / Wireframes

### Page "Mes Ouvertures" (`/my-openings`)

```
┌─────────────────────────────────────────────────────────────┐
│ ChessOT    [Mes Ouvertures] [Publiques]     [Profil] [⚙]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Mes Ouvertures                       [+ Nouvelle ouverture]│
│                                                             │
│  [🔍 Rechercher...]                      Tri: [Date ▼]     │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔒 Ma Sicilienne Najdorf Personnalisée       [✏️] [🗑️]││
│  │    B90 · 18 coups · Privé                               ││
│  │    Modifié il y a 2 jours                               ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 🔓 Variante Caro-Kann Agressive              [✏️] [🗑️]││
│  │    B12 · 12 coups · Public                              ││
│  │    Créé il y a 1 semaine                                ││
│  └─────────────────────────────────────────────────────────┘│
│                                                             │
│  ◀ 1 / 3 ▶                                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**État vide :**

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              ♟️ Aucune ouverture pour l'instant              │
│                                                             │
│   Commencez à construire votre répertoire d'ouvertures !    │
│                                                             │
│               [+ Créer ma première ouverture]               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Formulaire de Création / Édition

```
┌─────────────────────────────────────────────────────────────┐
│ Créer une nouvelle ouverture                                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Nom *                                                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Ma Sicilienne Dragon                                   │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  Description                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Variante agressive de la Sicilienne avec fianchetto    │ │
│  │ du fou roi...                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  Code ECO (optionnel)                                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ B70                                                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  Coups * (notation algébrique)                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6     │ │
│  └────────────────────────────────────────────────────────┘ │
│  ✅ 10 coups valides                                        │
│                                                             │
│  ┌──────────────────────────┐                               │
│  │      ♜ ♞ ♝ ♛ ♚ ♝ . ♜   │                               │
│  │      ♟ ♟ . . ♟ ♟ . ♟   │  Prévisualisation             │
│  │      . . . ♟ . ♞ ♟ .   │  de la position               │
│  │      . . . . . . . .   │                               │
│  │      . . . ♘ ♙ . . .   │                               │
│  │      . . . . . . . .   │                               │
│  │      ♙ ♙ ♙ . . ♙ ♙ ♙   │                               │
│  │      ♖ . ♗ ♕ ♔ ♗ ♘ ♖   │                               │
│  └──────────────────────────┘                               │
│                                                             │
│  Visibilité                                                 │
│  (•) 🔒 Privé   ( ) 🔓 Public                              │
│                                                             │
│  [Annuler]                                   [Créer]        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**État avec erreur de validation :**

```
│  Coups * (notation algébrique)                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 1.e4 c5 2.Nf3 d6 3.Qh5                               │ │
│  └────────────────────────────────────────────────────────┘ │
│  ❌ Coup invalide : Qh5                                     │
│                                                             │
│  [Annuler]                              [Créer] (désactivé) │
```

---

## 📊 Données de test

### Requêtes

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
  },
  "updateVisibilityRequest": {
    "isPublic": true
  }
}
```

### Réponses attendues

```json
{
  "createResponse_201": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Ma Sicilienne Dragon Accélérée",
    "description": "Variante rapide de la Dragon, sans jouer d6",
    "ecoCode": "B35",
    "moves": "1.e4 c5 2.Nf3 Nc6 3.d4 cxd4 4.Nxd4 g6",
    "movesCount": 8,
    "isPublic": false,
    "authorName": "Jean Dupont",
    "createdAt": "2026-03-07T10:30:00Z",
    "updatedAt": "2026-03-07T10:30:00Z"
  },
  "listResponse_200": {
    "content": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Ma Sicilienne Dragon Accélérée",
        "description": "Variante rapide de la Dragon, sans jouer d6",
        "ecoCode": "B35",
        "movesCount": 8,
        "isPublic": false,
        "createdAt": "2026-03-07T10:30:00Z",
        "updatedAt": "2026-03-07T10:30:00Z"
      }
    ],
    "page": 0,
    "size": 20,
    "totalElements": 1,
    "totalPages": 1,
    "first": true,
    "last": true
  },
  "error_404": {
    "code": "NOT_FOUND",
    "message": "Ouverture non trouvée",
    "status": 404,
    "path": "/api/v1/openings/550e8400-e29b-41d4-a716-446655440000",
    "timestamp": "2026-03-07T10:35:00Z",
    "errors": null
  },
  "error_400_validation": {
    "code": "VALIDATION_ERROR",
    "message": "Erreur de validation",
    "status": 400,
    "path": "/api/v1/openings",
    "timestamp": "2026-03-07T10:35:00Z",
    "errors": [
      "name : ne doit pas être vide",
      "moves : ne doit pas être vide"
    ]
  }
}
```

---

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| **Dépendance Feature 001** (Auth JWT) | Élevé | Feature 001 doit être complète et testée avant |
| **Sécurité : accès aux ouvertures d'autrui** | Élevé | `findByIdAndUserId()` dans toutes les opérations, retour 404 (pas 403) |
| **Validation coups côté client uniquement** | Moyen | `chess.js` côté frontend ; envisager validation serveur en V2 |
| **Performance avec nombreuses ouvertures** | Moyen | Pagination + index `idx_opening_user_id` existant |
| **UX saisie des coups en notation SAN** | Moyen | Validation temps réel + prévisualisation échiquier |
| **Cohérence public/privé** | Faible | Toggle explicite, badge visuel, pas de changement implicite |

---

## 📝 Notes

- La validation des coups est effectuée **côté client uniquement** (via `chess.js`). Une validation serveur pourra être ajoutée en V2 si nécessaire.
- Envisager un éditeur visuel de coups (glisser-déposer) dans une version ultérieure.
- Prévoir un système d'import/export PGN en V1.1.
- Considérer une limite d'ouvertures par utilisateur pour le MVP (ex: 50 max) — à valider.
- Les ouvertures "système" (sans `user_id`) ne sont pas modifiables — elles sont gérées par les données de seed.

---

## ✅ Definition of Done

### Backend
- [ ] 6 endpoints CRUD implémentés sous `/api/v1/openings`
- [ ] `UserOpeningService` (interface) + `UserOpeningServiceImpl`
- [ ] `UserOpeningController` avec `@AuthenticationPrincipal User user`
- [ ] DTOs Request avec Bean Validation (`@NotBlank`, `@Size`, `@NotNull`)
- [ ] DTOs Response (`UserOpeningResponse`, `UserOpeningListItemResponse`)
- [ ] Méthodes repository `findByUserId`, `findByIdAndUserId`, `searchByUserIdAndName` avec `@EntityGraph`
- [ ] Vérification de propriété via `findByIdAndUserId` (retour 404 si non propriétaire)
- [ ] Documentation OpenAPI (`@Tag`, `@Operation`, `@Parameter`)
- [ ] Tests unitaires service (couverture > 80%)
- [ ] Tests d'intégration controller (`@WebMvcTest` avec `@MockBean`)

### Frontend
- [ ] Types TypeScript (`UserOpening`, `UserOpeningListItem`, `CreateOpeningRequest`, etc.)
- [ ] Service API `userOpeningService` (séparé de `publicOpeningService`)
- [ ] Hooks : `useMyOpenings`, `useCreateOpening`, `useUpdateOpening`, `useDeleteOpening`, `useValidateMoves`
- [ ] Page "Mes Ouvertures" (`/my-openings`) avec recherche, tri, pagination, état vide
- [ ] Page "Créer" (`/openings/new`) avec formulaire, validation chess.js, prévisualisation
- [ ] Page "Éditer" (`/openings/:id/edit`) avec formulaire pré-rempli
- [ ] Composants : `MyOpeningCard`, `OpeningForm`, `MovesInput`, `VisibilityBadge`, `DeleteConfirmModal`
- [ ] Routes protégées (redirection vers login si non authentifié)
- [ ] Tests composants et hooks (Vitest + Testing Library)
- [ ] Gestion des erreurs (401 → redirect login, 404 → message, 400 → affichage erreurs)

