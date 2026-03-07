import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('should render with placeholder', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Rechercher une ouverture...')).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar value="" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'test');
    expect(onChange).toHaveBeenCalled();
  });

  it('should show clear button when value is not empty', () => {
    render(<SearchBar value="test" onChange={vi.fn()} />);
    expect(screen.getByLabelText('Effacer la recherche')).toBeInTheDocument();
  });

  it('should not show clear button when value is empty', () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText('Effacer la recherche')).not.toBeInTheDocument();
  });

  it('should call onChange with empty string when clearing', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<SearchBar value="test" onChange={onChange} />);

    await user.click(screen.getByLabelText('Effacer la recherche'));
    expect(onChange).toHaveBeenCalledWith('');
  });
});
