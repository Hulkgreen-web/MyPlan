import React from 'react';
import { useTranslation } from 'react-i18next';

export const SavingsPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  return (
    <div className="text-center p-12 bg-base-100 rounded-2xl border border-base-content/10 shadow-xl max-w-md">
      <h3 className="text-2xl font-bold mb-2">
        {t('savings.coming_soon', { defaultValue: isEn ? 'Coming soon!' : 'Bientôt disponible !' })}
      </h3>
      <p className="text-base-content/60">
        {t('savings.description', {
          defaultValue: isEn
            ? 'This section is currently under development.'
            : 'Cette section est en cours de développement.',
        })}
      </p>
    </div>
  );
};
