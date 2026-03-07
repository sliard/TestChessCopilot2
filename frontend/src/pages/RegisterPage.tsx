import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiClientError } from '../services/apiClient';

const validatePassword = (pwd: string): string[] => {
  const errors: string[] = [];
  if (pwd.length < 8) {
    errors.push('Le mot de passe doit contenir au moins 8 caractères');
  }
  if (!/[A-Z]/.test(pwd)) {
    errors.push('Le mot de passe doit contenir au moins une majuscule');
  }
  if (!/\d/.test(pwd)) {
    errors.push('Le mot de passe doit contenir au moins un chiffre');
  }
  return errors;
};

const parseFieldErrors = (errors: string[]): Record<string, string> => {
  const result: Record<string, string> = {};
  for (const error of errors) {
    const colonIndex = error.indexOf(':');
    if (colonIndex > 0) {
      const field = error.substring(0, colonIndex).trim();
      const message = error.substring(colonIndex + 1).trim();
      result[field] = message;
    }
  }
  return result;
};

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setPasswordErrors([]);

    const pwdErrors = validatePassword(password);
    if (pwdErrors.length > 0) {
      setPasswordErrors(pwdErrors);
      return;
    }

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }

    setLoading(true);

    try {
      await register({ email, password, firstName, lastName });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError && err.errors?.length) {
        setFieldErrors(parseFieldErrors(err.errors));
      } else {
        setError(err instanceof Error ? err.message : "Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container form-container">
        <h1>Créer un compte</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Prénom</label>
              <input
                id="firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                required
                autoComplete="given-name"
              />
              {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Nom</label>
              <input
                id="lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                required
                autoComplete="family-name"
              />
              {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caractères, 1 majuscule, 1 chiffre"
              required
              minLength={8}
              autoComplete="new-password"
            />
            {passwordErrors.length > 0 && (
              <ul className="field-error-list">
                {passwordErrors.map((msg) => (
                  <li key={msg} className="field-error">{msg}</li>
                ))}
              </ul>
            )}
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez votre mot de passe"
              required
              minLength={8}
              autoComplete="new-password"
            />
            {fieldErrors.confirmPassword && <span className="field-error">{fieldErrors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="form-footer">
          Déjà un compte ?{' '}
          <Link to="/login">Se connecter</Link>
        </p>
      </div>
    </div>
  );
};

