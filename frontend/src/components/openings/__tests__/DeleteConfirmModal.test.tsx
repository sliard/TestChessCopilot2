import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

describe('DeleteConfirmModal', () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    onConfirm.mockClear();
    onCancel.mockClear();
  });

  it('should not render anything when isOpen is false', () => {
    const { container } = renderWithProviders(
      <DeleteConfirmModal isOpen={false} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    expect(container.innerHTML).toBe('');
  });

  it('should display the opening name when open', () => {
    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    expect(screen.getByText('Sicilian Defense')).toBeInTheDocument();
  });

  it('should display the confirmation title', () => {
    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    expect(screen.getByText('Confirmer la suppression')).toBeInTheDocument();
  });

  it('should display the irreversible warning', () => {
    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    const confirmButton = screen.getByText('Supprimer');
    await user.click(confirmButton);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    const cancelButton = screen.getByText('Annuler');
    await user.click(cancelButton);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel when overlay is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    // The overlay is the outermost div wrapping the modal
    const overlay = screen.getByText('Sicilian Defense').closest('[class*="modal"]')!.parentElement!;
    await user.click(overlay);

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should not call onCancel when modal content is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <DeleteConfirmModal isOpen={true} openingName="Sicilian Defense" onConfirm={onConfirm} onCancel={onCancel} />,
    );

    // Click on the modal content (not the overlay) — stopPropagation should prevent onCancel
    const modalContent = screen.getByText('Sicilian Defense').closest('[class*="modal"]')!;
    await user.click(modalContent);

    expect(onCancel).not.toHaveBeenCalled();
  });
});
