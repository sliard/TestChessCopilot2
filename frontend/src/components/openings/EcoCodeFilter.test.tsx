import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EcoCodeFilter } from './EcoCodeFilter';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('EcoCodeFilter', () => {
  const onChange = vi.fn();

  beforeEach(() => {
    onChange.mockClear();
  });

  it('should render input with placeholder', () => {
    render(<EcoCodeFilter value="" onChange={onChange} />);

    expect(screen.getByPlaceholderText('filter.ecoCodePlaceholder')).toBeInTheDocument();
  });

  it('should call onChange when user types', async () => {
    const user = userEvent.setup();

    render(<EcoCodeFilter value="" onChange={onChange} />);

    const input = screen.getByLabelText('filter.ecoCode');
    await user.type(input, 'B');

    expect(onChange).toHaveBeenCalledWith('B');
  });

  it('should show clear button when value is not empty', () => {
    render(<EcoCodeFilter value="B20" onChange={onChange} />);

    expect(screen.getByLabelText('filter.clearEcoCode')).toBeInTheDocument();
  });

  it('should call onChange with empty string when clear is clicked', async () => {
    const user = userEvent.setup();

    render(<EcoCodeFilter value="B20" onChange={onChange} />);

    await user.click(screen.getByLabelText('filter.clearEcoCode'));

    expect(onChange).toHaveBeenCalledWith('');
  });

  it('should not show clear button when value is empty', () => {
    render(<EcoCodeFilter value="" onChange={onChange} />);

    expect(screen.queryByLabelText('filter.clearEcoCode')).not.toBeInTheDocument();
  });
});
