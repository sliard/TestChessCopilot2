import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApiErrorNotifier } from './components/ApiErrorNotifier';
import { AuthProvider } from './components/AuthProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { OpeningsListPage } from './pages/OpeningsListPage';
import { OpeningDetailPage } from './pages/OpeningDetailPage';
import { MyOpeningsPage } from './pages/MyOpeningsPage';
import { CreateOpeningPage } from './pages/CreateOpeningPage';
import { EditOpeningPage } from './pages/EditOpeningPage';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Navbar />
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
            <Route
              path="/my-openings"
              element={
                <ProtectedRoute>
                  <MyOpeningsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/openings/new"
              element={
                <ProtectedRoute>
                  <CreateOpeningPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/openings/:id/edit"
              element={
                <ProtectedRoute>
                  <EditOpeningPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

