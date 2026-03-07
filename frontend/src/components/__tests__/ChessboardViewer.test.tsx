import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { ChessboardViewer } from '../ChessboardViewer';

vi.mock('react-chessboard', () => ({
  Chessboard: () => <div data-testid="chessboard" />,
}));

describe('ChessboardViewer', () => {
  it('should render chess board for valid moves', () => {
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    expect(screen.getByTestId('chessboard')).toBeInTheDocument();
  });

  it('should display empty state for empty moves', () => {
    render(<ChessboardViewer moves="" />);

    expect(screen.getByText('Aucun coup enregistré')).toBeInTheDocument();
  });

  it('should display empty state for blank moves', () => {
    render(<ChessboardViewer moves="   " />);

    expect(screen.getByText('Aucun coup enregistré')).toBeInTheDocument();
  });

  it('should display navigation controls with aria-labels', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByLabelText('Premier coup')).toBeInTheDocument();
    expect(screen.getByLabelText('Coup précédent')).toBeInTheDocument();
    expect(screen.getByLabelText('Coup suivant')).toBeInTheDocument();
    expect(screen.getByLabelText('Dernier coup')).toBeInTheDocument();
  });

  it('should display move counter starting at 0', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('should advance move with next button', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    await user.click(screen.getByLabelText('Coup suivant'));

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('should go back with previous button', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    await user.click(screen.getByLabelText('Coup suivant'));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Coup précédent'));
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('should jump to first position', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    await user.click(screen.getByLabelText('Dernier coup'));
    expect(screen.getByText('4 / 4')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Premier coup'));
    expect(screen.getByText('0 / 4')).toBeInTheDocument();
  });

  it('should jump to last position', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    await user.click(screen.getByLabelText('Dernier coup'));

    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('should disable previous/first buttons at position 0', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByLabelText('Premier coup')).toBeDisabled();
    expect(screen.getByLabelText('Coup précédent')).toBeDisabled();
  });

  it('should disable next/last buttons at last position', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    await user.click(screen.getByLabelText('Dernier coup'));

    expect(screen.getByLabelText('Coup suivant')).toBeDisabled();
    expect(screen.getByLabelText('Dernier coup')).toBeDisabled();
  });

  it('should display flip board button', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByText('🔄 Inverser')).toBeInTheDocument();
  });

  it('should display moves in MovesList', () => {
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    expect(screen.getByText('e4')).toBeInTheDocument();
    expect(screen.getByText('c5')).toBeInTheDocument();
    expect(screen.getByText('Nf3')).toBeInTheDocument();
    expect(screen.getByText('d6')).toBeInTheDocument();
  });

  it('should call onMoveChange when navigating', async () => {
    const user = userEvent.setup();
    const onMoveChange = vi.fn();
    render(<ChessboardViewer moves="1.e4 c5" onMoveChange={onMoveChange} />);

    expect(onMoveChange).toHaveBeenCalledWith(0);

    await user.click(screen.getByLabelText('Coup suivant'));

    expect(onMoveChange).toHaveBeenCalledWith(1);
  });
});
