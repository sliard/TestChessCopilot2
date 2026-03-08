import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../store/authStore';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuthStore();

  const features = [
    { key: 'learn', icon: '♟' },
    { key: 'practice', icon: '📚' },
    { key: 'discover', icon: '🔍' },
  ];

  const sampleOpenings = [
    { name: 'Ruy Lopez', eco: 'C60', moves: 8 },
    { name: 'Sicilian Defense', eco: 'B20', moves: 6 },
    { name: "Queen's Gambit", eco: 'D06', moves: 4 },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-dark) 0%, var(--color-dark-lighter) 100%)', color: 'var(--color-white)', padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, marginBottom: 'var(--spacing-md)' }}>{t('landing.hero.title')}</h1>
          <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-gray-300)', maxWidth: 600, margin: '0 auto var(--spacing-xl)' }}>{t('landing.hero.subtitle')}</p>
          <Link to="/openings" className="btn btn-primary btn-lg">{t('landing.hero.cta')}</Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: 'var(--spacing-3xl) 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'var(--font-size-3xl)', marginBottom: 'var(--spacing-2xl)' }}>{t('landing.features.title')}</h2>
          <div className="grid grid-cols-3">
            {features.map((f) => (
              <div key={f.key} className="card card-body" style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: 'var(--spacing-md)' }}>{f.icon}</div>
                <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>{t(`landing.features.cards.${f.key}.title`)}</h3>
                <p style={{ color: 'var(--color-gray-600)' }}>{t(`landing.features.cards.${f.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview */}
      <section style={{ padding: 'var(--spacing-2xl) 0', backgroundColor: 'var(--color-cream-dark)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-xl)' }}>{t('landing.preview.title')}</h2>
          <div className="grid grid-cols-3">
            {sampleOpenings.map((o) => (
              <div key={o.name} className="card card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-sm)' }}>
                  <h3>{o.name}</h3>
                  <span className="badge badge-primary">{o.eco}</span>
                </div>
                <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>♟ {t('openings.movesCount', { count: o.moves })}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'var(--spacing-3xl) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: 'var(--spacing-sm)' }}>{t('landing.cta.title')}</h2>
          <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--spacing-xl)' }}>{t('landing.cta.subtitle')}</p>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary btn-lg">{t('landing.cta.dashboard')}</Link>
          ) : (
            <Link to="/register" className="btn btn-primary btn-lg">{t('landing.cta.button')}</Link>
          )}
        </div>
      </section>
    </div>
  );
};
