import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { NotFoundPage } from '../NotFoundPage';

describe('NotFoundPage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should render 404 code', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('404')).toBeInTheDocument();
  });

  it('should render not found title in French', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('Page non trouvée')).toBeInTheDocument();
  });

  it('should render not found message', () => {
    renderWithProviders(<NotFoundPage />);

    expect(
      screen.getByText("La page que vous recherchez n'existe pas."),
    ).toBeInTheDocument();
  });

  it('should render back to home link', () => {
    renderWithProviders(<NotFoundPage />);

    const link = screen.getByText("Retour à l'accueil");
    expect(link).toBeInTheDocument();
    expect(link.closest('a')).toHaveAttribute('href', '/');
  });

  it('should translate content to English', async () => {
    await i18n.changeLanguage('en');
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByText('Back to Home')).toBeInTheDocument();
  });
});
