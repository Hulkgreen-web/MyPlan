import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MyPlanLogo } from './logo/MyPlanLogo.tsx';

interface SidebarProps {
  isOpen: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 p-3 rounded-lg font-semibold transition-all text-left w-full ${
      isActive
        ? 'bg-primary text-primary-content shadow-lg shadow-primary/20'
        : 'text-base-content/70 hover:bg-base-200 hover:text-base-content font-medium'
    }`;

  return (
    <aside
      className={`bg-base-100 flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden border-base-content/10 ${
        isOpen ? 'w-64 border-r opacity-100' : 'w-0 border-none opacity-0'
      }`}
    >
      <div className="w-64 flex flex-col items-center py-8">
        <div className="w-full shrink-0 mb-10 mt-2 flex justify-center px-4">
          <MyPlanLogo className="w-52 h-auto drop-shadow-sm" />
        </div>

        <nav className="flex flex-col w-full px-4 gap-2">
          <NavLink to="/" end className={getNavLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('nav.home', { defaultValue: isEn ? 'Home' : 'Accueil' })}
          </NavLink>

          <NavLink to="/transactions" className={getNavLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            {t('nav.transactions', { defaultValue: 'Transactions' })}
          </NavLink>

          <NavLink to="/savings" className={getNavLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {t('nav.savings', { defaultValue: isEn ? 'Savings' : 'Épargne' })}
          </NavLink>

          <NavLink to="/profile" className={getNavLinkClass}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {t('nav.profile', { defaultValue: isEn ? 'Profile' : 'Profil' })}
          </NavLink>
        </nav>
      </div>
    </aside>
  );
};