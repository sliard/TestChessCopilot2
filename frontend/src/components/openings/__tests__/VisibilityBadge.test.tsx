import { screen } from '@testing-library/react';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { VisibilityBadge } from '../VisibilityBadge';

describe('VisibilityBadge', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should display public label with unlock icon when isPublic is true', () => {
    renderWithProviders(<VisibilityBadge isPublic={true} />);

    // Emoji and text are in the same span, so use regex to match partial content
    expect(screen.getByText(/🔓/)).toBeInTheDocument();
    expect(screen.getByText(/Public/)).toBeInTheDocument();
  });

  it('should display private label with lock icon when isPublic is false', () => {
    renderWithProviders(<VisibilityBadge isPublic={false} />);

    expect(screen.getByText(/🔒/)).toBeInTheDocument();
    expect(screen.getByText(/Privé/)).toBeInTheDocument();
  });

  it('should apply public CSS class when isPublic is true', () => {
    const { container } = renderWithProviders(<VisibilityBadge isPublic={true} />);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
    expect(badge?.className).toMatch(/public/);
  });

  it('should apply private CSS class when isPublic is false', () => {
    const { container } = renderWithProviders(<VisibilityBadge isPublic={false} />);

    const badge = container.querySelector('span');
    expect(badge).toBeInTheDocument();
    expect(badge?.className).toMatch(/private/);
  });

  it('should render in English when language is en', async () => {
    await i18n.changeLanguage('en');

    renderWithProviders(<VisibilityBadge isPublic={true} />);

    expect(screen.getByText(/Public/)).toBeInTheDocument();
  });
});
