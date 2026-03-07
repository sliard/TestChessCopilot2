import { describe, it, expect } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { usePublicOpenings } from '../usePublicOpenings';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('usePublicOpenings', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => usePublicOpenings());

    expect(result.current.loading).toBe(true);
    expect(result.current.openings).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should return openings after fetch', async () => {
    const { result } = renderHook(() => usePublicOpenings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.openings).toHaveLength(2);
    expect(result.current.openings[0].name).toBe('Défense Sicilienne');
    expect(result.current.openings[1].name).toBe('Ruy Lopez');
    expect(result.current.error).toBeNull();
  });

  it('should return page metadata', async () => {
    const { result } = renderHook(() => usePublicOpenings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.page).not.toBeNull();
    expect(result.current.page!.totalElements).toBe(2);
    expect(result.current.page!.totalPages).toBe(1);
    expect(result.current.page!.first).toBe(true);
    expect(result.current.page!.last).toBe(true);
  });

  it('should search when search param provided', async () => {
    const { result } = renderHook(() => usePublicOpenings(0, 'Sicilienne'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.openings.length).toBeGreaterThanOrEqual(1);
    expect(result.current.openings[0].name).toBe('Défense Sicilienne');
  });

  it('should refetch when refetch called', async () => {
    const { result } = renderHook(() => usePublicOpenings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.openings).toHaveLength(2);

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.openings).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  it('should handle fetch error', async () => {
    server.use(
      http.get('/api/v1/public/openings', () => {
        return HttpResponse.json(
          { code: 'INTERNAL_ERROR', message: 'Server error', status: 500 },
          { status: 500 },
        );
      }),
    );

    const { result } = renderHook(() => usePublicOpenings());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).not.toBeNull();
    expect(result.current.openings).toEqual([]);
  });
});
