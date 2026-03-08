import { useState } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useChessboard } from '@/hooks/useChessboard';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { ChessboardControls } from './ChessboardControls';
import { MovesList } from './MovesList';
import styles from './Chessboard.module.css';

interface ChessboardProps {
  moves: string;
  orientation?: 'white' | 'black';
  showControls?: boolean;
  showMovesList?: boolean;
  onMoveChange?: (moveIndex: number) => void;
  className?: string;
}

export const Chessboard: React.FC<ChessboardProps> = ({
  moves,
  orientation = 'white',
  showControls = true,
  showMovesList = true,
  onMoveChange,
  className,
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

  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>(orientation);

  useKeyboardNavigation({
    onNext: nextMove,
    onPrevious: previousMove,
    onFirst: firstMove,
    onLast: lastMove,
  });

  const handleMoveClick = (index: number) => {
    goToMove(index + 1);
    onMoveChange?.(index + 1);
  };

  const flipBoard = () => {
    setBoardOrientation((prev) => (prev === 'white' ? 'black' : 'white'));
  };

  return (
    <div className={`${styles.container} ${className || ''}`}>
      <div className={styles.boardSection}>
        <div className={styles.boardWrapper}>
          <ReactChessboard
            options={{
              position,
              boardOrientation,
              allowDragging: false,
              animationDurationInMs: 200,
              boardStyle: {
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15)',
              },
            }}
          />
        </div>
        {showControls && (
          <ChessboardControls
            currentMove={currentMove}
            totalMoves={totalMoves}
            onFirst={firstMove}
            onPrevious={previousMove}
            onNext={nextMove}
            onLast={lastMove}
            onFlip={flipBoard}
            canGoNext={canGoNext}
            canGoPrevious={canGoPrevious}
          />
        )}
      </div>
      {showMovesList && parsedMoves.length > 0 && (
        <MovesList moves={parsedMoves} currentMoveIndex={currentMove} onMoveClick={handleMoveClick} />
      )}
    </div>
  );
};
