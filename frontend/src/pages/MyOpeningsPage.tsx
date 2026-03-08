import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useOpeningSearch } from '@/hooks/useOpeningSearch';
import { useDeleteOpening } from '@/hooks/useDeleteOpening';
import { MyOpeningCard } from '@/components/openings/MyOpeningCard';
import { DeleteConfirmModal } from '@/components/openings/DeleteConfirmModal';
import { SearchFiltersBar } from '@/components/openings/SearchFiltersBar';
import { SORT_OPTIONS } from '@/types/search';
import type { UserOpeningListItem } from '@/types/opening';
import styles from './MyOpeningsPage.module.css';

export const MyOpeningsPage: React.FC = () => {
  const { t } = useTranslation('openings');
  const navigate = useNavigate();
  const {
    openings, loading, error, totalResults,
    query, ecoCode, moves, visibility, sort, page,
    setQuery, setEcoCode, setMoves, setVisibility, setSort, setPage,
    resetFilters, hasActiveFilters, refetch,
  } = useOpeningSearch({ mode: 'personal' });
  const { deleteOpening, loading: deleteLoading } = useDeleteOpening();
  const [openingToDelete, setOpeningToDelete] = useState<UserOpeningListItem | null>(null);

  const handleEdit = (id: string) => {
    navigate(`/openings/${id}/edit`);
  };

  const handleDeleteConfirm = async () => {
    if (!openingToDelete) return;
    const success = await deleteOpening(openingToDelete.id);
    if (success) {
      setOpeningToDelete(null);
      refetch();
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>{t('myOpenings.title', 'Mes Ouvertures')}</h1>
          <button className={styles.createButton} onClick={() => navigate('/openings/new')}>
            + {t('myOpenings.create', 'Nouvelle ouverture')}
          </button>
        </div>

        <SearchFiltersBar
          query={query}
          ecoCode={ecoCode}
          moves={moves}
          visibility={visibility}
          sort={sort}
          sortOptions={SORT_OPTIONS}
          totalResults={totalResults}
          showVisibilityFilter={true}
          hasActiveFilters={hasActiveFilters}
          onQueryChange={setQuery}
          onEcoCodeChange={setEcoCode}
          onMovesChange={setMoves}
          onVisibilityChange={setVisibility}
          onSortChange={setSort}
          onResetFilters={resetFilters}
        />

        {loading && <p className={styles.loading}>{t('actions.loading', 'Chargement...')}</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        {openings && (
          <>
            {openings.content.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>♟️</span>
                <p className={styles.emptyText}>
                  {hasActiveFilters
                    ? t('myOpenings.noResults', 'Aucun résultat pour cette recherche')
                    : t('myOpenings.empty', 'Aucune ouverture pour l\'instant')}
                </p>
                {!hasActiveFilters && (
                  <>
                    <p className={styles.emptySubtext}>
                      {t('myOpenings.emptyHint', 'Commencez à construire votre répertoire d\'ouvertures !')}
                    </p>
                    <button className={styles.createButton} onClick={() => navigate('/openings/new')}>
                      + {t('myOpenings.createFirst', 'Créer ma première ouverture')}
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className={styles.grid}>
                {openings.content.map((opening) => (
                  <MyOpeningCard
                    key={opening.id}
                    opening={opening}
                    onEdit={handleEdit}
                    onDelete={setOpeningToDelete}
                  />
                ))}
              </div>
            )}

            {openings.totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  className={styles.paginationButton}
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                >
                  ◀ {t('pagination.previous', 'Précédent')}
                </button>
                <span className={styles.pageInfo}>
                  {page + 1} / {openings.totalPages}
                </span>
                <button
                  className={styles.paginationButton}
                  disabled={page >= openings.totalPages - 1}
                  onClick={() => setPage(page + 1)}
                >
                  {t('pagination.next', 'Suivant')} ▶
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!openingToDelete}
        openingName={openingToDelete?.name ?? ''}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setOpeningToDelete(null)}
      />
    </div>
  );
};
