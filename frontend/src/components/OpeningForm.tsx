import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import type { CreateOpeningRequest, UpdateOpeningRequest } from '../types/opening';

interface OpeningFormProps {
  initialValues?: {
    name: string;
    description: string;
    ecoCode: string;
    moves: string;
    isPublic: boolean;
  };
  onSubmit: (data: CreateOpeningRequest | UpdateOpeningRequest) => void;
  onCancel: () => void;
  submitLabel: string;
  loading?: boolean;
}

export const OpeningForm: React.FC<OpeningFormProps> = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  loading = false,
}) => {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [ecoCode, setEcoCode] = useState(initialValues?.ecoCode ?? '');
  const [moves, setMoves] = useState(initialValues?.moves ?? '');
  const [isPublic, setIsPublic] = useState(initialValues?.isPublic ?? false);
  const [movesError, setMovesError] = useState<string | null>(null);
  const [position, setPosition] = useState('start');

  useEffect(() => {
    if (!moves.trim()) {
      setPosition('start');
      setMovesError(null);
      return;
    }

    const chess = new Chess();
    const tokens = moves.trim().split(/\s+/);

    try {
      for (const token of tokens) {
        if (/^\d+\.+$/.test(token)) continue;
        const result = chess.move(token);
        if (!result) {
          setMovesError(`Invalid move: ${token}`);
          return;
        }
      }
      setPosition(chess.fen());
      setMovesError(null);
    } catch (err) {
      setMovesError(`Parse error: ${(err as Error).message}`);
    }
  }, [moves]);

  const isValid = name.trim() && moves.trim() && !movesError;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      ecoCode: ecoCode.trim() || undefined,
      moves: moves.trim(),
      isPublic,
    });
  };

  return (
    <form className="opening-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name" className="form-label">Name *</label>
        <input
          id="name"
          type="text"
          className="form-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Sicilian Defense"
          maxLength={255}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">Description</label>
        <textarea
          id="description"
          className="form-input form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this opening..."
          maxLength={2000}
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="ecoCode" className="form-label">ECO Code (optional)</label>
        <input
          id="ecoCode"
          type="text"
          className="form-input"
          value={ecoCode}
          onChange={(e) => setEcoCode(e.target.value)}
          placeholder="e.g., B20"
          maxLength={10}
        />
      </div>

      <div className="form-group">
        <label htmlFor="moves" className="form-label">Moves * (algebraic notation)</label>
        <textarea
          id="moves"
          className={`form-input form-textarea ${movesError ? 'form-input--error' : ''}`}
          value={moves}
          onChange={(e) => setMoves(e.target.value)}
          placeholder="1.e4 c5 2.Nf3 d6 3.d4 cxd4"
          rows={3}
          required
        />
        {movesError && <p className="form-error">❌ {movesError}</p>}
        {!movesError && moves.trim() && (
          <p className="form-success">
            ✅ {moves.trim().split(/\s+/).filter(t => !/^\d+\.+$/.test(t)).length} valid moves
          </p>
        )}
      </div>

      {moves.trim() && !movesError && (
        <div className="opening-form__preview">
          <h4>Position Preview</h4>
          <Chessboard
            options={{
              position,
              allowDragging: false,
              boardStyle: {
                borderRadius: '4px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
              },
            }}
          />
        </div>
      )}

      <div className="form-group">
        <label className="form-label">Visibility</label>
        <div className="form-radio-group">
          <label className="form-radio">
            <input
              type="radio"
              name="visibility"
              checked={!isPublic}
              onChange={() => setIsPublic(false)}
            />
            🔒 Private
          </label>
          <label className="form-radio">
            <input
              type="radio"
              name="visibility"
              checked={isPublic}
              onChange={() => setIsPublic(true)}
            />
            🔓 Public
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={!isValid || loading}>
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );
};
