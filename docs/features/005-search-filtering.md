# Feature : Recherche et Filtrage des Ouvertures

> 📝 **Statut** : Ready
> 
> 📅 **Date de création** : 2026-02-15
> 
> 👤 **Auteur** : Équipe Chess Training

## 📋 Résumé

Permettre aux utilisateurs de rechercher et filtrer les ouvertures par différents critères (nom, code ECO, premiers coups, visibilité). Cette feature améliore la découvrabilité et la navigation dans la bibliothèque d'ouvertures.

## 🎯 Objectifs

- [ ] Recherche textuelle rapide par nom d'ouverture
- [ ] Filtrage par code ECO
- [ ] Recherche par premiers coups
- [ ] Filtrage par visibilité (public/privé pour utilisateurs authentifiés)
- [ ] Tri des résultats (date, nom, popularité)
- [ ] Performance optimale avec grandes quantités d'ouvertures

## 👥 User Stories

### US1 : Recherche par nom
**En tant que** utilisateur,  
**je veux** rechercher une ouverture par son nom,  
**afin de** trouver rapidement ce que je cherche.

**Critères d'acceptation :**
- [ ] Barre de recherche visible sur les pages de liste
- [ ] Recherche en temps réel (debounced 300ms)
- [ ] Recherche case-insensitive
- [ ] Recherche partielle (ex: "sicil" trouve "Sicilienne")
- [ ] Affichage du nombre de résultats
- [ ] Message si aucun résultat

### US2 : Filtrage par code ECO
**En tant que** joueur expérimenté,  
**je veux** filtrer les ouvertures par code ECO,  
**afin de** explorer une famille d'ouvertures spécifique.

**Critères d'acceptation :**
- [ ] Dropdown ou input pour saisir le code ECO
- [ ] Support des codes partiels (ex: "B" → toutes les ouvertures B20-B99)
- [ ] Autocomplétion des codes ECO courants
- [ ] Combinable avec la recherche textuelle
- [ ] Réinitialisation facile du filtre

### US3 : Recherche par premiers coups
**En tant que** utilisateur,  
**je veux** rechercher par les premiers coups (ex: "1.e4 c5"),  
**afin de** trouver les ouvertures commençant par ces coups.

**Critères d'acceptation :**
- [ ] Input pour saisir les coups en notation algébrique
- [ ] Validation des coups saisis
- [ ] Recherche des ouvertures contenant ces coups au début
- [ ] Résultats triés par pertinence
- [ ] Aide/tooltip pour le format attendu

### US4 : Filtrage par visibilité (authentifiés uniquement)
**En tant que** utilisateur authentifié,  
**je veux** filtrer mes ouvertures par visibilité (public/privé/toutes),  
**afin de** organiser mon travail.

**Critères d'acceptation :**
- [ ] Toggle ou radio buttons : Toutes / Publiques / Privées
- [ ] Visible uniquement sur la page "Mes Ouvertures"
- [ ] Par défaut : "Toutes" sélectionné
- [ ] Compte des ouvertures par catégorie
- [ ] État sauvegardé dans la session

### US5 : Tri des résultats
**En tant que** utilisateur,  
**je veux** trier les résultats par différents critères,  
**afin de** organiser l'affichage selon mes préférences.

**Critères d'acceptation :**
- [ ] Dropdown de tri avec options :
  - Date de création (récent → ancien)
  - Date de modification (récent → ancien)
  - Nom (A → Z)
  - Popularité (si disponible)
- [ ] Ordre ascendant/descendant
- [ ] État sauvegardé pendant la session
- [ ] Tri appliqué après recherche/filtres

### US6 : Réinitialisation des filtres
**En tant que** utilisateur,  
**je veux** réinitialiser tous les filtres d'un clic,  
**afin de** revenir rapidement à la vue complète.

**Critères d'acceptation :**
- [ ] Bouton "Réinitialiser" visible quand des filtres sont actifs
- [ ] Efface tous les filtres (recherche, ECO, coups, visibilité)
- [ ] Retour aux valeurs par défaut
- [ ] Feedback visuel (animation ou message)

## 🏗️ Conception technique

### Backend

#### Endpoints API

| Méthode | Endpoint | Description | Auth |
|---------|----------|-------------|------|
| GET | `/api/public/openings/search` | Recherche avancée publique | ❌ |
| GET | `/api/openings/search` | Recherche avancée personnelle | ✅ |

**Query Parameters :**
```
?q=sicilienne              // Recherche textuelle
&ecoCode=B20               // Filtrage par code ECO
&moves=1.e4 c5             // Recherche par premiers coups
&visibility=private        // Filtrage visibilité (authentifiés)
&sort=createdAt            // Tri (createdAt, updatedAt, name)
&order=desc                // Ordre (asc, desc)
&page=0                    // Pagination
&size=20
```

#### Services

##### `OpeningSearchService`
```java
@Service
public class OpeningSearchService {
    
    public Page<OpeningResponse> searchPublicOpenings(
        String query,
        String ecoCode,
        String moves,
        String sortBy,
        String order,
        Pageable pageable
    );
    
    public Page<OpeningResponse> searchUserOpenings(
        UUID userId,
        String query,
        String ecoCode,
        String moves,
        String visibility,  // "all", "public", "private"
        String sortBy,
        String order,
        Pageable pageable
    );
}
```

#### Repositories

##### `OpeningRepository` (étendu)
```java
public interface OpeningRepository extends JpaRepository<Opening, UUID> {
    
    // Recherche publique
    @Query("SELECT o FROM Opening o WHERE o.isPublic = true " +
           "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:ecoCode IS NULL OR o.ecoCode LIKE CONCAT(:ecoCode, '%')) " +
           "AND (:moves IS NULL OR o.moves LIKE CONCAT(:moves, '%'))")
    Page<Opening> searchPublicOpenings(
        @Param("query") String query,
        @Param("ecoCode") String ecoCode,
        @Param("moves") String moves,
        Pageable pageable
    );
    
    // Recherche personnelle
    @Query("SELECT o FROM Opening o WHERE o.userId = :userId " +
           "AND (:query IS NULL OR LOWER(o.name) LIKE LOWER(CONCAT('%', :query, '%'))) " +
           "AND (:ecoCode IS NULL OR o.ecoCode LIKE CONCAT(:ecoCode, '%')) " +
           "AND (:moves IS NULL OR o.moves LIKE CONCAT(:moves, '%')) " +
           "AND (:isPublic IS NULL OR o.isPublic = :isPublic)")
    Page<Opening> searchUserOpenings(
        @Param("userId") UUID userId,
        @Param("query") String query,
        @Param("ecoCode") String ecoCode,
        @Param("moves") String moves,
        @Param("isPublic") Boolean isPublic,
        Pageable pageable
    );
}
```

#### Optimisations

##### Indexation PostgreSQL
```sql
-- Index pour recherche textuelle
CREATE INDEX idx_opening_name ON openings USING gin(to_tsvector('french', name));

-- Index pour codes ECO
CREATE INDEX idx_opening_eco_code ON openings(eco_code);

-- Index pour recherche par coups
CREATE INDEX idx_opening_moves_prefix ON openings(moves varchar_pattern_ops);

-- Index composite pour utilisateur + visibilité
CREATE INDEX idx_opening_user_public ON openings(user_id, is_public);
```

### Frontend

#### Composants

##### `SearchFiltersBar`
Barre de recherche et filtres.

**Props :**
```typescript
interface SearchFiltersBarProps {
  onSearchChange: (query: string) => void;
  onEcoCodeChange: (ecoCode: string) => void;
  onMovesChange: (moves: string) => void;
  onVisibilityChange?: (visibility: 'all' | 'public' | 'private') => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  showVisibilityFilter?: boolean;  // Uniquement pour authentifiés
}
```

##### `SearchInput`
Input de recherche avec debounce.

**Props :**
```typescript
interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  debounceMs?: number;  // default: 300
}
```

##### `EcoCodeFilter`
Filtre par code ECO avec autocomplétion.

**Props :**
```typescript
interface EcoCodeFilterProps {
  value: string;
  onChange: (ecoCode: string) => void;
  suggestions: string[];  // ['A00-A99', 'B00-B99', ...]
}
```

##### `SortDropdown`
Dropdown de tri.

**Props :**
```typescript
interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
  options: SortOption[];
}

type SortOption = {
  value: string;  // 'createdAt', 'updatedAt', 'name'
  label: string;  // 'Plus récent', 'Nom A-Z'
  order: 'asc' | 'desc';
};
```

##### `ActiveFilters`
Affichage des filtres actifs (badges).

**Props :**
```typescript
interface ActiveFiltersProps {
  filters: {
    search?: string;
    ecoCode?: string;
    moves?: string;
    visibility?: string;
  };
  onRemoveFilter: (filterKey: string) => void;
  onResetAll: () => void;
}
```

#### Hooks

##### `useOpeningSearch(options)`
Hook pour la recherche avec tous les critères.

```typescript
interface UseOpeningSearchOptions {
  mode: 'public' | 'personal';
  initialQuery?: string;
  initialEcoCode?: string;
  initialMoves?: string;
  initialVisibility?: 'all' | 'public' | 'private';
  initialSort?: SortOption;
}

interface UseOpeningSearchReturn {
  openings: Opening[];
  loading: boolean;
  error: Error | null;
  totalResults: number;
  filters: SearchFilters;
  setQuery: (query: string) => void;
  setEcoCode: (ecoCode: string) => void;
  setMoves: (moves: string) => void;
  setVisibility: (visibility: string) => void;
  setSort: (sort: SortOption) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
}
```

##### `useDebounce(value, delay)`
Hook de debounce réutilisable.

```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

#### Services

##### `searchService.ts`
```typescript
export const searchService = {
  async searchPublicOpenings(
    query?: string,
    ecoCode?: string,
    moves?: string,
    sort?: string,
    order?: string,
    page = 0,
    size = 20
  ): Promise<PageResponse<Opening>>,
  
  async searchMyOpenings(
    query?: string,
    ecoCode?: string,
    moves?: string,
    visibility?: string,
    sort?: string,
    order?: string,
    page = 0,
    size = 20
  ): Promise<PageResponse<Opening>>
};
```

#### State Management

Utiliser l'URL pour persister les filtres (avec React Router) :

```typescript
// Exemple avec useSearchParams
const [searchParams, setSearchParams] = useSearchParams();

const query = searchParams.get('q') || '';
const ecoCode = searchParams.get('eco') || '';
const moves = searchParams.get('moves') || '';

const updateFilters = (newFilters: Partial<SearchFilters>) => {
  const params = new URLSearchParams(searchParams);
  
  Object.entries(newFilters).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  
  setSearchParams(params);
};
```

## 🎨 Maquettes / Wireframes

### Barre de Recherche et Filtres (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ [🔍 Rechercher une ouverture...]                        │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                               │
│ Code ECO: [Tous ▼]  Débute par: [____]  Tri: [Récent ▼]    │
│                                                               │
│ Filtres actifs: [sicilienne ×] [B20 ×]      [Réinitialiser] │
│                                                               │
│ 42 résultats trouvés                                         │
└─────────────────────────────────────────────────────────────┘
```

### Filtres Mobiles (Collapsed)
```
┌─────────────────────────┐
│ [🔍 Rechercher...]      │
│                         │
│ [🔽 Filtres avancés]    │
│                         │
│ 42 résultats            │
└─────────────────────────┘
```

### Filtres Mobiles (Expanded)
```
┌─────────────────────────┐
│ [🔍 Rechercher...]      │
│                         │
│ [🔼 Masquer filtres]    │
│                         │
│ Code ECO                │
│ [Tous ▼]                │
│                         │
│ Débute par              │
│ [_____________]         │
│                         │
│ Tri                     │
│ [Plus récent ▼]        │
│                         │
│ [Appliquer]             │
│                         │
│ 42 résultats            │
└─────────────────────────┘
```

## 📊 Données de test

```json
{
  "searchScenarios": [
    {
      "description": "Recherche simple",
      "query": "sicilienne",
      "expectedResults": ["Défense Sicilienne", "Sicilienne Najdorf", "Sicilienne Dragon"]
    },
    {
      "description": "Filtre ECO",
      "ecoCode": "B2",
      "expectedResults": ["Toutes ouvertures B20-B29"]
    },
    {
      "description": "Recherche par coups",
      "moves": "1.e4 c5",
      "expectedResults": ["Toutes variantes de la Défense Sicilienne"]
    },
    {
      "description": "Combinaison recherche + ECO",
      "query": "najdorf",
      "ecoCode": "B90",
      "expectedResults": ["Sicilienne Najdorf B90-B99"]
    }
  ]
}
```

## ⚠️ Risques et dépendances

| Risque / Dépendance | Impact | Mitigation |
|---------------------|--------|------------|
| Performance avec recherche textuelle | Moyen | Index PostgreSQL + pagination |
| Complexité UI sur mobile | Moyen | Filtres collapsibles |
| Validation des coups recherchés | Faible | Utiliser chess.js pour valider |
| Trop de requêtes API (debounce) | Moyen | Debounce 300ms + cache |

## 📝 Notes

- Considérer l'ajout de filtres sauvegardés (presets) en V1.1
- Prévoir l'ajout de suggestions de recherche basées sur l'historique
- Envisager un système de tags/catégories pour améliorer la découvrabilité
- Mesurer les requêtes de recherche pour optimiser les suggestions

## ✅ Definition of Done

- [ ] Endpoint de recherche publique implémenté
- [ ] Endpoint de recherche personnelle implémenté
- [ ] Index PostgreSQL créés pour performance
- [ ] Tests unitaires des services de recherche (>80%)
- [ ] Tests d'intégration des endpoints
- [ ] Composant SearchFiltersBar fonctionnel
- [ ] Debounce implémenté sur recherche textuelle
- [ ] Filtres combinables (recherche + ECO + coups)
- [ ] Tri des résultats opérationnel
- [ ] Réinitialisation des filtres fonctionnelle
- [ ] Responsive (desktop et mobile)
- [ ] Persistence des filtres dans l'URL
- [ ] Tests E2E des scénarios de recherche
- [ ] Documentation API OpenAPI

