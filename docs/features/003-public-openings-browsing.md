# Feature 003 : Navigation Publique des Ouvertures

> 📝 **Statut** : Implemented
> 
> 📅 **Date de création** : 2026-02-15
> 
> 📅 **Dernière mise à jour** : 2026-03-08
> 
> 👤 **Auteur** : Équipe Chess Training
> 
> 🔗 **Dépendances** : [Feature 001 — Landing, Layout & i18n](001-landing-layout-i18n.md)

## 📋 Résumé

Permettre aux visiteurs non authentifiés de consulter la bibliothèque d'ouvertures publiques en mode lecture seule, via les routes `/openings` et `/openings/:id`. Cette feature s'appuie sur le layout partagé et l'i18n fournis par la Feature 001, et incite les visiteurs à s'inscrire pour débloquer les fonctionnalités avancées.

> **Note** : La landing page (`/`) et le layout partagé (header/footer) sont traités dans la [Feature 001](001-landing-layout-i18n.md).

## 🎯 Objectifs

- [x] Afficher une liste des ouvertures publiques accessibles à tous sur `/openings`
- [x] Permettre la consultation détaillée d'une ouverture avec échiquier interactif
- [x] Encourager l'inscription sans bloquer l'accès au contenu public
- [x] Offrir une expérience fluide et engageante pour les visiteurs
- [ ] Insérer 3 ouvertures publiques d'exemple en base de données (seed data via migration Flyway)

## 👥 User Stories

### US1 : Liste des ouvertures publiques
**En tant que** visiteur anonyme,  
**je veux** voir la liste des ouvertures publiques disponibles,  
**afin de** découvrir les ouvertures classiques et décider lesquelles m'intéressent.

**Critères d'acceptation :**
- [x] La page `/openings` affiche une liste paginée des ouvertures publiques
- [x] Chaque ouverture affiche : nom, description courte, code ECO, nombre de coups, auteur (si utilisateur public)
- [x] Les ouvertures sont triées par popularité ou date de création
- [x] La pagination fonctionne (20 ouvertures par page)
- [x] Temps de chargement < 500ms

### US2 : Consultation d'une ouverture
**En tant que** visiteur anonyme,  
**je veux** consulter le détail d'une ouverture publique avec visualisation sur échiquier,  
**afin de** comprendre les coups et la logique de l'ouverture.

**Critères d'acceptation :**
- [x] Clic sur une ouverture mène à une page de détail
- [x] Affichage du nom complet, description, code ECO
- [x] Échiquier interactif montrant la position
- [x] Navigation séquentielle dans les coups (suivant/précédent)
- [x] Notation algébrique visible pour chaque coup
- [x] Responsive (desktop et mobile)

### US3 : Incitation à l'inscription
**En tant que** visiteur anonyme,  
**je veux** être informé des fonctionnalités disponibles avec un compte,  
**afin de** comprendre l'intérêt de m'inscrire.

**Critères d'acceptation :**
- [x] Banner ou call-to-action visible sur la page de détail
- [x] Message type : "Créez un compte pour sauvegarder vos ouvertures favorites et créer les vôtres"
- [x] Lien vers la page d'inscription
- [x] Non intrusif (peut être fermé)

### US4 : Recherche basique
**En tant que** visiteur anonyme,  
**je veux** rechercher une ouverture par son nom,  
**afin de** trouver rapidement ce qui m'intéresse.

**Critères d'acceptation :**
- [x] Barre de recherche en haut de la liste
- [x] Recherche en temps réel (debounced)
- [x] Recherche case-insensitive sur le nom de l'ouverture
- [x] Message si aucun résultat trouvé
- [x] Option pour réinitialiser la recherche

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
| GET | `/api/v1/public/openings` | Liste paginée des ouvertures publiques | ❌ |
| GET | `/api/v1/public/openings/{id}` | Détail d'une ouverture publique | ❌ |
| GET | `/api/v1/public/openings/search?q={query}` | Recherche d'ouvertures publiques | ❌ |

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

#### Migration Flyway — Seed Data

Une migration Flyway insère 3 ouvertures publiques système (sans `user_id`) servant de données d'exemple pour que l'application ne soit pas vide au premier lancement.

```sql
-- V3__insert_sample_openings.sql

INSERT INTO opening (id, name, description, eco_code, moves, is_public, user_id, created_at, updated_at)
VALUES
  (gen_random_uuid(), 'Défense Sicilienne', 'Une des ouvertures les plus populaires au plus haut niveau. Les Noirs répondent 1...c5 pour contester le centre sans créer de symétrie.', 'B20', '1.e4 c5', true, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Ruy Lopez', 'Ouverture classique nommée d''après un prêtre espagnol du 16e siècle. Elle met la pression sur le cavalier c6 qui défend le pion e5.', 'C60', '1.e4 e5 2.Nf3 Nc6 3.Bb5', true, NULL, NOW(), NOW()),
  (gen_random_uuid(), 'Gambit du Roi', 'Ouverture agressive où les Blancs sacrifient le pion f pour ouvrir la colonne f et accélérer le développement.', 'C30', '1.e4 e5 2.f4', true, NULL, NOW(), NOW());
```

> **Convention** : Ces ouvertures sont des données système (`user_id = NULL`). Elles sont publiques et non modifiables par les utilisateurs. Le numéro de version de la migration doit suivre la dernière migration existante.

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
| `/openings` | OpeningsListPage | Liste paginée des ouvertures publiques |
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

### Page Liste `/openings` (Desktop)
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
| Dépendance à Feature 005 (échiquier) | Élevé | Développer Feature 005 en parallèle |

## 📝 Notes

- 2026-03-08 : Extraction de la landing page (`/`) vers la [Feature 001](001-landing-layout-i18n.md). Cette feature ne couvre plus que `/openings` et `/openings/:id`.
- Le composant échiquier sera réutilisé dans d'autres features (004, 005)
- Prévoir l'ajout de filtres avancés dans une prochaine version (niveau, popularité)
- Considérer un système de tags/catégories pour mieux organiser les ouvertures
- Mesurer le taux de conversion visiteur → inscrit pour optimiser le CTA

## ✅ Definition of Done

- [x] Endpoint `/api/v1/public/openings` retourne les ouvertures publiques paginées
- [x] Endpoint `/api/v1/public/openings/{id}` retourne le détail d'une ouverture
- [ ] Migration Flyway de seed data : 3 ouvertures publiques d'exemple insérées en base
- [x] Tests unitaires du service (>80% couverture)
- [x] Tests d'intégration des endpoints
- [x] Page liste des ouvertures responsive et fonctionnelle
- [x] Page détail avec échiquier de base (peut être simplifié si Feature 005 en cours)
- [x] Recherche fonctionnelle avec debounce
- [x] CTA d'inscription visible et non intrusif
- [ ] Tests E2E du parcours de navigation
- [x] Documentation API OpenAPI générée

