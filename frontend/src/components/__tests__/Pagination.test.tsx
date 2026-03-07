import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { Pagination } from '../Pagination';

describe('Pagination', () => {
  it('should render pagination controls', () => {
    render(
      <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('← Précédent')).toBeInTheDocument();
    expect(screen.getByText('Suivant →')).toBeInTheDocument();
  });

  it('should display current page info', () => {
    render(
      <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('Page 1 sur 3')).toBeInTheDocument();
  });

  it('should disable previous button on first page', () => {
    render(
      <Pagination currentPage={0} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('← Précédent')).toBeDisabled();
  });

  it('should disable next button on last page', () => {
    render(
      <Pagination currentPage={2} totalPages={3} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('Suivant →')).toBeDisabled();
  });

  it('should call onPageChange with next page when clicking next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={0} totalPages={3} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByText('Suivant →'));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange with previous page when clicking previous', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />,
    );

    await user.click(screen.getByText('← Précédent'));

    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(0);
  });

  it('should not render when totalPages is 1', () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={1} onPageChange={vi.fn()} />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('should not render when totalPages is 0', () => {
    const { container } = render(
      <Pagination currentPage={0} totalPages={0} onPageChange={vi.fn()} />,
    );

    expect(container.innerHTML).toBe('');
  });
});
