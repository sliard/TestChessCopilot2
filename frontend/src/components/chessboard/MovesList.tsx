import { useRef, useEffect } from 'react';
import styles from './MovesList.module.css';

interface MovesListProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

interface MovePair {
  number: number;
  white: { move: string; index: number };
  black: { move: string; index: number } | null;
}

export const MovesList: React.FC<MovesListProps> = ({ moves, currentMoveIndex, onMoveClick }) => {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [currentMoveIndex]);

  const movePairs: MovePair[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: { move: moves[i], index: i },
      black: i + 1 < moves.length ? { move: moves[i + 1], index: i + 1 } : null,
    });
  }

  return (
    <div className={styles.movesList}>
      <h3 className={styles.title}>Moves</h3>
      <div className={styles.moves}>
        {movePairs.map((pair) => (
          <div key={pair.number} className={styles.moveRow}>
            <span className={styles.moveNumber}>{pair.number}.</span>
            <button
              ref={currentMoveIndex === pair.white.index + 1 ? activeRef : null}
              className={`${styles.move} ${currentMoveIndex === pair.white.index + 1 ? styles.active : ''}`}
              onClick={() => onMoveClick(pair.white.index)}
            >
              {pair.white.move}
            </button>
            {pair.black != null && (
              <button
                ref={currentMoveIndex === pair.black.index + 1 ? activeRef : null}
                className={`${styles.move} ${currentMoveIndex === pair.black.index + 1 ? styles.active : ''}`}
                onClick={() => onMoveClick(pair.black!.index)}
              >
                {pair.black.move}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
