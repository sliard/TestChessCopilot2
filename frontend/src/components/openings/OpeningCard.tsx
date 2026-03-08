import { Link } from 'react-router-dom';
import type { OpeningListItem } from '@/types/opening';
import styles from './OpeningCard.module.css';

interface OpeningCardProps {
  opening: OpeningListItem;
}

export const OpeningCard: React.FC<OpeningCardProps> = ({ opening }) => {
  return (
    <Link to={`/openings/${opening.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.name}>{opening.name}</h3>
        {opening.ecoCode && <span className={styles.eco}>{opening.ecoCode}</span>}
      </div>
      <p className={styles.description}>{opening.description}</p>
      <div className={styles.footer}>
        <span className={styles.movesCount}>{opening.movesCount} coups</span>
        <span className={styles.author}>{opening.author}</span>
      </div>
    </Link>
  );
};
