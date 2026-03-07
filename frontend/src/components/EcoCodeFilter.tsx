import { type ChangeEvent } from 'react';

interface EcoCodeFilterProps {
  value: string;
  onChange: (ecoCode: string) => void;
}

export const EcoCodeFilter: React.FC<EcoCodeFilterProps> = ({
  value,
  onChange,
}) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="eco-code-filter">
      <input
        type="text"
        className="filter-input"
        value={value}
        onChange={handleChange}
        placeholder="Code ECO (ex: B20)"
        maxLength={10}
        aria-label="Filtrer par code ECO"
      />
    </div>
  );
};
