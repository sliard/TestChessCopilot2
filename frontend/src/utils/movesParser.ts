export const parseMoves = (movesString: string): string[] => {
  if (!movesString || !movesString.trim()) return [];
  return movesString
    .replace(/\d+\.+\s*/g, '')
    .split(/\s+/)
    .filter(Boolean);
};
