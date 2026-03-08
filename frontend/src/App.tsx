import { type FC, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoadingSpinner } from './components/common/LoadingSpinner';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OpeningsListPage } from './pages/OpeningsListPage';
import { OpeningDetailPage } from './pages/OpeningDetailPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateOpeningPage } from './pages/CreateOpeningPage';
import { EditOpeningPage } from './pages/EditOpeningPage';

export const App: FC = () => {
  const { loadUser, loading, accessToken } = useAuthStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  if (loading && accessToken) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="openings" element={<OpeningsListPage />} />
          <Route path="openings/:id" element={<OpeningDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="openings/new"
            element={
              <ProtectedRoute>
                <CreateOpeningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="openings/:id/edit"
            element={
              <ProtectedRoute>
                <EditOpeningPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
