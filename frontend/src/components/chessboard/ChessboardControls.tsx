import type { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ChessboardControlsProps {
  onFirst: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onLast: () => void;
  onFlip: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  currentMove: number;
  totalMoves: number;
}

export const ChessboardControls: FC<ChessboardControlsProps> = ({ onFirst, onPrevious, onNext, onLast, onFlip, canGoPrevious, canGoNext }) => {
  const { t } = useTranslation();
  const btnStyle = { padding: '0.5rem 1rem', fontSize: '1.2rem', background: 'var(--color-white)', border: '2px solid var(--color-gray-200)', borderRadius: 'var(--radius-md)', cursor: 'pointer' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
      <button style={btnStyle} onClick={onFirst} disabled={!canGoPrevious} title={t('chessboard.first')} aria-label={t('chessboard.first')}>⏮</button>
      <button style={btnStyle} onClick={onPrevious} disabled={!canGoPrevious} title={t('chessboard.previous')} aria-label={t('chessboard.previous')}>◀</button>
      <button style={btnStyle} onClick={onNext} disabled={!canGoNext} title={t('chessboard.next')} aria-label={t('chessboard.next')}>▶</button>
      <button style={btnStyle} onClick={onLast} disabled={!canGoNext} title={t('chessboard.last')} aria-label={t('chessboard.last')}>⏭</button>
      <button style={{ ...btnStyle, marginLeft: 'var(--spacing-md)' }} onClick={onFlip} title={t('chessboard.flipBoard')} aria-label={t('chessboard.flipBoard')}>🔄</button>
    </div>
  );
};
