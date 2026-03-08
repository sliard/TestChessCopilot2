import { useParams, Link } from 'react-router-dom';
import { usePublicOpening } from '../hooks/usePublicOpening';
import { ChessboardViewer } from '../components/chess/ChessboardViewer';
import { SkeletonPage } from '../components/Skeleton';

export const OpeningDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { opening, loading, error } = usePublicOpening(id);

  if (loading) return <SkeletonPage />;

  if (error || !opening) {
    return (
      <div className="page">
        <div className="alert alert-error">
          Opening not found or failed to load.
        </div>
        <Link to="/openings" className="btn btn-outline">← Back to openings</Link>
      </div>
    );
  }

  return (
    <div className="page opening-detail-page">
      <Link to="/openings" className="back-link">← Back to openings</Link>

      <div className="opening-detail">
        <div className="opening-detail__header">
          <h1>{opening.name}</h1>
          {opening.ecoCode && <span className="eco-badge">{opening.ecoCode}</span>}
        </div>

        <div className="opening-detail__layout">
          <div className="opening-detail__board">
            <ChessboardViewer moves={opening.moves || ''} />
          </div>

          <div className="opening-detail__info">
            {opening.description && (
              <div className="opening-detail__section">
                <h3>Description</h3>
                <p>{opening.description}</p>
              </div>
            )}

            <div className="opening-detail__section">
              <h3>Details</h3>
              <dl className="detail-list">
                {opening.ecoCode && (
                  <>
                    <dt>ECO Code</dt>
                    <dd>{opening.ecoCode}</dd>
                  </>
                )}
                <dt>Moves</dt>
                <dd>{opening.moves}</dd>
                <dt>Author</dt>
                <dd>{opening.author}</dd>
                <dt>Created</dt>
                <dd>{new Date(opening.createdAt).toLocaleDateString()}</dd>
              </dl>
            </div>

            <div className="cta-box">
              <p>💡 Create an account to save your favorite openings and create your own!</p>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up Free</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
