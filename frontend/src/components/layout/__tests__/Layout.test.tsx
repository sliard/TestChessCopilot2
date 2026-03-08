import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { Layout } from '../Layout';

describe('Layout', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should render header', () => {
    renderWithProviders(<Layout />);

    expect(screen.getByText('Chess Training')).toBeInTheDocument();
  });

  it('should render footer', () => {
    renderWithProviders(<Layout />);

    expect(
      screen.getByText('© 2026 Chess Training. Tous droits réservés.'),
    ).toBeInTheDocument();
  });

  it('should render main content area', () => {
    const { container } = renderWithProviders(<Layout />);

    expect(container.querySelector('main')).toBeInTheDocument();
  });
});
