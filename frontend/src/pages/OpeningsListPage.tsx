import { useState } from 'react';
import { Link } from 'react-router-dom';
import { OpeningCard } from '../components/OpeningCard';
import { Pagination } from '../components/Pagination';
import { SearchBar } from '../components/SearchBar';
import { SkeletonCard } from '../components/Skeleton';
import { useDebounce } from '../hooks/useDebounce';
import { usePublicOpenings } from '../hooks/usePublicOpenings';

export const OpeningsListPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 300);

  const { openings, page, loading, error } = usePublicOpenings(
    currentPage,
    debouncedSearch || undefined,
  );

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setCurrentPage(0);
  };

  return (
    <div className="page openings-page">
      <div className="openings-container">
        <header className="openings-header">
          <h1>Découvrez les Ouvertures d&apos;Échecs</h1>
          <p className="subtitle">
            Explorez notre bibliothèque d&apos;ouvertures classiques
          </p>
        </header>

        <SearchBar value={searchInput} onChange={handleSearch} />

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
            {debouncedSearch ? (
              <>
                <p>Aucune ouverture trouvée pour « {debouncedSearch} »</p>
                <button
                  className="btn btn-secondary"
                  onClick={() => handleSearch('')}
                  type="button"
                >
                  Réinitialiser la recherche
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
