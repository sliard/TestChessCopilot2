import { api } from '@/services/api';
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from '@/types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return api<AuthResponse>('/v1/auth/login', {
      method: 'POST',
      body: credentials,
    });
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return api<AuthResponse>('/v1/auth/register', {
      method: 'POST',
      body: data,
    });
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return api<AuthResponse>('/v1/auth/refresh', {
      method: 'POST',
      body: { refreshToken },
    });
  },

  async getCurrentUser(): Promise<UserResponse> {
    return api<UserResponse>('/v1/auth/me');
  },

  storeTokens(tokens: AuthResponse): void {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  },

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  },
};
