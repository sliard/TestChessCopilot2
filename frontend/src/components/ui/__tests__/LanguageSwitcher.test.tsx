import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import i18n from '@/i18n';
import { renderWithProviders } from '@/test/test-utils';
import { LanguageSwitcher } from '../LanguageSwitcher';

describe('LanguageSwitcher', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should display current language code', () => {
    renderWithProviders(<LanguageSwitcher />);

    expect(screen.getByText('FR')).toBeInTheDocument();
  });

  it('should open dropdown and show language options', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: /choisir la langue/i }));

    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should change language when option is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: /choisir la langue/i }));
    await user.click(screen.getByText('English'));

    expect(i18n.language).toBe('en');
  });

  it('should close dropdown after selecting a language', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: /choisir la langue/i }));
    await user.click(screen.getByText('English'));

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should close dropdown on Escape key', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LanguageSwitcher />);

    await user.click(screen.getByRole('button', { name: /choisir la langue/i }));
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('should render buttons variant', () => {
    renderWithProviders(<LanguageSwitcher variant="buttons" />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
    expect(screen.getByText('Français')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should mark active language with aria-pressed in buttons variant', () => {
    renderWithProviders(<LanguageSwitcher variant="buttons" />);

    const frButton = screen.getByRole('button', { pressed: true });
    expect(frButton).toHaveTextContent('Français');
  });
});
