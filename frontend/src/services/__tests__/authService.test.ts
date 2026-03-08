import { authService } from '../authService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('authService', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    localStorage.clear();
  });

  describe('login', () => {
    it('should call login endpoint and return tokens', async () => {
      const tokens = { accessToken: 'at', refreshToken: 'rt', expiresIn: 3600 };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(tokens),
      });

      const result = await authService.login({ email: 'test@test.com', password: 'password' });

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/login',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ email: 'test@test.com', password: 'password' }),
        }),
      );
      expect(result).toEqual(tokens);
    });
  });

  describe('register', () => {
    it('should call register endpoint and return tokens', async () => {
      const tokens = { accessToken: 'at', refreshToken: 'rt', expiresIn: 3600 };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(tokens),
      });

      const data = { email: 'john@test.com', password: 'password', firstName: 'John', lastName: 'Doe' };
      const result = await authService.register(data);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/register',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(data),
        }),
      );
      expect(result).toEqual(tokens);
    });
  });

  describe('refresh', () => {
    it('should call refresh endpoint with refresh token', async () => {
      const tokens = { accessToken: 'new-at', refreshToken: 'new-rt', expiresIn: 3600 };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(tokens),
      });

      const result = await authService.refresh('old-refresh-token');

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/refresh',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ refreshToken: 'old-refresh-token' }),
        }),
      );
      expect(result).toEqual(tokens);
    });
  });

  describe('getCurrentUser', () => {
    it('should call getCurrentUser endpoint', async () => {
      const user = {
        id: '1',
        email: 'test@test.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'USER',
        createdAt: '2024-01-01T00:00:00Z',
      };
      mockFetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(user),
      });

      const result = await authService.getCurrentUser();

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/v1/auth/me',
        expect.objectContaining({
          method: 'GET',
        }),
      );
      expect(result).toEqual(user);
    });
  });

  describe('storeTokens', () => {
    it('should store tokens in localStorage', () => {
      authService.storeTokens({
        accessToken: 'my-access-token',
        refreshToken: 'my-refresh-token',
        expiresIn: 3600,
      });

      expect(localStorage.getItem('accessToken')).toBe('my-access-token');
      expect(localStorage.getItem('refreshToken')).toBe('my-refresh-token');
    });
  });

  describe('clearTokens', () => {
    it('should clear tokens from localStorage', () => {
      localStorage.setItem('accessToken', 'at');
      localStorage.setItem('refreshToken', 'rt');

      authService.clearTokens();

      expect(localStorage.getItem('accessToken')).toBeNull();
      expect(localStorage.getItem('refreshToken')).toBeNull();
    });
  });
});
