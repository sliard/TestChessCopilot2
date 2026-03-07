/**
 * Service d'authentification — utilise apiClient pour bénéficier de
 * l'intercepteur d'erreurs global et du refresh token automatique.
 */

import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth';
import { apiClient } from './apiClient';

export const authService = {
  async register(request: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/v1/auth/register', request, false);
  },

  async login(request: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/v1/auth/login', request, false);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/v1/auth/refresh', { refreshToken }, false);
  },

  async logout(): Promise<void> {
    return apiClient.post<void>('/v1/auth/logout');
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/v1/auth/me');
  },
};

