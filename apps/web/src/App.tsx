import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/AuthContext.tsx';
import { CompositionRootProvider } from '@/CompositionRoot.tsx';
import { LoginPage, RegisterPage } from '@presentation/pages/auth/Auth.tsx';
import { HomePage } from '@presentation/pages/Home.tsx';
import { TransactionListPage } from '@presentation/pages/transactions/TransactionListPage.tsx';
import { SavingsPage } from '@presentation/pages/Savings.tsx';
import { ProfilePage } from '@presentation/pages/auth/ProfilePage.tsx';
import { AppLayout } from '@presentation/components/AppLayout.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'nord';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <CompositionRootProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/" element={<HomePage />} />
              <Route path="/transactions" element={<TransactionListPage />} />
              <Route path="/savings" element={<SavingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CompositionRootProvider>
  );
}
