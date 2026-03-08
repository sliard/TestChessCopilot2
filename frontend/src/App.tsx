import { Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { OpeningsListPage } from '@/pages/openings/OpeningsListPage';
import { OpeningDetailPage } from '@/pages/openings/OpeningDetailPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { MyOpeningsPage } from '@/pages/MyOpeningsPage';
import { CreateOpeningPage } from '@/pages/CreateOpeningPage';
import { EditOpeningPage } from '@/pages/EditOpeningPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/openings" element={<OpeningsListPage />} />
        <Route path="/openings/:id" element={<OpeningDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-openings" element={<MyOpeningsPage />} />
          <Route path="/openings/new" element={<CreateOpeningPage />} />
          <Route path="/openings/:id/edit" element={<EditOpeningPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
