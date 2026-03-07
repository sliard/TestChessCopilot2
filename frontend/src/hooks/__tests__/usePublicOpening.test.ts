import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePublicOpening } from '../usePublicOpening';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

const VALID_ID = '550e8400-e29b-41d4-a716-446655440001';
const UNKNOWN_ID = '00000000-0000-0000-0000-000000000000';

describe('usePublicOpening', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => usePublicOpening(VALID_ID));

    expect(result.current.loading).toBe(true);
    expect(result.current.opening).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should return opening detail after fetch', async () => {
    const { result } = renderHook(() => usePublicOpening(VALID_ID));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.opening).not.toBeNull();
    expect(result.current.opening!.name).toBe('Défense Sicilienne');
    expect(result.current.opening!.ecoCode).toBe('B20');
    expect(result.current.opening!.moves).toBe('1.e4 c5');
    expect(result.current.opening!.author).toBe('Système');
    expect(result.current.error).toBeNull();
  });

  it('should return error when opening not found', async () => {
    const { result } = renderHook(() => usePublicOpening(UNKNOWN_ID));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.opening).toBeNull();
  });

  it('should refetch when refetch called', async () => {
    const { result } = renderHook(() => usePublicOpening(VALID_ID));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.opening!.name).toBe('Défense Sicilienne');

    // Temporarily override handler to return different data
    server.use(
      http.get('/api/v1/public/openings/:id', ({ params }) => {
        if (params.id === VALID_ID) {
          return HttpResponse.json({
            id: VALID_ID,
            name: 'Défense Sicilienne Updated',
            description: 'Updated description',
            ecoCode: 'B20',
            moves: '1.e4 c5 2.Nf3',
            author: 'Système',
            createdAt: '2026-01-15T10:00:00Z',
            updatedAt: '2026-01-16T10:00:00Z',
          });
        }
        return HttpResponse.json(
          { code: 'NOT_FOUND', message: 'Not found', status: 404 },
          { status: 404 },
        );
      }),
    );

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.opening!.name).toBe('Défense Sicilienne Updated');
    });

    expect(result.current.error).toBeNull();
  });
});
