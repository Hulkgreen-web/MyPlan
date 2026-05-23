import React from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs opacity-50 font-bold uppercase tracking-widest">Langue</span>
      <select 
        className="select select-bordered select-sm select-secondary focus:outline-none" 
        value={i18n.language} 
        onChange={(e) => changeLanguage(e.target.value)}
      >
        <option value="fr">Français</option>
        <option value="en">English</option>
      </select>
    </div>
  );
};
