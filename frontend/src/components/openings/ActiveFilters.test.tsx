import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ActiveFilters } from './ActiveFilters';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ActiveFilters', () => {
  const onRemoveFilter = vi.fn();
  const onResetAll = vi.fn();

  beforeEach(() => {
    onRemoveFilter.mockClear();
    onResetAll.mockClear();
  });

  it('should return null when no filters are active', () => {
    const { container } = render(
      <ActiveFilters
        filters={{}}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it('should show badge for each active filter', () => {
    render(
      <ActiveFilters
        filters={{ q: 'sicilian', ecoCode: 'B20' }}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    expect(screen.getByText(/sicilian/)).toBeInTheDocument();
    expect(screen.getByText(/B20/)).toBeInTheDocument();
  });

  it('should call onRemoveFilter with correct key when badge close is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ActiveFilters
        filters={{ ecoCode: 'B20' }}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    const removeButton = screen.getByRole('button', { name: 'filter.removeBadge' });
    await user.click(removeButton);

    expect(onRemoveFilter).toHaveBeenCalledWith('ecoCode');
  });

  it('should show reset button when filters are active', () => {
    render(
      <ActiveFilters
        filters={{ q: 'test' }}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    expect(screen.getByText('filter.reset')).toBeInTheDocument();
  });

  it('should call onResetAll when reset button is clicked', async () => {
    const user = userEvent.setup();

    render(
      <ActiveFilters
        filters={{ q: 'test' }}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    await user.click(screen.getByText('filter.reset'));

    expect(onResetAll).toHaveBeenCalledTimes(1);
  });

  it('should show total results count when provided', () => {
    render(
      <ActiveFilters
        filters={{ q: 'test' }}
        totalResults={42}
        onRemoveFilter={onRemoveFilter}
        onResetAll={onResetAll}
      />,
    );

    expect(screen.getByText('filter.results')).toBeInTheDocument();
  });
});
