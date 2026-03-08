import type { FC } from 'react';
import { useParams } from 'react-router-dom';
import { CreateOpeningPage } from './CreateOpeningPage';

export const EditOpeningPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  return <CreateOpeningPage editId={id} />;
};
