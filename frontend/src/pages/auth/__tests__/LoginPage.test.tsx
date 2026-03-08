import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { LoginPage } from '../LoginPage';
import { authService } from '@/services/authService';
import { ApiError } from '@/services/api';

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

describe('LoginPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
    vi.clearAllMocks();
    vi.mocked(authService.getRefreshToken).mockReturnValue(null);
  });

  it('should render login form with email and password fields', () => {
    renderWithProviders(<LoginPage />);

    expect(screen.getByRole('heading', { name: 'Connexion' })).toBeInTheDocument();
    expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
    expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Se connecter' })).toBeInTheDocument();
  });

  it('should display validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByText("L'email est obligatoire")).toBeInTheDocument();
    });
    expect(screen.getByText('Le mot de passe est obligatoire')).toBeInTheDocument();
  });

  it('should call login when form is submitted with valid data', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockResolvedValue({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      expiresIn: 3600,
    });
    vi.mocked(authService.getCurrentUser).mockResolvedValue({
      id: '1',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'USER',
      createdAt: '2024-01-01T00:00:00Z',
    });

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Adresse email'), 'test@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should display error message on failed login', async () => {
    const user = userEvent.setup();
    vi.mocked(authService.login).mockRejectedValue(
      new ApiError(401, 'Unauthorized', null),
    );

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText('Adresse email'), 'test@example.com');
    await user.type(screen.getByLabelText('Mot de passe'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: 'Se connecter' }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should have link to register page', () => {
    renderWithProviders(<LoginPage />);

    const link = screen.getByRole('link', { name: 'Inscrivez-vous' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');
  });
});
