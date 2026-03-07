import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ChessboardViewer } from '../components/ChessboardViewer';
import { SkeletonCard } from '../components/Skeleton';
import { usePublicOpening } from '../hooks/usePublicOpening';

export const OpeningDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { opening, loading, error } = usePublicOpening(id!);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  if (loading) {
    return (
      <div className="page">
        <div className="opening-detail-container">
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (error || !opening) {
    return (
      <div className="page">
        <div className="opening-detail-container">
          <div className="alert alert-error">
            <p>Ouverture non trouvée.</p>
          </div>
          <button className="btn btn-secondary" onClick={() => navigate('/openings')}>
            ← Retour aux ouvertures
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page opening-detail-page">
      <div className="opening-detail-container">
        <button
          className="btn btn-secondary opening-back-btn"
          onClick={() => navigate('/openings')}
          type="button"
        >
          ← Retour aux ouvertures
        </button>

        <div className="opening-detail-header">
          <div>
            <h1>{opening.name}</h1>
            <span className="opening-eco-badge opening-eco-badge-lg">{opening.ecoCode}</span>
          </div>
          <span className="opening-author">Par {opening.author}</span>
        </div>

        <div className="opening-detail-content">
          <div className="opening-detail-board">
            <ChessboardViewer moves={opening.moves} />
          </div>

          <div className="opening-detail-info">
            <div className="card">
              <h2>Description</h2>
              <p>{opening.description}</p>
            </div>

            <div className="card">
              <h2>Notation</h2>
              <p className="opening-moves-notation">{opening.moves}</p>
            </div>

            {!ctaDismissed && (
              <div className="opening-cta-card card">
                <button
                  className="opening-cta-close"
                  onClick={() => setCtaDismissed(true)}
                  aria-label="Fermer"
                  type="button"
                >
                  ✕
                </button>
                <p>
                  💡 Créez un compte pour sauvegarder vos ouvertures favorites et créer les vôtres !
                </p>
                <Link to="/register" className="btn btn-primary">
                  S&apos;inscrire gratuitement
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
