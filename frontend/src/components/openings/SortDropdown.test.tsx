import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { SortOption } from '@/types/search';
import { SortDropdown } from './SortDropdown';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const sortOptions: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'sort.newest' },
  { field: 'createdAt', order: 'asc', label: 'sort.oldest' },
  { field: 'name', order: 'asc', label: 'sort.nameAsc' },
];

describe('SortDropdown', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should render with correct options', () => {
    render(
      <SortDropdown value={sortOptions[0]} onChange={onChange} options={sortOptions} />,
    );

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent('sort.newest');
    expect(options[1]).toHaveTextContent('sort.oldest');
    expect(options[2]).toHaveTextContent('sort.nameAsc');
  });

  it('should show current value as selected', () => {
    render(
      <SortDropdown value={sortOptions[1]} onChange={onChange} options={sortOptions} />,
    );

    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('createdAt-asc');
  });

  it('should call onChange with correct SortOption when selection changes', async () => {
    const user = userEvent.setup();

    render(
      <SortDropdown value={sortOptions[0]} onChange={onChange} options={sortOptions} />,
    );

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'name-asc');

    expect(onChange).toHaveBeenCalledWith(sortOptions[2]);
  });
});
