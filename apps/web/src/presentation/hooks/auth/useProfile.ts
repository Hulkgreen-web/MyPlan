import { useState } from 'react';
import { useAuth } from '@/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

export function useProfile() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyUserId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return {
    user,
    t,
    logout,
    copyUserId,
    copied,
  };
}
