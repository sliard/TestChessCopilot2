import { type ChangeEvent } from 'react';
import type { SortOption } from '../types/opening';

interface SortDropdownProps {
  value: SortOption;
  onChange: (sort: SortOption) => void;
}

export const SORT_OPTIONS: SortOption[] = [
  { field: 'createdAt', order: 'desc', label: 'Plus récent' },
  { field: 'createdAt', order: 'asc', label: 'Plus ancien' },
  { field: 'updatedAt', order: 'desc', label: 'Dernière modification' },
  { field: 'name', order: 'asc', label: 'Nom A → Z' },
  { field: 'name', order: 'desc', label: 'Nom Z → A' },
];

const toSelectValue = (option: SortOption): string =>
  `${option.field}-${option.order}`;

export const SortDropdown: React.FC<SortDropdownProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = SORT_OPTIONS.find(
      (opt) => toSelectValue(opt) === e.target.value,
    );
    if (selected) {
      onChange(selected);
    }
  };

  return (
    <div className="sort-dropdown">
      <select
        className="filter-select"
        value={toSelectValue(value)}
        onChange={handleChange}
        aria-label="Trier par"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={toSelectValue(option)} value={toSelectValue(option)}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
