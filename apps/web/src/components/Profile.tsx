import React from 'react';
import { useAuth } from '../AuthContext.tsx';
import { useTranslation } from 'react-i18next';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-base-100 rounded-2xl border border-base-content/10 shadow-xl max-w-md mx-auto">
        <span className="loading loading-spinner loading-lg text-primary mb-4"></span>
        <p className="text-base-content/70 font-medium">Loading user profile...</p>
      </div>
    );
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="w-full max-w-2xl bg-base-100 rounded-3xl border border-base-content/10 shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-primary/5">
      {/* Header section with cover gradient */}
      <div className="h-32 bg-gradient-to-r from-primary via-secondary to-accent relative opacity-90"></div>
      
      {/* Profile info section */}
      <div className="px-8 pb-8 relative flex flex-col items-center">
        {/* Avatar */}
        <div className="-mt-16 mb-4 relative">
          <div className="w-28 h-28 rounded-full border-4 border-base-100 shadow-xl bg-neutral text-neutral-content flex items-center justify-center text-3xl font-bold">
            {getInitials(user.name)}
          </div>
          <span className="absolute bottom-1.5 right-1.5 block h-4 w-4 rounded-full ring-2 ring-base-100 bg-success" />
        </div>

        {/* User identification */}
        <h2 className="text-3xl font-extrabold tracking-tight text-base-content">{user.name}</h2>
        <p className="text-sm font-medium text-base-content/50 mt-1">{user.email}</p>
        
        <div className="badge badge-primary badge-outline mt-3 font-semibold px-4 py-2.5">
          {t('profile.title')}
        </div>

        <div className="w-full border-t border-base-content/10 my-6"></div>

        {/* Profile details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full text-left">
          {/* Name Field */}
          <div className="bg-base-200 p-4 rounded-2xl border border-base-content/5">
            <span className="text-xs text-base-content/50 font-bold uppercase tracking-wider block mb-1">
              {t('profile.name')}
            </span>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold text-base-content">{user.name}</span>
            </div>
          </div>

          {/* Email Field */}
          <div className="bg-base-200 p-4 rounded-2xl border border-base-content/5">
            <span className="text-xs text-base-content/50 font-bold uppercase tracking-wider block mb-1">
              {t('profile.email')}
            </span>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold text-base-content truncate">{user.email}</span>
            </div>
          </div>

          {/* User ID Field */}
          <div className="bg-base-200 p-4 rounded-2xl border border-base-content/5 md:col-span-2">
            <span className="text-xs text-base-content/50 font-bold uppercase tracking-wider block mb-1">
              User ID (API)
            </span>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="font-mono text-sm text-base-content/70 truncate">{user.id}</span>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(user.id)}
                className="btn btn-ghost btn-xs btn-circle hover:bg-base-300"
                title="Copy ID"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-base-content/10 my-6"></div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-end">
          <button 
            type="button"
            className="btn btn-outline btn-neutral rounded-xl px-6"
          >
            {t('profile.change_password')}
          </button>
          <button 
            onClick={logout}
            type="button"
            className="btn btn-error text-error-content rounded-xl px-6 shadow-md shadow-error/10"
          >
            {t('todo.logout')}
          </button>
        </div>
      </div>
    </div>
  );
};