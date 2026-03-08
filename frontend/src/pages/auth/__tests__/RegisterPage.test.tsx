import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { RegisterPage } from '../RegisterPage';
import { authService } from '@/services/authService';

vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
    register: vi.fn(),
    refresh: vi.fn(),
    getCurrentUser: vi.fn(),
    storeTokens: vi.fn(),
    clearTokens: vi.fn(),
    getRefreshToken: vi.fn().mockReturnValue(null),
  },
}));

describe('RegisterPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    vi.clearAllMocks();
    vi.mocked(authService.getRefreshToken).mockReturnValue(null);
  });

  it('should render register form with all fields', () => {
    renderWithProviders(<RegisterPage />);

    expect(screen.getByRole('heading', { name: 'Créer un compte' })).toBeInTheDocument();
    expect(screen.getByLabelText('Prénom')).toBeInTheDocument();
    expect(screen.getByLabelText('Nom')).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Créer mon compte' })).toBeInTheDocument();
  });

  it('should display validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(screen.getByText("L'email est obligatoire")).toBeInTheDocument();
    });
  });

  it("should display error when passwords don't match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText('Prénom'), 'John');
    await user.type(screen.getByLabelText('Nom'), 'Doe');
    await user.type(screen.getByLabelText('Adresse email'), 'john@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'different123');
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(screen.getByText('Les mots de passe ne correspondent pas')).toBeInTheDocument();
    });
  });

  it('should call register when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.register).mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 3600,
    });
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: '1',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      createdAt: '2024-01-01T00:00:00Z',
    });

    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText('Prénom'), 'John');
    await user.type(screen.getByLabelText('Nom'), 'Doe');
    await user.type(screen.getByLabelText('Adresse email'), 'john@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.type(screen.getByLabelText('Confirmer le mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Créer mon compte' }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
      });
    });
  });

  it('should have link to login page', () => {
    renderWithProviders(<RegisterPage />);

    const link = screen.getByRole('link', { name: 'Connectez-vous' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/login');
  });
});
