import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { HomePage } from '../HomePage';

// Mock useAuth to control authentication state
const mockLogout = vi.fn();
let mockAuthState: { isAuthenticated: boolean; user: { firstName: string; lastName: string; email: string } | null; logout: typeof mockLogout } = { isAuthenticated: false, user: null, logout: mockLogout };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('HomePage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    mockAuthState = { isAuthenticated: false, user: null, logout: mockLogout };
  });

  it('should render hero section with title and CTA', () => {
    renderWithProviders(<HomePage />);

    expect(
      screen.getByText("Maîtrisez les ouvertures d'échecs"),
    ).toBeInTheDocument();
    expect(screen.getByText('Explorer les ouvertures')).toBeInTheDocument();
  });

  it('should render 3 feature cards', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText("Bibliothèque d'ouvertures")).toBeInTheDocument();
    expect(screen.getByText('Échiquier interactif')).toBeInTheDocument();
    expect(screen.getByText('Progression personnelle')).toBeInTheDocument();
  });

  it('should render popular openings preview', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Ouvertures populaires')).toBeInTheDocument();
    expect(screen.getByText('Défense Sicilienne')).toBeInTheDocument();
    expect(screen.getByText('Ruy Lopez')).toBeInTheDocument();
    expect(screen.getByText('Gambit du Roi')).toBeInTheDocument();
  });

  it('should render ECO codes for openings', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('B20')).toBeInTheDocument();
    expect(screen.getByText('C60')).toBeInTheDocument();
    expect(screen.getByText('C30')).toBeInTheDocument();
  });

  it('should show register CTA when not authenticated', () => {
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Prêt à progresser ?')).toBeInTheDocument();
    expect(screen.getByText("S'inscrire gratuitement")).toBeInTheDocument();
  });

  it('should show dashboard link when authenticated', () => {
    mockAuthState = {
      isAuthenticated: true,
      user: { firstName: 'Alice', lastName: 'Test', email: 'alice@test.com' },
      logout: mockLogout,
    };
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Bonjour Alice !')).toBeInTheDocument();
    expect(screen.getByText('Accéder au tableau de bord')).toBeInTheDocument();
    expect(screen.queryByText("S'inscrire gratuitement")).not.toBeInTheDocument();
  });

  it('should translate content to English', async () => {
    await i18n.changeLanguage('en');
    renderWithProviders(<HomePage />);

    expect(screen.getByText('Master chess openings')).toBeInTheDocument();
    expect(screen.getByText('Explore openings')).toBeInTheDocument();
    expect(screen.getByText('Opening library')).toBeInTheDocument();
  });
});
