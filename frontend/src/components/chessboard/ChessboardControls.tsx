import styles from './ChessboardControls.module.css';

interface ChessboardControlsProps {
  currentMove: number;
  totalMoves: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  onFlip: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export const ChessboardControls: React.FC<ChessboardControlsProps> = ({
  currentMove,
  totalMoves,
  onFirst,
  onPrevious,
  onNext,
  onLast,
  onFlip,
  canGoNext,
  canGoPrevious,
}) => {
  return (
    <div className={styles.controls}>
      <div className={styles.navigation}>
        <button
          className={styles.navButton}
          onClick={onFirst}
          disabled={!canGoPrevious}
          aria-label="Go to first move"
        >
          ⏮
        </button>
        <button
          className={styles.navButton}
          onClick={onPrevious}
          disabled={!canGoPrevious}
          aria-label="Previous move"
        >
          ◀
        </button>
        <span className={styles.moveIndicator}>
          {currentMove} / {totalMoves}
        </span>
        <button
          className={styles.navButton}
          onClick={onNext}
          disabled={!canGoNext}
          aria-label="Next move"
        >
          ▶
        </button>
        <button
          className={styles.navButton}
          onClick={onLast}
          disabled={!canGoNext}
          aria-label="Go to last move"
        >
          ⏭
        </button>
      </div>
      <button className={styles.flipButton} onClick={onFlip} aria-label="Flip board">
        🔄
      </button>
    </div>
  );
};
