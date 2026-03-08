import { useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { useChessboard } from '../../hooks/useChessboard';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { MovesList } from './MovesList';
import { ChessboardControls } from './ChessboardControls';

interface ChessboardViewerProps {
  moves: string;
  showControls?: boolean;
  showMovesList?: boolean;
  className?: string;
}

export const ChessboardViewer: React.FC<ChessboardViewerProps> = ({
  moves,
  showControls = true,
  showMovesList = true,
  className = '',
}) => {
  const {
    position,
    currentMove,
    totalMoves,
    parsedMoves,
    goToMove,
    nextMove,
    previousMove,
    firstMove,
    lastMove,
    canGoNext,
    canGoPrevious,
  } = useChessboard(moves);

  const [flipped, setFlipped] = useState(false);

  useKeyboardNavigation({ onNext: nextMove, onPrevious: previousMove, onFirst: firstMove, onLast: lastMove });

  return (
    <div className={`chessboard-viewer ${className}`} role="region" aria-label="Interactive chessboard">
      <div className="chessboard-viewer__layout">
        <div className="chessboard-viewer__board">
          <Chessboard
            options={{
              position,
              boardOrientation: flipped ? 'black' : 'white',
              allowDragging: false,
              boardStyle: {
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
              },
            }}
          />
          {showControls && (
            <div className="chessboard-viewer__controls-bar">
              <ChessboardControls
                currentMove={currentMove}
                totalMoves={totalMoves}
                onFirst={firstMove}
                onPrevious={previousMove}
                onNext={nextMove}
                onLast={lastMove}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
              />
              <button
                className="btn btn-sm btn-outline"
                onClick={() => setFlipped(!flipped)}
                title="Flip board"
                aria-label="Flip board orientation"
              >
                🔄
              </button>
            </div>
          )}
        </div>
        {showMovesList && parsedMoves.length > 0 && (
          <div className="chessboard-viewer__moves">
            <MovesList
              moves={parsedMoves}
              currentMoveIndex={currentMove}
              onMoveClick={(index) => goToMove(index + 1)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
