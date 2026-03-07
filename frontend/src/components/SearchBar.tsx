import { type ChangeEvent } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Rechercher une ouverture...',
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        aria-label="Rechercher"
      />
      {value && (
        <button
          className="search-clear"
          onClick={() => onChange('')}
          aria-label="Effacer la recherche"
          type="button"
        >
          ✕
        </button>
      )}
    </div>
  );
};
