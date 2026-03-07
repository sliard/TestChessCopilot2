import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EcoCodeFilter } from '../EcoCodeFilter';

describe('EcoCodeFilter', () => {
  it('should render input with placeholder', () => {
    render(<EcoCodeFilter value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText('Code ECO (ex: B20)')).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<EcoCodeFilter value="" onChange={onChange} />);

    await user.type(screen.getByLabelText('Filtrer par code ECO'), 'B20');

    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenCalledWith('B');
    expect(onChange).toHaveBeenCalledWith('2');
    expect(onChange).toHaveBeenCalledWith('0');
  });

  it('should display current value', () => {
    render(<EcoCodeFilter value="C60" onChange={vi.fn()} />);

    expect(screen.getByLabelText('Filtrer par code ECO')).toHaveValue('C60');
  });
});
