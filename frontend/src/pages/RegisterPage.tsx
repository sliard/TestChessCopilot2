import { type FC, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { RegisterForm } from '../components/auth/RegisterForm';

export const RegisterPage: FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div className="page" style={{ padding: 'var(--spacing-2xl) 0' }}>
      <RegisterForm />
    </div>
  );
};
