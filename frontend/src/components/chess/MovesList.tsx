import { useRef, useEffect } from 'react';

interface MovesListProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export const MovesList: React.FC<MovesListProps> = ({ moves, currentMoveIndex, onMoveClick }) => {
  const activeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentMoveIndex]);

  const movePairs: { number: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    movePairs.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  return (
    <div className="moves-list" role="list" aria-label="Move list">
      <h4 className="moves-list__title">Moves</h4>
      <div className="moves-list__content">
        {movePairs.map((pair) => (
          <div key={pair.number} className="moves-list__pair" role="listitem">
            <span className="moves-list__number">{pair.number}.</span>
            <span
              ref={currentMoveIndex === (pair.number - 1) * 2 + 1 ? activeRef : null}
              className={`moves-list__move ${currentMoveIndex === (pair.number - 1) * 2 + 1 ? 'moves-list__move--active' : ''}`}
              onClick={() => onMoveClick((pair.number - 1) * 2)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onMoveClick((pair.number - 1) * 2)}
            >
              {pair.white}
            </span>
            {pair.black && (
              <span
                ref={currentMoveIndex === (pair.number - 1) * 2 + 2 ? activeRef : null}
                className={`moves-list__move ${currentMoveIndex === (pair.number - 1) * 2 + 2 ? 'moves-list__move--active' : ''}`}
                onClick={() => onMoveClick((pair.number - 1) * 2 + 1)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onMoveClick((pair.number - 1) * 2 + 1)}
              >
                {pair.black}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
