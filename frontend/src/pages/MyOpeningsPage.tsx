import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMyOpenings } from '../hooks/useMyOpenings';
import { MyOpeningCard } from '../components/MyOpeningCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { SearchBar } from '../components/SearchBar';
import { SkeletonCard } from '../components/Skeleton';
import { userOpeningService } from '../services/userOpeningService';
import type { UserOpeningListItem } from '../types/opening';

export const MyOpeningsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<UserOpeningListItem | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { openings, pageData, loading, error, refetch } = useMyOpenings({
    page,
    size: 20,
    q: search || undefined,
    sort: 'createdAt',
    order: 'desc',
  });

  const handleSearch = useCallback((q: string) => {
    setSearch(q);
    setPage(0);
  }, []);

  const handleEdit = useCallback((id: string) => {
    navigate(`/openings/${id}/edit`);
  }, [navigate]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      await userOpeningService.deleteOpening(deleteTarget.id);
      setDeleteTarget(null);
      refetch();
    } catch {
      // Error handled by ApiErrorNotifier
    } finally {
      setDeleteLoading(false);
    }
  }, [deleteTarget, refetch]);

  return (
    <div className="page my-openings-page">
      <div className="page__header">
        <h1>My Openings</h1>
        <Link to="/openings/new" className="btn btn-primary">+ New Opening</Link>
      </div>

      <SearchBar onSearch={handleSearch} placeholder="Search my openings..." />

      {error && (
        <div className="alert alert-error">
          Failed to load your openings. Please try again.
        </div>
      )}

      {loading ? (
        <div className="openings-list">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : openings.length === 0 ? (
        <div className="empty-state">
          <p>♟️ No openings yet</p>
          <p>Start building your opening repertoire!</p>
          <Link to="/openings/new" className="btn btn-primary">+ Create my first opening</Link>
        </div>
      ) : (
        <>
          <div className="openings-list">
            {openings.map((opening) => (
              <MyOpeningCard
                key={opening.id}
                opening={opening}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
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

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        openingName={deleteTarget?.name ?? ''}
        onConfirm={handleDelete}
        onCancel={() => !deleteLoading && setDeleteTarget(null)}
      />
    </div>
  );
};
