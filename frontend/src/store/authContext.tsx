import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services/authService';
import type { LoginRequest, RegisterRequest, User } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch {
        // Token invalid or expired — try refresh
        const refreshToken = authService.getRefreshToken();
        if (refreshToken) {
          try {
            const tokens = await authService.refresh(refreshToken);
            authService.storeTokens(tokens);
            const userData = await authService.getCurrentUser();
            setUser(userData);
          } catch {
            authService.clearTokens();
          }
        } else {
          authService.clearTokens();
        }
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    const tokens = await authService.login(credentials);
    authService.storeTokens(tokens);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const tokens = await authService.register(data);
    authService.storeTokens(tokens);
    const userData = await authService.getCurrentUser();
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    authService.clearTokens();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
