import { http, HttpResponse } from 'msw';

const API_URL = '/api';

const mockUser = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'USER',
};

const mockAuthResponse = {
  accessToken: 'mock-access-token',
  refreshToken: 'mock-refresh-token',
  expiresIn: 900000,
};

export const handlers = [
  http.post(`${API_URL}/v1/auth/register`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (body.email === 'existing@example.com') {
      return HttpResponse.json(
        {
          code: 'BAD_REQUEST',
          message: 'Cet email est déjà utilisé',
          status: 400,
          path: '/api/v1/auth/register',
        },
        { status: 400 },
      );
    }
    return HttpResponse.json(mockAuthResponse, { status: 201 });
  }),

  http.post(`${API_URL}/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as Record<string, string>;
    if (body.password === 'wrongpassword') {
      return HttpResponse.json(
        {
          code: 'UNAUTHORIZED',
          message: 'Email ou mot de passe incorrect',
          status: 401,
          path: '/api/v1/auth/login',
        },
        { status: 401 },
      );
    }
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_URL}/v1/auth/refresh`, () => {
    return HttpResponse.json(mockAuthResponse);
  }),

  http.post(`${API_URL}/v1/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get(`${API_URL}/v1/auth/me`, ({ request }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return HttpResponse.json(
        { code: 'UNAUTHORIZED', message: 'Non authentifié', status: 401 },
        { status: 401 },
      );
    }
    return HttpResponse.json(mockUser);
  }),
];
