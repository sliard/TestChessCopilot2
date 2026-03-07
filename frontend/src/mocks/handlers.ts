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

// --- Mock data for public openings ---

const mockOpenings = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    name: 'Défense Sicilienne',
    description: 'Une des ouvertures les plus populaires',
    ecoCode: 'B20',
    movesCount: 2,
    author: 'Système',
    createdAt: '2026-01-15T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    name: 'Ruy Lopez',
    description: 'Ouverture classique espagnole',
    ecoCode: 'C60',
    movesCount: 3,
    author: 'Système',
    createdAt: '2026-01-14T10:00:00Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    name: 'Défense Française',
    description: 'Ouverture solide et stratégique',
    ecoCode: 'C00',
    movesCount: 2,
    author: 'Système',
    createdAt: '2026-01-13T10:00:00Z',
  },
];

const mockOpeningDetail = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Défense Sicilienne',
  description: 'Une des ouvertures les plus populaires',
  ecoCode: 'B20',
  moves: '1.e4 c5',
  author: 'Système',
  createdAt: '2026-01-15T10:00:00Z',
  updatedAt: '2026-01-15T10:00:00Z',
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

  // --- Public Openings handlers ---

  http.get(`${API_URL}/v1/public/openings/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const filtered = mockOpenings.filter((o) =>
      o.name.toLowerCase().includes((q || '').toLowerCase()),
    );
    return HttpResponse.json({
      content: filtered,
      page: 0,
      size: 20,
      totalElements: filtered.length,
      totalPages: filtered.length > 0 ? 1 : 0,
      first: true,
      last: true,
    });
  }),

  http.get(`${API_URL}/v1/public/openings/:id`, ({ params }) => {
    const { id } = params;
    if (id === '550e8400-e29b-41d4-a716-446655440001') {
      return HttpResponse.json(mockOpeningDetail);
    }
    return HttpResponse.json(
      { code: 'NOT_FOUND', message: 'Ouverture non trouvée', status: 404 },
      { status: 404 },
    );
  }),

  http.get(`${API_URL}/v1/public/openings`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q');
    const ecoCode = url.searchParams.get('ecoCode');
    const moves = url.searchParams.get('moves');
    const sort = url.searchParams.get('sort');
    const order = url.searchParams.get('order');

    let filtered = [...mockOpenings];

    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter((o) => o.name.toLowerCase().includes(lower));
    }
    if (ecoCode) {
      const upperCode = ecoCode.toUpperCase();
      filtered = filtered.filter((o) => o.ecoCode.toUpperCase().startsWith(upperCode));
    }
    if (moves) {
      filtered = filtered.filter((o) => o.movesCount >= Number(moves));
    }

    if (sort) {
      const dir = order === 'asc' ? 1 : -1;
      filtered.sort((a, b) => {
        const valA = a[sort as keyof typeof a];
        const valB = b[sort as keyof typeof b];
        if (typeof valA === 'string' && typeof valB === 'string') {
          return dir * valA.localeCompare(valB);
        }
        if (typeof valA === 'number' && typeof valB === 'number') {
          return dir * (valA - valB);
        }
        return 0;
      });
    }

    return HttpResponse.json({
      content: filtered,
      page: 0,
      size: 20,
      totalElements: filtered.length,
      totalPages: filtered.length > 0 ? 1 : 0,
      first: true,
      last: true,
    });
  }),
];
