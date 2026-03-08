import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SortOption } from '@/types/search';
import { SearchFiltersBar } from './SearchFiltersBar';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const sortOptions: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'sort.newest' },
  { field: 'name', order: 'asc', label: 'sort.nameAsc' },
];

describe('SearchFiltersBar', () => {
  const onQueryChange = vi.fn();
  const onEcoCodeChange = vi.fn();
  const onMovesChange = vi.fn();
  const onSortChange = vi.fn();
  const onResetFilters = vi.fn();
  const onVisibilityChange = vi.fn();

  const defaultProps = {
    query: '',
    ecoCode: '',
    moves: '',
    sort: sortOptions[0],
    sortOptions,
    hasActiveFilters: false,
    onQueryChange,
    onEcoCodeChange,
    onMovesChange,
    onSortChange,
    onResetFilters,
  };

  beforeEach(() => {
    onQueryChange.mockClear();
    onEcoCodeChange.mockClear();
    onMovesChange.mockClear();
    onSortChange.mockClear();
    onResetFilters.mockClear();
    onVisibilityChange.mockClear();
  });

  it('should render search input', () => {
    render(<SearchFiltersBar {...defaultProps} />);

    expect(screen.getByPlaceholderText('list.searchPlaceholder')).toBeInTheDocument();
  });

  it('should render ECO code filter', () => {
    render(<SearchFiltersBar {...defaultProps} />);

    expect(screen.getByLabelText('filter.ecoCode')).toBeInTheDocument();
  });

  it('should render sort dropdown', () => {
    render(<SearchFiltersBar {...defaultProps} />);

    expect(screen.getByLabelText('filter.sortBy')).toBeInTheDocument();
  });

  it('should show visibility filter when showVisibilityFilter is true', () => {
    render(
      <SearchFiltersBar
        {...defaultProps}
        showVisibilityFilter
        visibility="all"
        onVisibilityChange={onVisibilityChange}
      />,
    );

    expect(screen.getByRole('radiogroup', { name: 'filter.visibilityLabel' })).toBeInTheDocument();
  });

  it('should hide visibility filter when showVisibilityFilter is false', () => {
    render(<SearchFiltersBar {...defaultProps} showVisibilityFilter={false} />);

    expect(screen.queryByRole('radiogroup', { name: 'filter.visibilityLabel' })).not.toBeInTheDocument();
  });

  it('should call onQueryChange when search input changes', async () => {
    const user = userEvent.setup();

    render(<SearchFiltersBar {...defaultProps} />);

    const searchInput = screen.getByPlaceholderText('list.searchPlaceholder');
    await user.type(searchInput, 'e4');

    expect(onQueryChange).toHaveBeenCalled();
    expect(onQueryChange).toHaveBeenCalledWith('e');
  });

  it('should call onResetFilters when reset is clicked', async () => {
    const user = userEvent.setup();

    render(
      <SearchFiltersBar
        {...defaultProps}
        query="sicilian"
        hasActiveFilters
      />,
    );

    await user.click(screen.getByText('filter.reset'));

    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });
});
