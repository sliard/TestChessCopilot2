import { useEffect, useRef } from 'react';

interface MovesListProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

interface MovePair {
  number: number;
  white: string;
  black?: string;
}

export const MovesList: React.FC<MovesListProps> = ({ moves, currentMoveIndex, onMoveClick }) => {
  const currentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (currentRef.current && typeof currentRef.current.scrollIntoView === 'function') {
      currentRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentMoveIndex]);

  const movePairs: MovePair[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="moves-list" role="list" aria-label="Liste des coups">
      {movePairs.map((pair) => {
        const whiteIndex = (pair.number - 1) * 2 + 1;
        const blackIndex = whiteIndex + 1;

        return (
          <div key={pair.number} className="move-pair" role="listitem">
            <span className="move-number">{pair.number}.</span>
            <span
              ref={currentMoveIndex === whiteIndex ? currentRef : undefined}
              className={`move-notation ${currentMoveIndex === whiteIndex ? 'move-current' : ''} ${currentMoveIndex > whiteIndex ? 'move-played' : ''}`}
              onClick={() => onMoveClick(whiteIndex)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onMoveClick(whiteIndex)}
            >
              {pair.white}
            </span>
            {pair.black && (
              <span
                ref={currentMoveIndex === blackIndex ? currentRef : undefined}
                className={`move-notation ${currentMoveIndex === blackIndex ? 'move-current' : ''} ${currentMoveIndex > blackIndex ? 'move-played' : ''}`}
                onClick={() => onMoveClick(blackIndex)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onMoveClick(blackIndex)}
              >
                {pair.black}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};
