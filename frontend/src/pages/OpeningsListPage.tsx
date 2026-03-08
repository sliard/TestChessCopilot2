import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { usePublicOpenings } from '../hooks/usePublicOpenings';
import { OpeningCard } from '../components/OpeningCard';
import { SearchFiltersBar } from '../components/SearchFiltersBar';
import { SkeletonCard } from '../components/Skeleton';

export const OpeningsListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState<{
    q?: string;
    ecoCode?: string;
    sort?: string;
    order?: string;
  }>({});

  const { openings, pageData, loading, error } = usePublicOpenings({
    page,
    size: 20,
    ...filters,
  });

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
    setPage(0);
  }, []);

  return (
    <div className="page openings-list-page">
      <div className="page__header">
        <h1>Chess Openings</h1>
        <p className="page__subtitle">Explore our library of classic chess openings</p>
      </div>

      <SearchFiltersBar onFiltersChange={handleFiltersChange} />

      {error && (
        <div className="alert alert-error">
          Failed to load openings. Please try again.
        </div>
      )}

      {loading ? (
        <div className="openings-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : openings.length === 0 ? (
        <div className="empty-state">
          <p>No openings found.</p>
          {filters.q && <p>Try adjusting your search criteria.</p>}
        </div>
      ) : (
        <>
          <div className="openings-grid">
            {openings.map((opening) => (
              <OpeningCard key={opening.id} opening={opening} />
            ))}
          </div>

          {pageData && pageData.totalPages > 1 && (
            <div className="pagination">
              <button
                className="btn btn-outline"
                onClick={() => setPage(p => p - 1)}
                disabled={pageData.first}
              >
                ← Previous
              </button>
              <span className="pagination__info">
                Page {pageData.page + 1} of {pageData.totalPages}
              </span>
              <button
                className="btn btn-outline"
                onClick={() => setPage(p => p + 1)}
                disabled={pageData.last}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      <div className="cta-banner">
        <p>Create an account to save your favorite openings and create your own!</p>
        <Link to="/register" className="btn btn-primary">Sign Up Free</Link>
      </div>
    </div>
  );
};
