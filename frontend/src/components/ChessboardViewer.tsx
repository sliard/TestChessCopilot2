import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessboard } from '../hooks/useChessboard';
import { useKeyboardNavigation } from '../hooks/useKeyboardNavigation';
import { MovesList } from './MovesList';

interface ChessboardViewerProps {
  moves: string;
  orientation?: 'white' | 'black';
  showCoordinates?: boolean;
  showControls?: boolean;
  onMoveChange?: (moveIndex: number) => void;
  className?: string;
}

export const ChessboardViewer: React.FC<ChessboardViewerProps> = ({
  moves,
  orientation = 'white',
  showCoordinates = true,
  showControls = true,
  onMoveChange,
  className,
}) => {
  const chess = useChessboard(moves);
  const [flipped, setFlipped] = useState(orientation === 'black');

  useKeyboardNavigation({
    onNext: chess.nextMove,
    onPrevious: chess.previousMove,
    onFirst: chess.firstMove,
    onLast: chess.lastMove,
  });

  useEffect(() => {
    onMoveChange?.(chess.currentMove);
  }, [chess.currentMove, onMoveChange]);

  useEffect(() => {
    setFlipped(orientation === 'black');
  }, [orientation]);

  return (
    <div className={`chessboard-viewer ${className ?? ''}`} aria-label="Visualiseur d'échiquier">
      <div className="chessboard-viewer-board">
        <Chessboard
          options={{
            position: chess.position,
            boardOrientation: flipped ? 'black' : 'white',
            allowDragging: false,
            showNotation: showCoordinates,
          }}
        />
      </div>

      {chess.parsedMoves.length > 0 && (
        <div className="chessboard-viewer-sidebar">
          <MovesList
            moves={chess.parsedMoves}
            currentMoveIndex={chess.currentMove}
            onMoveClick={chess.goToMove}
          />

          {showControls && (
            <div className="chessboard-viewer-controls">
              <button
                className="btn btn-secondary"
                onClick={chess.firstMove}
                disabled={!chess.canGoPrevious}
                aria-label="Premier coup"
                type="button"
              >
                ⏮
              </button>
              <button
                className="btn btn-secondary"
                onClick={chess.previousMove}
                disabled={!chess.canGoPrevious}
                aria-label="Coup précédent"
                type="button"
              >
                ◀
              </button>
              <span className="moves-counter">
                {chess.currentMove} / {chess.totalMoves}
              </span>
              <button
                className="btn btn-secondary"
                onClick={chess.nextMove}
                disabled={!chess.canGoNext}
                aria-label="Coup suivant"
                type="button"
              >
                ▶
              </button>
              <button
                className="btn btn-secondary"
                onClick={chess.lastMove}
                disabled={!chess.canGoNext}
                aria-label="Dernier coup"
                type="button"
              >
                ⏭
              </button>
            </div>
          )}

          <button
            className="btn btn-secondary flip-btn"
            onClick={() => setFlipped((f) => !f)}
            type="button"
          >
            🔄 Inverser
          </button>
        </div>
      )}

      {chess.parsedMoves.length === 0 && <p className="moves-empty">Aucun coup enregistré</p>}
    </div>
  );
};
