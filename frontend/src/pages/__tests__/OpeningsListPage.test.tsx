import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/test-utils';
import { OpeningsListPage } from '../OpeningsListPage';

describe('OpeningsListPage', () => {
  it('should display page title', () => {
    render(<OpeningsListPage />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('should display search bar', () => {
    render(<OpeningsListPage />);
    expect(screen.getByPlaceholderText('Rechercher une ouverture...')).toBeInTheDocument();
  });

  it('should display openings after loading', async () => {
    render(<OpeningsListPage />);

    await waitFor(() => {
      expect(screen.getByText('Défense Sicilienne')).toBeInTheDocument();
    });
    expect(screen.getByText('Ruy Lopez')).toBeInTheDocument();
  });

  it('should display signup CTA', async () => {
    render(<OpeningsListPage />);

    await waitFor(() => {
      expect(screen.getByText(/inscrire gratuitement/i)).toBeInTheDocument();
    });
  });
});
