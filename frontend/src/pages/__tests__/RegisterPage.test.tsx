import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import { RegisterPage } from '../RegisterPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('RegisterPage', () => {
  it('should render registration form', () => {
    render(<RegisterPage />);

    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^nom$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^mot de passe$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmer/i)).toBeInTheDocument();
  });

  it('should show error when password is too short', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'Ab1');
    await user.type(screen.getByLabelText(/confirmer/i), 'Ab1');
    await user.click(
      screen.getByRole('button', { name: /créer mon compte/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/au moins 8 caractères/i)).toBeInTheDocument();
    });
  });

  it('should show error when password has no uppercase', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'password123');
    await user.type(screen.getByLabelText(/confirmer/i), 'password123');
    await user.click(
      screen.getByRole('button', { name: /créer mon compte/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/une majuscule/i)).toBeInTheDocument();
    });
  });

  it('should show error when password has no digit', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(
      screen.getByLabelText(/^mot de passe$/i),
      'PasswordNoDigit',
    );
    await user.type(screen.getByLabelText(/confirmer/i), 'PasswordNoDigit');
    await user.click(
      screen.getByRole('button', { name: /créer mon compte/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/un chiffre/i)).toBeInTheDocument();
    });
  });

  it('should show error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirmer/i), 'Password2');
    await user.click(
      screen.getByRole('button', { name: /créer mon compte/i }),
    );

    await waitFor(() => {
      expect(screen.getByText(/ne correspondent pas/i)).toBeInTheDocument();
    });
  });

  it('should navigate to dashboard on successful registration', async () => {
    const user = userEvent.setup();
    render(<RegisterPage />);

    await user.type(screen.getByLabelText(/prénom/i), 'John');
    await user.type(screen.getByLabelText(/^nom$/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/^mot de passe$/i), 'Password1');
    await user.type(screen.getByLabelText(/confirmer/i), 'Password1');
    await user.click(
      screen.getByRole('button', { name: /créer mon compte/i }),
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
