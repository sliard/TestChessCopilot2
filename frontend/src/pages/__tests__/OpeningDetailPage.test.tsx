import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render as rtlRender } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../components/AuthProvider';
import { OpeningDetailPage } from '../OpeningDetailPage';

const VALID_ID = '550e8400-e29b-41d4-a716-446655440001';
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

const renderWithRoute = (id: string) => {
  return rtlRender(
    <MemoryRouter initialEntries={[`/openings/${id}`]}>
      <AuthProvider>
        <Routes>
          <Route path="/openings/:id" element={<OpeningDetailPage />} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
};

describe('OpeningDetailPage', () => {
  it('should display opening name after loading', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(screen.getByText('Défense Sicilienne')).toBeInTheDocument();
    });
  });

  it('should display ECO code badge', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(screen.getByText('B20')).toBeInTheDocument();
    });
  });

  it('should display author name', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(screen.getByText('Par Système')).toBeInTheDocument();
    });
  });

  it('should display moves notation', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(screen.getByText('1.e4 c5')).toBeInTheDocument();
    });
  });

  it('should display description', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(
        screen.getByText('Une des ouvertures les plus populaires'),
      ).toBeInTheDocument();
    });
  });

  it('should display back button', async () => {
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(
        screen.getByText('← Retour aux ouvertures'),
      ).toBeInTheDocument();
    });
  });

  it('should display error message when opening not found', async () => {
    renderWithRoute(UNKNOWN_ID);

    await waitFor(() => {
      expect(screen.getByText('Ouverture non trouvée.')).toBeInTheDocument();
    });
  });

  it('should allow dismissing CTA card', async () => {
    const user = userEvent.setup();
    renderWithRoute(VALID_ID);

    await waitFor(() => {
      expect(screen.getByText('Défense Sicilienne')).toBeInTheDocument();
    });

    const closeButton = screen.getByLabelText('Fermer');
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);

    expect(screen.queryByLabelText('Fermer')).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Créez un compte pour sauvegarder/),
    ).not.toBeInTheDocument();
  });
});
