import { type FC, useState } from 'react';
import { Chessboard as ReactChessboard } from 'react-chessboard';
import { useTranslation } from 'react-i18next';
import { useChessboard } from '../../hooks/useChessboard';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';
import { ChessboardControls } from './ChessboardControls';
import { MovesList } from './MovesList';

interface ChessboardComponentProps {
  moves: string;
  orientation?: 'white' | 'black';
  showControls?: boolean;
  showMovesList?: boolean;
}

export const Chessboard: FC<ChessboardComponentProps> = ({ moves, orientation: initialOrientation = 'white', showControls = true, showMovesList = true }) => {
  const { t } = useTranslation();
  const [orientation, setOrientation] = useState<'white' | 'black'>(initialOrientation);
  const board = useChessboard(moves);

  useKeyboardNavigation({
    onNext: board.nextMove,
    onPrevious: board.previousMove,
    onFirst: board.firstMove,
    onLast: board.lastMove,
  });

  const flipBoard = () => setOrientation((o) => (o === 'white' ? 'black' : 'white'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
      <div style={{ display: 'flex', gap: 'var(--spacing-lg)', flexWrap: 'wrap' }}>
        <div style={{ maxWidth: 560, width: '100%' }}>
          <ReactChessboard
            options={{
              position: board.position,
              boardOrientation: orientation,
              allowDragging: false,
              boardStyle: { borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)' },
              darkSquareStyle: { backgroundColor: '#779952' },
              lightSquareStyle: { backgroundColor: '#edeed1' },
            }}
          />
        </div>
        {showMovesList && board.parsedMoves.length > 0 && (
          <MovesList moves={board.parsedMoves} currentMoveIndex={board.currentMoveIndex} onMoveClick={board.goToMove} />
        )}
      </div>
      {showControls && (
        <ChessboardControls
          onFirst={board.firstMove}
          onPrevious={board.previousMove}
          onNext={board.nextMove}
          onLast={board.lastMove}
          onFlip={flipBoard}
          canGoPrevious={board.canGoPrevious}
          canGoNext={board.canGoNext}
          currentMove={board.currentMoveIndex + 1}
          totalMoves={board.totalMoves}
        />
      )}
      {board.totalMoves > 0 && (
        <p style={{ textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
          {t('chessboard.moveOf', { current: board.currentMoveIndex + 1, total: board.totalMoves })}
        </p>
      )}
    </div>
  );
};
