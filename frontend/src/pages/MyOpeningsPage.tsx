import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMyOpenings } from '@/hooks/useMyOpenings';
import { useDeleteOpening } from '@/hooks/useDeleteOpening';
import { useDebounce } from '@/hooks/useDebounce';
import { MyOpeningCard } from '@/components/openings/MyOpeningCard';
import { DeleteConfirmModal } from '@/components/openings/DeleteConfirmModal';
import { SearchBar } from '@/components/openings/SearchBar';
import type { UserOpeningListItem } from '@/types/opening';
import styles from './MyOpeningsPage.module.css';

export const MyOpeningsPage: React.FC = () => {
  const { t } = useTranslation('openings');
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [order, setOrder] = useState('desc');
  const debouncedSearch = useDebounce(search, 300);
  const { openings, loading, error, refetch } = useMyOpenings(page, debouncedSearch, sort, order);
  const { deleteOpening, loading: deleteLoading } = useDeleteOpening();
  const [openingToDelete, setOpeningToDelete] = useState<UserOpeningListItem | null>(null);

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(0);
  };

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

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'name-asc') { setSort('name'); setOrder('asc'); }
    else if (value === 'name-desc') { setSort('name'); setOrder('desc'); }
    else if (value === 'createdAt-asc') { setSort('createdAt'); setOrder('asc'); }
    else { setSort('createdAt'); setOrder('desc'); }
    setPage(0);
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

        <div className={styles.toolbar}>
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder={t('list.searchPlaceholder', 'Rechercher...')}
          />
          <select className={styles.sortSelect} onChange={handleSortChange} value={`${sort}-${order}`}>
            <option value="createdAt-desc">{t('sort.newest', 'Plus récentes')}</option>
            <option value="createdAt-asc">{t('sort.oldest', 'Plus anciennes')}</option>
            <option value="name-asc">{t('sort.nameAsc', 'Nom A→Z')}</option>
            <option value="name-desc">{t('sort.nameDesc', 'Nom Z→A')}</option>
          </select>
        </div>

        {loading && <p className={styles.loading}>{t('actions.loading', 'Chargement...')}</p>}
        {error && <p className={styles.error}>{error.message}</p>}

        {openings && (
          <>
            {openings.content.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>♟️</span>
                <p className={styles.emptyText}>
                  {search
                    ? t('myOpenings.noResults', 'Aucun résultat pour cette recherche')
                    : t('myOpenings.empty', 'Aucune ouverture pour l\'instant')}
                </p>
                {!search && (
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
                  onClick={() => setPage((p) => p - 1)}
                >
                  ◀ {t('pagination.previous', 'Précédent')}
                </button>
                <span className={styles.pageInfo}>
                  {page + 1} / {openings.totalPages}
                </span>
                <button
                  className={styles.paginationButton}
                  disabled={page >= openings.totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
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
