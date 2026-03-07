import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { ChessboardViewer } from '../ChessboardViewer';

describe('ChessboardViewer', () => {
  it('should display moves as individual tokens', () => {
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    expect(screen.getByText('1.e4')).toBeInTheDocument();
    expect(screen.getByText('c5')).toBeInTheDocument();
    expect(screen.getByText('2.Nf3')).toBeInTheDocument();
    expect(screen.getByText('d6')).toBeInTheDocument();
  });

  it('should display empty state for empty moves', () => {
    render(<ChessboardViewer moves="" />);

    expect(screen.getByText('Aucun coup enregistré')).toBeInTheDocument();
  });

  it('should display empty state for blank moves', () => {
    render(<ChessboardViewer moves="   " />);

    expect(screen.getByText('Aucun coup enregistré')).toBeInTheDocument();
  });

  it('should display navigation controls', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByText('⏮')).toBeInTheDocument();
    expect(screen.getByText('◀')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();
    expect(screen.getByText('⏭')).toBeInTheDocument();
  });

  it('should start at position 0', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('should advance move with next button', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    await user.click(screen.getByText('▶'));

    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('should go back with previous button', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    // Advance first
    await user.click(screen.getByText('▶'));
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    // Go back
    await user.click(screen.getByText('◀'));
    expect(screen.getByText('0 / 2')).toBeInTheDocument();
  });

  it('should jump to start', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    // Advance to the end
    await user.click(screen.getByText('⏭'));
    expect(screen.getByText('4 / 4')).toBeInTheDocument();

    // Jump to start
    await user.click(screen.getByText('⏮'));
    expect(screen.getByText('0 / 4')).toBeInTheDocument();
  });

  it('should jump to end', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5 2.Nf3 d6" />);

    await user.click(screen.getByText('⏭'));

    expect(screen.getByText('4 / 4')).toBeInTheDocument();
  });

  it('should disable previous and start buttons at position 0', () => {
    render(<ChessboardViewer moves="1.e4 c5" />);

    expect(screen.getByText('⏮')).toBeDisabled();
    expect(screen.getByText('◀')).toBeDisabled();
  });

  it('should disable next and end buttons at last position', async () => {
    const user = userEvent.setup();
    render(<ChessboardViewer moves="1.e4 c5" />);

    await user.click(screen.getByText('⏭'));

    expect(screen.getByText('▶')).toBeDisabled();
    expect(screen.getByText('⏭')).toBeDisabled();
  });
});
