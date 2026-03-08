interface ChessboardControlsProps {
  currentMove: number;
  totalMoves: number;
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
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
  canGoNext,
  canGoPrevious,
}) => {
  return (
    <div className="chessboard-controls" role="group" aria-label="Move navigation">
      <button
        className="btn btn-sm"
        onClick={onFirst}
        disabled={!canGoPrevious}
        aria-label="Go to first move"
        title="First move (Home)"
      >
        |◀
      </button>
      <button
        className="btn btn-sm"
        onClick={onPrevious}
        disabled={!canGoPrevious}
        aria-label="Previous move"
        title="Previous move (←)"
      >
        ◀
      </button>
      <span className="chessboard-controls__counter" aria-live="polite">
        {currentMove} / {totalMoves}
      </span>
      <button
        className="btn btn-sm"
        onClick={onNext}
        disabled={!canGoNext}
        aria-label="Next move"
        title="Next move (→)"
      >
        ▶
      </button>
      <button
        className="btn btn-sm"
        onClick={onLast}
        disabled={!canGoNext}
        aria-label="Go to last move"
        title="Last move (End)"
      >
        ▶|
      </button>
    </div>
  );
};
