import { Link } from 'react-router-dom';
import type { OpeningListItem } from '../types/opening';

interface OpeningCardProps {
  opening: OpeningListItem;
}

export const OpeningCard: React.FC<OpeningCardProps> = ({ opening }) => {
  return (
    <Link to={`/openings/${opening.id}`} className="opening-card" aria-label={`View ${opening.name}`}>
      <div className="opening-card__header">
        <h3 className="opening-card__name">{opening.name}</h3>
        {opening.ecoCode && <span className="opening-card__eco">{opening.ecoCode}</span>}
      </div>
      <p className="opening-card__description">
        {opening.description ? opening.description.slice(0, 120) + (opening.description.length > 120 ? '...' : '') : ''}
      </p>
      <div className="opening-card__footer">
        <span className="opening-card__moves">{opening.movesCount} moves</span>
        <span className="opening-card__author">{opening.author}</span>
      </div>
    </Link>
  );
};
