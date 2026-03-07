interface ActiveFiltersProps {
  filters: {
    q?: string;
    ecoCode?: string;
    moves?: string;
  };
  onRemoveFilter: (key: 'q' | 'ecoCode' | 'moves') => void;
  onResetAll: () => void;
}

const FILTER_LABELS: Record<'q' | 'ecoCode' | 'moves', string> = {
  q: 'Recherche',
  ecoCode: 'ECO',
  moves: 'Coups',
};

export const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  filters,
  onRemoveFilter,
  onResetAll,
}) => {
  const activeKeys = (Object.keys(FILTER_LABELS) as Array<'q' | 'ecoCode' | 'moves'>).filter(
    (key) => filters[key]?.trim(),
  );

  if (activeKeys.length === 0) return null;

  return (
    <div className="active-filters">
      <div className="active-filters-list">
        {activeKeys.map((key) => (
          <span key={key} className="filter-badge">
            <span className="filter-badge-label">{FILTER_LABELS[key]}:</span>{' '}
            <span className="filter-badge-value">{filters[key]}</span>
            <button
              className="filter-badge-remove"
              onClick={() => onRemoveFilter(key)}
              aria-label={`Supprimer le filtre ${FILTER_LABELS[key]}`}
              type="button"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
      <button
        className="btn btn-secondary btn-sm"
        onClick={onResetAll}
        type="button"
      >
        Réinitialiser
      </button>
    </div>
  );
};
