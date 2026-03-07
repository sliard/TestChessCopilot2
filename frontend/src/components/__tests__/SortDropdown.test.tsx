import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortDropdown, SORT_OPTIONS } from '../SortDropdown';

describe('SortDropdown', () => {
  const defaultSort = SORT_OPTIONS[0]; // Plus récent

  it('should render select with sort options', () => {
    render(<SortDropdown value={defaultSort} onChange={vi.fn()} />);

    const select = screen.getByLabelText('Trier par');
    expect(select).toBeInTheDocument();

    for (const option of SORT_OPTIONS) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it('should call onChange when selecting an option', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SortDropdown value={defaultSort} onChange={onChange} />);

    await user.selectOptions(screen.getByLabelText('Trier par'), 'name-asc');

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ field: 'name', order: 'asc', label: 'Nom A → Z' }),
    );
  });

  it('should show current selection', () => {
    const nameSort = SORT_OPTIONS.find((o) => o.field === 'name' && o.order === 'asc')!;
    render(<SortDropdown value={nameSort} onChange={vi.fn()} />);

    const select = screen.getByLabelText('Trier par') as HTMLSelectElement;
    expect(select.value).toBe('name-asc');
  });
});
