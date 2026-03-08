import { parseMoves } from '../movesParser';

describe('parseMoves', () => {
  it('should parse standard PGN notation with spaces after numbers', () => {
    expect(parseMoves('1. e4 c5')).toEqual(['e4', 'c5']);
  });

  it('should parse PGN without spaces after numbers', () => {
    expect(parseMoves('1.e4 c5')).toEqual(['e4', 'c5']);
  });

  it('should parse multiple moves', () => {
    expect(parseMoves('1. e4 e5 2. Nf3 Nc6 3. Bb5')).toEqual(['e4', 'e5', 'Nf3', 'Nc6', 'Bb5']);
  });

  it('should return empty array for empty string', () => {
    expect(parseMoves('')).toEqual([]);
  });

  it('should return empty array for null/undefined', () => {
    expect(parseMoves(null as unknown as string)).toEqual([]);
    expect(parseMoves(undefined as unknown as string)).toEqual([]);
  });

  it('should handle whitespace-only strings', () => {
    expect(parseMoves('   ')).toEqual([]);
  });

  it('should handle condensed notation', () => {
    expect(parseMoves('1.e4 e5 2.f4')).toEqual(['e4', 'e5', 'f4']);
  });
});
