import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ActiveFilters } from '../components/ActiveFilters';
import { OpeningCard } from '../components/OpeningCard';
import { Pagination } from '../components/Pagination';
import { SearchFiltersBar } from '../components/SearchFiltersBar';
import { SkeletonCard } from '../components/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { usePublicOpenings } from '../hooks/usePublicOpenings';
import type { SortField, SortOption, SortOrder } from '../types/opening';
import { SORT_OPTIONS } from '../components/SortDropdown';

const DEFAULT_SORT: SortOption = SORT_OPTIONS[0];

const isValidSortField = (value: string | null): value is SortField =>
  value === 'createdAt' || value === 'updatedAt' || value === 'name';

const isValidSortOrder = (value: string | null): value is SortOrder =>
  value === 'asc' || value === 'desc';

const parseSortFromParams = (
  sortParam: string | null,
  orderParam: string | null,
): SortOption => {
  const field = isValidSortField(sortParam) ? sortParam : DEFAULT_SORT.field;
  const order = isValidSortOrder(orderParam) ? orderParam : DEFAULT_SORT.order;
  const match = SORT_OPTIONS.find((opt) => opt.field === field && opt.order === order);
  return match ?? DEFAULT_SORT;
};

export const OpeningsListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState(searchParams.get('q') ?? '');
  const [ecoCodeInput, setEcoCodeInput] = useState(searchParams.get('ecoCode') ?? '');
  const [movesInput, setMovesInput] = useState(searchParams.get('moves') ?? '');
  const [sortOption, setSortOption] = useState<SortOption>(
    parseSortFromParams(searchParams.get('sort'), searchParams.get('order')),
  );

  const debouncedSearch = useDebounce(searchInput, 300);
  const debouncedEcoCode = useDebounce(ecoCodeInput, 300);
  const debouncedMoves = useDebounce(movesInput, 300);

  // Sync debounced values to URL search params
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('q', debouncedSearch);
    if (debouncedEcoCode) params.set('ecoCode', debouncedEcoCode);
    if (debouncedMoves) params.set('moves', debouncedMoves);
    if (sortOption.field !== DEFAULT_SORT.field || sortOption.order !== DEFAULT_SORT.order) {
      params.set('sort', sortOption.field);
      params.set('order', sortOption.order);
    }
    if (currentPage > 0) params.set('page', String(currentPage));
    setSearchParams(params, { replace: true });
  }, [debouncedSearch, debouncedEcoCode, debouncedMoves, sortOption, currentPage, setSearchParams]);

  // Reset to page 0 when any debounced filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearch, debouncedEcoCode, debouncedMoves, sortOption]);

  const { openings, page, loading, error } = usePublicOpenings(
    currentPage,
    debouncedSearch || undefined,
    debouncedEcoCode || undefined,
    debouncedMoves || undefined,
    sortOption.field,
    sortOption.order,
  );

  const hasActiveTextFilters = !!(debouncedSearch || debouncedEcoCode || debouncedMoves);

  const handleRemoveFilter = useCallback((key: 'q' | 'ecoCode' | 'moves') => {
    if (key === 'q') setSearchInput('');
    if (key === 'ecoCode') setEcoCodeInput('');
    if (key === 'moves') setMovesInput('');
  }, []);

  const handleResetAll = useCallback(() => {
    setSearchInput('');
    setEcoCodeInput('');
    setMovesInput('');
    setSortOption(DEFAULT_SORT);
  }, []);

  const handleSortChange = useCallback((sort: SortOption) => {
    setSortOption(sort);
  }, []);

  return (
    <div className="page openings-page">
      <div className="openings-container">
        <header className="openings-header">
          <h1>Découvrez les Ouvertures d&apos;Échecs</h1>
          <p className="subtitle">
            Explorez notre bibliothèque d&apos;ouvertures classiques
          </p>
        </header>

        <SearchFiltersBar
          searchValue={searchInput}
          onSearchChange={setSearchInput}
          ecoCode={ecoCodeInput}
          onEcoCodeChange={setEcoCodeInput}
          movesValue={movesInput}
          onMovesChange={setMovesInput}
          sortValue={sortOption}
          onSortChange={handleSortChange}
        />

        <ActiveFilters
          filters={{
            q: debouncedSearch,
            ecoCode: debouncedEcoCode,
            moves: debouncedMoves,
          }}
          onRemoveFilter={handleRemoveFilter}
          onResetAll={handleResetAll}
        />

        {!loading && openings.length > 0 && page && (
          <p className="openings-result-count">
            {page.totalElements} résultat(s) trouvé(s)
          </p>
        )}

        {loading ? (
          <div className="openings-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="alert alert-error">
            <p>Erreur lors du chargement des ouvertures.</p>
            <p>{error.message}</p>
          </div>
        ) : openings.length === 0 ? (
          <div className="openings-empty">
            {hasActiveTextFilters ? (
              <>
                <p>Aucune ouverture trouvée pour les filtres sélectionnés.</p>
                <button
                  className="btn btn-secondary"
                  onClick={handleResetAll}
                  type="button"
                >
                  Réinitialiser les filtres
                </button>
              </>
            ) : (
              <p>Aucune ouverture disponible pour le moment.</p>
            )}
          </div>
        ) : (
          <>
            <div className="openings-grid">
              {openings.map((opening) => (
                <OpeningCard key={opening.id} opening={opening} />
              ))}
            </div>

            {page && (
              <Pagination
                currentPage={currentPage}
                totalPages={page.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        <div className="openings-cta">
          <p>Créez un compte pour sauvegarder vos ouvertures favorites et créer les vôtres !</p>
          <Link to="/register" className="btn btn-primary">
            S&apos;inscrire gratuitement
          </Link>
        </div>
      </div>
    </div>
  );
};
