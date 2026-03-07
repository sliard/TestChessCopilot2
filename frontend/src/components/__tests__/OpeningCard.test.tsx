import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import { OpeningCard } from '../OpeningCard';
import type { OpeningListItem } from '../../types/opening';

const mockOpening: OpeningListItem = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  name: 'Défense Sicilienne',
  description: 'Une des ouvertures les plus populaires',
  ecoCode: 'B20',
  movesCount: 2,
  author: 'Système',
  createdAt: '2026-01-15T10:00:00Z',
};

describe('OpeningCard', () => {
  it('should display opening name', () => {
    render(<OpeningCard opening={mockOpening} />);
    expect(screen.getByText('Défense Sicilienne')).toBeInTheDocument();
  });

  it('should display ECO code', () => {
    render(<OpeningCard opening={mockOpening} />);
    expect(screen.getByText('B20')).toBeInTheDocument();
  });

  it('should display moves count', () => {
    render(<OpeningCard opening={mockOpening} />);
    expect(screen.getByText('2 coups')).toBeInTheDocument();
  });

  it('should display description', () => {
    render(<OpeningCard opening={mockOpening} />);
    expect(screen.getByText('Une des ouvertures les plus populaires')).toBeInTheDocument();
  });

  it('should display author', () => {
    render(<OpeningCard opening={mockOpening} />);
    expect(screen.getByText('Système')).toBeInTheDocument();
  });

  it('should link to opening detail page', () => {
    render(<OpeningCard opening={mockOpening} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/openings/550e8400-e29b-41d4-a716-446655440001');
  });
});
