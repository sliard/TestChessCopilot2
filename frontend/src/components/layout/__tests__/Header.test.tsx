import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { Header } from '../Header';

// Mock useAuth to control authentication state
const mockLogout = vi.fn();
let mockAuthState: { isAuthenticated: boolean; user: { firstName: string; lastName: string; email: string } | null; logout: typeof mockLogout } = { isAuthenticated: false, user: null, logout: mockLogout };

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockAuthState,
}));

describe('Header', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    mockAuthState = { isAuthenticated: false, user: null, logout: mockLogout };
    mockLogout.mockClear();
  });

  it('should render logo with app name', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Chess Training')).toBeInTheDocument();
  });

  it('should render openings navigation link', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Ouvertures')).toBeInTheDocument();
  });

  it('should render LanguageSwitcher', () => {
    renderWithProviders(<Header />);

    expect(screen.getByLabelText(/choisir la langue/i)).toBeInTheDocument();
  });

  it('should show login and register buttons when not authenticated', () => {
    renderWithProviders(<Header />);

    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });

  it('should show dashboard and logout when authenticated', () => {
    mockAuthState = {
      isAuthenticated: true,
      user: { firstName: 'John', lastName: 'Doe', email: 'john@test.com' },
      logout: mockLogout,
    };
    renderWithProviders(<Header />);

    expect(screen.getByText('Tableau de bord')).toBeInTheDocument();
    expect(screen.getByText('Déconnexion')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
  });

  it('should render a sticky header element', () => {
    const { container } = renderWithProviders(<Header />);

    expect(container.querySelector('header')).toBeInTheDocument();
  });

  it('should render hamburger button for mobile', () => {
    renderWithProviders(<Header />);

    expect(screen.getByLabelText(/open menu/i)).toBeInTheDocument();
  });
});
