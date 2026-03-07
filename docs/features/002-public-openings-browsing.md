# Feature : Navigation Publique des Ouvertures

> 📝 **Statut** : Implemented
> 
> 📅 **Date de création** : 2026-02-15
> 
> 👤 **Auteur** : Équipe Chess Training

## 📋 Résumé

Permettre aux visiteurs non authentifiés de consulter la bibliothèque d'ouvertures publiques en mode lecture seule. Cette feature constitue le point d'entrée principal de l'application et doit inciter les visiteurs à s'inscrire pour débloquer les fonctionnalités avancées.

## 🎯 Objectifs

- [x] Afficher une liste des ouvertures publiques accessibles à tous
- [x] Permettre la consultation détaillée d'une ouverture avec échiquier interactif
- [x] Encourager l'inscription sans bloquer l'accès au contenu public
- [x] Offrir une expérience fluide et engageante pour les visiteurs

## 👥 User Stories

### US1 : Liste des ouvertures publiques
**En tant que** visiteur anonyme,  
**je veux** voir la liste des ouvertures publiques disponibles,  
**afin de** découvrir les ouvertures classiques et décider lesquelles m'intéressent.

**Critères d'acceptation :**
- [ ] La page d'accueil affiche une liste paginée des ouvertures publiques
- [ ] Chaque ouverture affiche : nom, description courte, code ECO, nombre de coups, auteur (si utilisateur public)
- [ ] Les ouvertures sont triées par popularité ou date de création
- [ ] La pagination fonctionne (20 ouvertures par page)
- [ ] Temps de chargement < 500ms

### US2 : Consultation d'une ouverture
**En tant que** visiteur anonyme,  
**je veux** consulter le détail d'une ouverture publique avec visualisation sur échiquier,  
**afin de** comprendre les coups et la logique de l'ouverture.

**Critères d'acceptation :**
- [ ] Clic sur une ouverture mène à une page de détail
- [ ] Affichage du nom complet, description, code ECO
- [ ] Échiquier interactif montrant la position
- [ ] Navigation séquentielle dans les coups (suivant/précédent)
- [ ] Notation algébrique visible pour chaque coup
- [ ] Responsive (desktop et mobile)

### US3 : Incitation à l'inscription
**En tant que** visiteur anonyme,  
**je veux** être informé des fonctionnalités disponibles avec un compte,  
**afin de** comprendre l'intérêt de m'inscrire.

**Critères d'acceptation :**
- [ ] Banner ou call-to-action visible sur la page de détail
- [ ] Message type : "Créez un compte pour sauvegarder vos ouvertures favorites et créer les vôtres"
- [ ] Lien vers la page d'inscription
- [ ] Non intrusif (peut être fermé)

### US4 : Recherche basique
**En tant que** visiteur anonyme,  
**je veux** rechercher une ouverture par son nom,  
**afin de** trouver rapidement ce qui m'intéresse.

**Critères d'acceptation :**
- [ ] Barre de recherche en haut de la liste
- [ ] Recherche en temps réel (debounced)
- [ ] Recherche case-insensitive sur le nom de l'ouverture
- [ ] Message si aucun résultat trouvé
- [ ] Option pour réinitialiser la recherche

## 🏗️ Conception technique

### Backend

#### Entités
```
Opening
├── id: UUID
├── name: String
├── description: String
├── ecoCode: String (ex: "B90")
├── moves: String (notation algébrique, ex: "1.e4 c5 2.Nf3 d6 3.d4")
├── isPublic: Boolean
├── userId: UUID (nullable, null = opening système)
├── createdAt: Instant
└── updatedAt: Instant
```

#### Endpoints API
| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/public/openings` | Liste paginée des ouvertures publiques | ❌ |
| GET | `/api/public/openings/{id}` | Détail d'une ouverture publique | ❌ |
| GET | `/api/public/openings/search?q={query}` | Recherche d'ouvertures publiques | ❌ |

#### DTOs
```java
// Responses
OpeningListItemResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    Integer movesCount,
    String author,  // "Système" ou nom de l'utilisateur
    Instant createdAt
)

OpeningDetailResponse(
    UUID id,
    String name,
    String description,
    String ecoCode,
    String moves,  // Liste des coups en notation
    String author,
    Instant createdAt,
    Instant updatedAt
)

PageResponse<T>(
    List<T> content,
    int page,
    int size,
    long totalElements,
    int totalPages
)
```

#### Services
- `PublicOpeningService` : Logique de récupération des ouvertures publiques
- `OpeningRepository` : Repository JPA avec méthode `findByIsPublicTrue(Pageable)`

### Frontend

#### Composants
- `OpeningList` : Liste paginée avec cards d'ouvertures
  - Props: openings, pagination, onPageChange
- `OpeningCard` : Card affichant résumé d'une ouverture
  - Props: opening (name, ecoCode, description, movesCount)
- `OpeningDetail` : Page de détail avec échiquier
  - Props: opening
- `ChessboardViewer` : Composant échiquier en lecture seule
  - Props: moves, currentMove, onNextMove, onPreviousMove
- `SearchBar` : Barre de recherche avec debounce
  - Props: onSearch, placeholder

#### Routes
| Route | Composant | Description |
|-------|-----------|-------------|
| `/` | HomePage | Redirection vers /openings |
| `/openings` | OpeningsListPage | Liste des ouvertures publiques |
| `/openings/:id` | OpeningDetailPage | Détail d'une ouverture publique |

#### Hooks
- `usePublicOpenings(page, search)` : Récupère la liste paginée des ouvertures publiques
- `usePublicOpening(id)` : Récupère le détail d'une ouverture publique
- `useDebounce(value, delay)` : Debounce pour la recherche

#### Services
```typescript
// src/services/publicOpeningService.ts
export const publicOpeningService = {
  async getPublicOpenings(page = 0, size = 20, search?: string): Promise<PageResponse<OpeningListItem>>,
  async getPublicOpening(id: string): Promise<OpeningDetail>
}
```

#### Types
```typescript
// src/types/opening.ts
interface OpeningListItem {
  id: string;
  name: string;
  description: string;
  ecoCode: string;
  movesCount: number;
  author: string;
  createdAt: string;
}

interface OpeningDetail {
  id: string;
  name: string;
  description: string;
  ecoCode: string;
  moves: string;
  author: string;
  createdAt: string;
  updatedAt: string;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
```

## 🎨 Maquettes / Wireframes

### Page Liste (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ ChessOT                    [Recherche...]     [S'inscrire]  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Découvrez les Ouvertures d'Échecs                          │
│  Explorez notre bibliothèque d'ouvertures classiques        │
│                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐│
│  │ Défense Sicilienne│ │ Ruy Lopez       │  │ Gambit Roi   ││
│  │ B20-B99           │ │ C60-C99         │  │ C30-C39      ││
│  │ Une des ouvertures│ │ Ouverture       │  │ Ouverture    ││
│  │ les plus...       │ │ classique...    │  │ agressive... ││
│  │ 12 coups · Système│ │ 15 coups · Sys. │  │ 8 coups      ││
│  └─────────────────┘  └─────────────────┘  └──────────────┘│
│                                                               │
│  [< Précédent]                         [Suivant >]          │
└─────────────────────────────────────────────────────────────┘
```

### Page Détail (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ < Retour    Défense Sicilienne (B20)                        │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────┐  ┌──────────────────────────────────┐│
│ │                    │  │ Description                       ││
│ │   🨀 🩦 🨃 🩥 🩢 🨃 🩦 🨀   │  │ La Défense Sicilienne est...  ││
│ │   🨅 🨅 🨅 🨅 □ 🨅 🨅 🨅   │  │                               ││
│ │   □ □ □ □ □ □ □ □   │  │ Code ECO: B20-B99             ││
│ │   □ □ □ □ 🨅 □ □ □   │  │                               ││
│ │   □ □ □ □ ♟ □ □ □   │  │ Coups:                        ││
│ │   □ □ □ □ □ □ □ □   │  │ 1. e4 c5                      ││
│ │   ♙ ♙ ♙ ♙ □ ♙ ♙ ♙   │  │ 2. Nf3 d6                     ││
│ │   ♖ ♘ ♗ ♕ ♔ ♗ □ ♖   │  │ 3. d4 cxd4                    ││
│ └────────────────────┘  │                               ││
│ [< Précédent] [Suivant >]│                               ││
│                          │ 💡 Créez un compte pour       ││
│                          │    sauvegarder et créer vos   ││
│                          │    propres ouvertures !       ││
│                          └──────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

## 📊 Données de test

```json
{
  "systemOpenings": [
    {
      "name": "Défense Sicilienne",
      "description": "Une des ouvertures les plus populaires au plus haut niveau",
      "ecoCode": "B20",
      "moves": "1.e4 c5",
      "isPublic": true,
      "userId": null
    },
    {
      "name": "Ruy Lopez",
      "description": "Ouverture classique nommée d'après un prêtre espagnol du 16e siècle",
      "ecoCode": "C60",
      "moves": "1.e4 e5 2.Nf3 Nc6 3.Bb5",
      "isPublic": true,
      "userId": null
    },
    {
      "name": "Gambit du Roi",
      "description": "Ouverture agressive sacrifiant un pion pour le développement",
      "ecoCode": "C30",
      "moves": "1.e4 e5 2.f4",
      "isPublic": true,
      "userId": null
    }
  ]
}
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Librairie chess.js nécessaire | Élevé | Dépendance npm bien maintenue |
| Performance avec nombreuses ouvertures | Moyen | Pagination + indexation DB |
| Affichage mobile de l'échiquier | Moyen | Tests responsive approfondis |
| Dépendance à Feature 004 (échiquier) | Élevé | Développer Feature 004 en parallèle |

## 📝 Notes

- Le composant échiquier sera réutilisé dans d'autres features (003, 004)
- Prévoir l'ajout de filtres avancés dans une prochaine version (niveau, popularité)
- Considérer un système de tags/catégories pour mieux organiser les ouvertures
- Mesurer le taux de conversion visiteur → inscrit pour optimiser le CTA

## ✅ Definition of Done

- [x] Endpoint `/api/public/openings` retourne les ouvertures publiques paginées
- [x] Endpoint `/api/public/openings/{id}` retourne le détail d'une ouverture
- [x] Tests unitaires du service (>80% couverture)
- [x] Tests d'intégration des endpoints
- [x] Page liste des ouvertures responsive et fonctionnelle
- [x] Page détail avec échiquier de base (peut être simplifié si Feature 004 en cours)
- [x] Recherche fonctionnelle avec debounce
- [x] CTA d'inscription visible et non intrusif
- [ ] Tests E2E du parcours de navigation
- [x] Documentation API OpenAPI générée

