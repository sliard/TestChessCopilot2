import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { Footer } from '../Footer';

describe('Footer', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should render copyright text in French', () => {
    renderWithProviders(<Footer />);

    expect(
      screen.getByText('© 2026 Chess Training. Tous droits réservés.'),
    ).toBeInTheDocument();
  });

  it('should render copyright text in English when language changes', async () => {
    await i18n.changeLanguage('en');
    renderWithProviders(<Footer />);

    expect(
      screen.getByText('© 2026 Chess Training. All rights reserved.'),
    ).toBeInTheDocument();
  });

  it('should render a footer element', () => {
    const { container } = renderWithProviders(<Footer />);

    expect(container.querySelector('footer')).toBeInTheDocument();
  });
});
