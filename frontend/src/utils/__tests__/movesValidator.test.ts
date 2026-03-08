import { validateMoves } from '../movesValidator';

describe('validateMoves', () => {
  // --- Invalid input cases ---

  it('should return invalid for empty string', () => {
    const result = validateMoves('');

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return invalid for whitespace only', () => {
    const result = validateMoves('   ');

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  // --- Valid move sequences ---

  it('should validate a single move', () => {
    const result = validateMoves('1. e4');

    expect(result.valid).toBe(true);
    expect(result.position).toBeDefined();
  });

  it('should validate standard PGN with move numbers', () => {
    const result = validateMoves('1. e4 e5 2. Nf3 Nc6');

    expect(result.valid).toBe(true);
    expect(result.position).toBeDefined();
  });

  it('should validate moves without move numbers', () => {
    const result = validateMoves('e4 e5 Nf3 Nc6');

    expect(result.valid).toBe(true);
    expect(result.position).toBeDefined();
  });

  it('should validate the Ruy Lopez opening', () => {
    const result = validateMoves('1. e4 e5 2. Nf3 Nc6 3. Bb5');

    expect(result.valid).toBe(true);
    expect(result.position).toBeDefined();
  });

  it('should validate the Italian Game', () => {
    const result = validateMoves('1. e4 e5 2. Nf3 Nc6 3. Bc4');

    expect(result.valid).toBe(true);
  });

  // --- FEN correctness ---

  it('should return FEN with black to move after 1. e4', () => {
    const result = validateMoves('1. e4');

    expect(result.valid).toBe(true);
    expect(result.position).toContain(' b ');
  });

  it('should return FEN with white to move after 1. e4 e5', () => {
    const result = validateMoves('1. e4 e5');

    expect(result.valid).toBe(true);
    expect(result.position).toContain(' w ');
  });

  it('should return FEN containing piece positions', () => {
    const result = validateMoves('1. e4');

    expect(result.valid).toBe(true);
    // Black pieces still on initial rank
    expect(result.position).toContain('rnbqkbnr');
  });

  // --- Illegal move detection ---

  it('should detect an illegal bishop move', () => {
    // Bg2 is impossible — g2 is occupied by white's own pawn
    const result = validateMoves('1. e4 e5 2. Bg2');

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should detect an illegal pawn move', () => {
    // After 1. e4 e5, white cannot play e5 (square occupied)
    const result = validateMoves('1. e4 e5 2. e5');

    expect(result.valid).toBe(false);
    expect(result.error).toContain('e5');
  });

  it('should detect a completely nonsensical token', () => {
    const result = validateMoves('1. Zz9');

    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  // --- Edge cases ---

  it('should reject condensed PGN notation without spaces (parser limitation)', () => {
    // The validator splits on whitespace, so "1.e4" is a single token
    // that doesn't match the move-number regex — it gets passed to chess.js and fails
    const result = validateMoves('1.e4 e5 2.Nf3');

    expect(result.valid).toBe(false);
  });

  it('should handle long move sequences', () => {
    // Scholar's mate: 1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7#
    const result = validateMoves('1. e4 e5 2. Qh5 Nc6 3. Bc4 Nf6 4. Qxf7');

    expect(result.valid).toBe(true);
    expect(result.position).toBeDefined();
  });
});
