import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext.tsx';
import { LoginPage, RegisterPage } from './pages/Auth.tsx';
import { HomePage  } from './pages/Home.tsx';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
  if (!user) return <Navigate to="/login" />;

  return <>{children}</>;
};

export default function App() {
  React.useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'nord';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
