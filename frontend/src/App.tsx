import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiErrorNotifier } from './components/ApiErrorNotifier';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { OpeningsListPage } from './pages/OpeningsListPage';
import { OpeningDetailPage } from './pages/OpeningDetailPage';
import { DashboardPage } from './pages/DashboardPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ApiErrorNotifier />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/openings" element={<OpeningsListPage />} />
            <Route path="/openings/:id" element={<OpeningDetailPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

