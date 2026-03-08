/**
 * Client API centralisé avec intercepteur d'erreurs et refresh token automatique.
 *
 * Événements custom dispatchés :
 * - `api:error`            → toute erreur API (detail: ApiClientError)
 * - `api:network-error`    → erreur réseau / serveur injoignable
 * - `auth:session-expired` → session expirée après échec du refresh
 */

import type { ApiError } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || '/api';

class ApiClient {
  private isRefreshing = false;
  private refreshPromise: Promise<string> | null = null;

  private getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  private clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  private buildHeaders(
    authenticated: boolean,
    customHeaders?: HeadersInit,
  ): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(customHeaders as Record<string, string>),
    };

    if (authenticated) {
      const token = this.getAccessToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleRefreshToken(): Promise<string> {
    if (this.isRefreshing && this.refreshPromise) {
      return this.refreshPromise;
    }

    this.isRefreshing = true;
    this.refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        this.clearTokens();
        throw new ApiClientError('Session expirée', 'SESSION_EXPIRED', 401);
      }

      const response = await fetch(`${API_URL}/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        throw new ApiClientError('Session expirée', 'SESSION_EXPIRED', 401);
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken as string;
    })();

    try {
      return await this.refreshPromise;
    } finally {
      this.isRefreshing = false;
      this.refreshPromise = null;
    }
  }

  async request<T>(
    endpoint: string,
    options: RequestInit & { authenticated?: boolean } = {},
  ): Promise<T> {
    const { authenticated = true, headers: customHeaders, ...fetchOptions } = options;

    const headers = this.buildHeaders(authenticated, customHeaders);

    let response: Response;
    try {
      response = await fetch(`${API_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
      });
    } catch {
      const networkError = new ApiClientError(
        'Impossible de contacter le serveur',
        'NETWORK_ERROR',
        0,
      );
      window.dispatchEvent(new CustomEvent('api:network-error', { detail: networkError }));
      throw networkError;
    }

    // Tentative de refresh si 401 et authentifié
    if (response.status === 401 && authenticated) {
      try {
        const newToken = await this.handleRefreshToken();
        const retryHeaders = {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        };
        response = await fetch(`${API_URL}${endpoint}`, {
          ...fetchOptions,
          headers: retryHeaders,
        });
      } catch {
        // Refresh échoué, propager l'erreur
        window.dispatchEvent(new CustomEvent('auth:session-expired'));
        throw new ApiClientError('Session expirée', 'SESSION_EXPIRED', 401);
      }
    }

    if (!response.ok) {
      const errorBody: ApiError = await response.json().catch(() => ({
        code: 'UNKNOWN',
        message: 'Une erreur est survenue',
        status: response.status,
        path: endpoint,
        timestamp: new Date().toISOString(),
      }));

      const apiClientError = new ApiClientError(
        errorBody.message,
        errorBody.code,
        errorBody.status || response.status,
        errorBody.errors,
      );

      window.dispatchEvent(new CustomEvent('api:error', { detail: apiClientError }));
      throw apiClientError;
    }

    // Gérer les réponses vides (204 No Content)
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string, authenticated = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', authenticated });
  }

  async post<T>(endpoint: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      authenticated,
    });
  }

  async put<T>(endpoint: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
      authenticated,
    });
  }

  async patch<T>(endpoint: string, body?: unknown, authenticated = true): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
      authenticated,
    });
  }

  async delete<T>(endpoint: string, authenticated = true): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', authenticated });
  }
}

export class ApiClientError extends Error {
  readonly code: string;
  readonly status: number;
  readonly errors?: string[];

  constructor(message: string, code: string, status: number, errors?: string[]) {
    super(message);
    this.name = 'ApiClientError';
    this.code = code;
    this.status = status;
    this.errors = errors;
  }
}

export const apiClient = new ApiClient();
