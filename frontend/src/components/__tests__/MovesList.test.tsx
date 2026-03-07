import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { MovesList } from '../MovesList';

describe('MovesList', () => {
  it('should display moves grouped in pairs with numbers', () => {
    render(
      <MovesList
        moves={['e4', 'c5', 'Nf3', 'd6']}
        currentMoveIndex={0}
        onMoveClick={vi.fn()}
      />,
    );

    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('e4')).toBeInTheDocument();
    expect(screen.getByText('c5')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('Nf3')).toBeInTheDocument();
    expect(screen.getByText('d6')).toBeInTheDocument();
  });

  it('should highlight current move', () => {
    render(
      <MovesList
        moves={['e4', 'c5', 'Nf3', 'd6']}
        currentMoveIndex={1}
        onMoveClick={vi.fn()}
      />,
    );

    expect(screen.getByText('e4')).toHaveClass('move-current');
    expect(screen.getByText('c5')).not.toHaveClass('move-current');
  });

  it('should call onMoveClick when clicking a move', async () => {
    const user = userEvent.setup();
    const onMoveClick = vi.fn();
    render(
      <MovesList
        moves={['e4', 'c5', 'Nf3', 'd6']}
        currentMoveIndex={0}
        onMoveClick={onMoveClick}
      />,
    );

    await user.click(screen.getByText('e4'));
    expect(onMoveClick).toHaveBeenCalledWith(1);

    await user.click(screen.getByText('c5'));
    expect(onMoveClick).toHaveBeenCalledWith(2);

    await user.click(screen.getByText('Nf3'));
    expect(onMoveClick).toHaveBeenCalledWith(3);
  });

  it('should handle odd number of moves', () => {
    render(
      <MovesList
        moves={['e4', 'c5', 'Nf3']}
        currentMoveIndex={0}
        onMoveClick={vi.fn()}
      />,
    );

    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('e4')).toBeInTheDocument();
    expect(screen.getByText('c5')).toBeInTheDocument();
    expect(screen.getByText('2.')).toBeInTheDocument();
    expect(screen.getByText('Nf3')).toBeInTheDocument();
    // No black move in second pair
    expect(screen.queryByText('d6')).not.toBeInTheDocument();
  });

  it('should render empty list for empty moves array', () => {
    render(
      <MovesList
        moves={[]}
        currentMoveIndex={0}
        onMoveClick={vi.fn()}
      />,
    );

    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });
});
