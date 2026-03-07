interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >
        ← Précédent
      </button>
      <span className="pagination-info">
        Page {currentPage + 1} sur {totalPages}
      </span>
      <button
        className="btn btn-secondary"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >
        Suivant →
      </button>
    </div>
  );
};
