import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import type { UserOpeningListItem } from '@/types/opening';
import { MyOpeningCard } from '../MyOpeningCard';

const mockOpening: UserOpeningListItem = {
  id: 'open-123',
  name: 'Sicilian Defense',
  description: 'A popular chess opening',
  ecoCode: 'B20',
  movesCount: 5,
  isPublic: true,
  createdAt: '2026-03-08T10:00:00Z',
  updatedAt: '2026-03-08T12:00:00Z',
};

describe('MyOpeningCard', () => {
  const onEdit = vi.fn();
  const onDelete = vi.fn();

  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    onEdit.mockClear();
    onDelete.mockClear();
  });

  it('should display the opening name', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Sicilian Defense')).toBeInTheDocument();
  });

  it('should display the ECO code', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('B20')).toBeInTheDocument();
  });

  it('should display the moves count', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText(/5/)).toBeInTheDocument();
  });

  it('should display the description', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('A popular chess opening')).toBeInTheDocument();
  });

  it('should not render description paragraph when description is empty', () => {
    const openingNoDesc: UserOpeningListItem = { ...mockOpening, description: '' };

    renderWithProviders(<MyOpeningCard opening={openingNoDesc} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.queryByText('A popular chess opening')).not.toBeInTheDocument();
  });

  it('should not render ECO code when ecoCode is undefined', () => {
    const openingNoEco: UserOpeningListItem = { ...mockOpening, ecoCode: undefined };

    renderWithProviders(<MyOpeningCard opening={openingNoEco} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.queryByText('B20')).not.toBeInTheDocument();
  });

  it('should show public visibility badge', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText(/🔓/)).toBeInTheDocument();
  });

  it('should show private badge when opening is private', () => {
    const privateOpening: UserOpeningListItem = { ...mockOpening, isPublic: false };

    renderWithProviders(<MyOpeningCard opening={privateOpening} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText(/🔒/)).toBeInTheDocument();
  });

  it('should display the creation date', () => {
    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    const formattedDate = new Date('2026-03-08T10:00:00Z').toLocaleDateString();
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('should call onEdit with the opening id when edit button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    const editButton = screen.getByText(/Modifier/);
    await user.click(editButton);

    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith('open-123');
  });

  it('should call onDelete with the opening when delete button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(<MyOpeningCard opening={mockOpening} onEdit={onEdit} onDelete={onDelete} />);

    const deleteButton = screen.getByText(/Supprimer/);
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onDelete).toHaveBeenCalledWith(mockOpening);
  });
});
