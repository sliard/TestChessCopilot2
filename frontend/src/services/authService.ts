import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { api } from './api';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/v1/auth/login', data);
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    return api.post<AuthResponse>('/v1/auth/register', data);
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/v1/auth/refresh', { refreshToken });
  },

  async me(): Promise<User> {
    return api.get<User>('/v1/auth/me');
  },

  async logout(): Promise<void> {
    return api.post<void>('/v1/auth/logout');
  },
};
