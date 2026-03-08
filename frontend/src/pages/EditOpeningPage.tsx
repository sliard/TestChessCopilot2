import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { OpeningForm } from '../components/OpeningForm';
import { userOpeningService } from '../services/userOpeningService';
import { SkeletonPage } from '../components/Skeleton';
import type { UpdateOpeningRequest, UserOpening } from '../types/opening';

export const EditOpeningPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [opening, setOpening] = useState<UserOpening | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOpening = async () => {
      try {
        const data = await userOpeningService.getOpening(id);
        setOpening(data);
      } catch {
        setError('Opening not found.');
      } finally {
        setLoadingData(false);
      }
    };
    fetchOpening();
  }, [id]);

  const handleSubmit = async (data: UpdateOpeningRequest) => {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      await userOpeningService.updateOpening(id, data);
      navigate('/my-openings');
    } catch {
      setError('Failed to update opening. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) return <SkeletonPage />;

  if (!opening) {
    return (
      <div className="page">
        <div className="alert alert-error">{error || 'Opening not found.'}</div>
        <button className="btn btn-outline" onClick={() => navigate('/my-openings')}>
          ← Back to my openings
        </button>
      </div>
    );
  }

  return (
    <div className="page edit-opening-page">
      <h1>Edit Opening</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <OpeningForm
        initialValues={{
          name: opening.name,
          description: opening.description || '',
          ecoCode: opening.ecoCode || '',
          moves: opening.moves,
          isPublic: opening.isPublic,
        }}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/my-openings')}
        submitLabel="Save Changes"
        loading={saving}
      />
    </div>
  );
};
