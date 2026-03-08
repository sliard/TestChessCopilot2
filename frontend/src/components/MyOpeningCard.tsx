import { Link } from 'react-router-dom';
import type { UserOpeningListItem } from '../types/opening';
import { VisibilityBadge } from './VisibilityBadge';

interface MyOpeningCardProps {
  opening: UserOpeningListItem;
  onEdit: (id: string) => void;
  onDelete: (opening: UserOpeningListItem) => void;
}

export const MyOpeningCard: React.FC<MyOpeningCardProps> = ({ opening, onEdit, onDelete }) => {
  return (
    <div className="my-opening-card">
      <div className="my-opening-card__header">
        <Link to={`/openings/${opening.id}`} className="my-opening-card__name">
          {opening.name}
        </Link>
        <VisibilityBadge isPublic={opening.isPublic} />
      </div>
      <p className="my-opening-card__description">
        {opening.description ? opening.description.slice(0, 100) + (opening.description.length > 100 ? '...' : '') : ''}
      </p>
      <div className="my-opening-card__meta">
        {opening.ecoCode && <span className="my-opening-card__eco">{opening.ecoCode}</span>}
        <span className="my-opening-card__moves">{opening.movesCount} moves</span>
        <span className="my-opening-card__date">
          {new Date(opening.createdAt).toLocaleDateString()}
        </span>
      </div>
      <div className="my-opening-card__actions">
        <button className="btn btn-sm btn-outline" onClick={() => onEdit(opening.id)}>
          ✏️ Edit
        </button>
        <button className="btn btn-sm btn-danger" onClick={() => onDelete(opening)}>
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};
