import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ApiClientError } from '../services/apiClient';

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

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof ApiClientError && err.errors?.length) {
        setFieldErrors(parseFieldErrors(err.errors));
      } else {
        setError(err instanceof Error ? err.message : 'Erreur de connexion');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container form-container">
        <h1>Connexion</h1>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
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
              placeholder="Votre mot de passe"
              required
              autoComplete="current-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="form-footer">
          Pas encore de compte ?{' '}
          <Link to="/register">Créer un compte</Link>
        </p>
      </div>
    </div>
  );
};

