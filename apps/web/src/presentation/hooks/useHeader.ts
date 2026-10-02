import { useAuth } from '@/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

export function useHeader() {
  const { user, login, logout } = useAuth();
  const { i18n, t } = useTranslation();

  const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'FR';

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'FR' ? 'en' : 'fr');
  };

  const handleLoginDemo = () => {
    login({ email: 'test@example.com', password: 'password123' });
  };

  return {
    user,
    t,
    currentLang,
    toggleLanguage,
    login: handleLoginDemo,
    logout,
  };
}
