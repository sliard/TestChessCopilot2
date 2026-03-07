import { useState } from 'react';

interface ChessboardViewerProps {
  moves: string;
}

export const ChessboardViewer: React.FC<ChessboardViewerProps> = ({ moves }) => {
  const parsedMoves = parseMoves(moves);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentMoveIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentMoveIndex((prev) => Math.min(parsedMoves.length, prev + 1));
  };

  return (
    <div className="chessboard-viewer">
      <div className="moves-display">
        <h4>Coups</h4>
        <div className="moves-list">
          {parsedMoves.length === 0 ? (
            <p className="moves-empty">Aucun coup enregistré</p>
          ) : (
            parsedMoves.map((move, index) => (
              <span
                key={index}
                className={`move-notation ${index < currentMoveIndex ? 'move-played' : ''} ${index === currentMoveIndex ? 'move-current' : ''}`}
              >
                {move}
              </span>
            ))
          )}
        </div>
      </div>
      {parsedMoves.length > 0 && (
        <div className="moves-controls">
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentMoveIndex(0)}
            disabled={currentMoveIndex === 0}
            type="button"
          >
            ⏮
          </button>
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentMoveIndex === 0}
            type="button"
          >
            ◀
          </button>
          <span className="moves-counter">
            {currentMoveIndex} / {parsedMoves.length}
          </span>
          <button
            className="btn btn-secondary"
            onClick={handleNext}
            disabled={currentMoveIndex >= parsedMoves.length}
            type="button"
          >
            ▶
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => setCurrentMoveIndex(parsedMoves.length)}
            disabled={currentMoveIndex >= parsedMoves.length}
            type="button"
          >
            ⏭
          </button>
        </div>
      )}
    </div>
  );
};

const parseMoves = (moves: string): string[] => {
  if (!moves || !moves.trim()) return [];
  // Split moves string like "1.e4 c5 2.Nf3 d6" into individual tokens
  return moves.trim().split(/\s+/).filter((token) => token.length > 0);
};
