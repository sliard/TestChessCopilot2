import type { FC } from 'react';

interface MovesListProps {
  moves: string[];
  currentMoveIndex: number;
  onMoveClick: (index: number) => void;
}

export const MovesList: FC<MovesListProps> = ({ moves, currentMoveIndex, onMoveClick }) => {
  const pairs: { number: number; white: string; black?: string }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    pairs.push({ number: Math.floor(i / 2) + 1, white: moves[i], black: moves[i + 1] });
  }

  const moveStyle = (index: number): React.CSSProperties => ({
    padding: '2px 6px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontFamily: 'monospace',
    backgroundColor: index === currentMoveIndex ? 'var(--color-primary)' : 'transparent',
    color: index === currentMoveIndex ? 'var(--color-white)' : 'var(--color-gray-800)',
    fontWeight: index === currentMoveIndex ? 700 : 400,
  });

  return (
    <div style={{ flex: 1, minWidth: 180, maxHeight: 400, overflowY: 'auto', backgroundColor: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: 'var(--spacing-md)', border: '1px solid var(--color-gray-200)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
        <tbody>
          {pairs.map((pair) => (
            <tr key={pair.number}>
              <td style={{ padding: '2px 8px', color: 'var(--color-gray-400)', width: 30, textAlign: 'right' }}>{pair.number}.</td>
              <td style={{ padding: '2px 4px' }}>
                <span style={moveStyle((pair.number - 1) * 2)} onClick={() => onMoveClick((pair.number - 1) * 2)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onMoveClick((pair.number - 1) * 2); }}>
                  {pair.white}
                </span>
              </td>
              <td style={{ padding: '2px 4px' }}>
                {pair.black && (
                  <span style={moveStyle((pair.number - 1) * 2 + 1)} onClick={() => onMoveClick((pair.number - 1) * 2 + 1)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onMoveClick((pair.number - 1) * 2 + 1); }}>
                    {pair.black}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
