import { renderHook, act } from '@testing-library/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';
import { useLanguage } from '../useLanguage';

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);

describe('useLanguage', () => {
  beforeEach(async () => {
    await i18n.changeLanguage('fr');
  });

  it('should return current language', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.currentLanguage).toBe('fr');
  });

  it('should change language', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.changeLanguage('en');
    });

    expect(result.current.currentLanguage).toBe('en');
  });

  it('should update html lang attribute when language changes', async () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    await act(async () => {
      await result.current.changeLanguage('en');
    });

    expect(document.documentElement.lang).toBe('en');
  });

  it('should list available languages', () => {
    const { result } = renderHook(() => useLanguage(), { wrapper });

    expect(result.current.languages).toHaveLength(2);
    expect(result.current.languages.map((l) => l.code)).toEqual(['fr', 'en']);
    expect(result.current.languages[0].flag).toBe('🇫🇷');
    expect(result.current.languages[1].flag).toBe('🇬🇧');
  });
});
