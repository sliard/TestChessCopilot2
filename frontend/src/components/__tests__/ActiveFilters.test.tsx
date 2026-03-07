import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveFilters } from '../ActiveFilters';

describe('ActiveFilters', () => {
  it('should not render when no active filters', () => {
    const { container } = render(
      <ActiveFilters filters={{}} onRemoveFilter={vi.fn()} onResetAll={vi.fn()} />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('should not render when filters are empty strings', () => {
    const { container } = render(
      <ActiveFilters
        filters={{ q: '', ecoCode: '  ', moves: '' }}
        onRemoveFilter={vi.fn()}
        onResetAll={vi.fn()}
      />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('should display badges for active filters', () => {
    render(
      <ActiveFilters
        filters={{ q: 'sicilienne', ecoCode: 'B20' }}
        onRemoveFilter={vi.fn()}
        onResetAll={vi.fn()}
      />,
    );

    expect(screen.getByText('Recherche:')).toBeInTheDocument();
    expect(screen.getByText('sicilienne')).toBeInTheDocument();
    expect(screen.getByText('ECO:')).toBeInTheDocument();
    expect(screen.getByText('B20')).toBeInTheDocument();
  });

  it('should call onRemoveFilter when clicking remove on a badge', async () => {
    const onRemoveFilter = vi.fn();
    const user = userEvent.setup();
    render(
      <ActiveFilters
        filters={{ q: 'test', ecoCode: 'C60' }}
        onRemoveFilter={onRemoveFilter}
        onResetAll={vi.fn()}
      />,
    );

    await user.click(screen.getByLabelText('Supprimer le filtre ECO'));

    expect(onRemoveFilter).toHaveBeenCalledTimes(1);
    expect(onRemoveFilter).toHaveBeenCalledWith('ecoCode');
  });

  it('should call onResetAll when clicking reset button', async () => {
    const onResetAll = vi.fn();
    const user = userEvent.setup();
    render(
      <ActiveFilters
        filters={{ q: 'test' }}
        onRemoveFilter={vi.fn()}
        onResetAll={onResetAll}
      />,
    );

    await user.click(screen.getByText('Réinitialiser'));

    expect(onResetAll).toHaveBeenCalledTimes(1);
  });

  it('should show labels for each filter type', () => {
    render(
      <ActiveFilters
        filters={{ q: 'search', ecoCode: 'A00', moves: '1.e4' }}
        onRemoveFilter={vi.fn()}
        onResetAll={vi.fn()}
      />,
    );

    expect(screen.getByText('Recherche:')).toBeInTheDocument();
    expect(screen.getByText('ECO:')).toBeInTheDocument();
    expect(screen.getByText('Coups:')).toBeInTheDocument();
  });
});
