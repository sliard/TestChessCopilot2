import { Link } from 'react-router-dom';
import type { OpeningListItem } from '../types/opening';

interface OpeningCardProps {
  opening: OpeningListItem;
}

export const OpeningCard: React.FC<OpeningCardProps> = ({ opening }) => {
  return (
    <Link to={`/openings/${opening.id}`} className="opening-card">
      <div className="opening-card-header">
        <span className="opening-eco-badge">{opening.ecoCode}</span>
        <span className="opening-moves-count">{opening.movesCount} coups</span>
      </div>
      <h3 className="opening-card-title">{opening.name}</h3>
      <p className="opening-card-description">{opening.description}</p>
      <div className="opening-card-footer">
        <span className="opening-author">{opening.author}</span>
      </div>
    </Link>
  );
};
