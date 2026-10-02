import React from 'react';
import { ThemeSelector } from '@/ThemeSelector.tsx';
import { useHeader } from '@presentation/hooks/useHeader.ts';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isSidebarOpen, onToggleSidebar }) => {
  const { user, t, currentLang, toggleLanguage, login, logout } = useHeader();

  return (
    <>
      <button
        onClick={onToggleSidebar}
        className="absolute top-6 left-6 z-20 p-2.5 bg-base-100 text-base-content hover:bg-base-200 rounded-full shadow-md border border-base-content/10 transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label="Toggle Sidebar"
      >
        {isSidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      <header className="absolute top-0 right-0 p-6 flex items-center gap-4 z-10">
        {user && (
          <span className="text-lg font-semibold tracking-wide mr-2">{user.name}</span>
        )}

        <ThemeSelector />

        <button
          onClick={toggleLanguage}
          className="px-3 py-1.5 bg-base-200 hover:bg-base-300 border border-base-content/20 rounded-md font-bold text-sm transition-all"
        >
          {currentLang}
        </button>

        {user ? (
          <button
            onClick={logout}
            className="px-4 py-1.5 bg-error text-error-content hover:opacity-90 rounded-md font-bold text-sm transition-all shadow-sm"
          >
            {t('auth.logout', { defaultValue: currentLang === 'FR' ? 'Déconnexion' : 'Logout' })}
          </button>
        ) : (
          <button
            onClick={login}
            className="px-4 py-1.5 bg-primary text-primary-content hover:opacity-90 rounded-md font-bold text-sm transition-all shadow-sm"
          >
            {t('auth.login', { defaultValue: currentLang === 'FR' ? 'Connexion' : 'Login' })}
          </button>
        )}
      </header>
    </>
  );
};
