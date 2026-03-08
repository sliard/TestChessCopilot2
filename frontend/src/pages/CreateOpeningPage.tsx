import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OpeningForm } from '../components/OpeningForm';
import { userOpeningService } from '../services/userOpeningService';
import type { CreateOpeningRequest } from '../types/opening';

export const CreateOpeningPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateOpeningRequest) => {
    setLoading(true);
    setError(null);
    try {
      await userOpeningService.createOpening(data);
      navigate('/my-openings');
    } catch {
      setError('Failed to create opening. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page create-opening-page">
      <h1>Create New Opening</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <OpeningForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/my-openings')}
        submitLabel="Create"
        loading={loading}
      />
    </div>
  );
};
