import React from 'react';
import { useTranslation } from 'react-i18next';
import { RegisterForm } from '@presentation/components/auth/components/RegisterForm.tsx';

export const RegisterPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="hero min-h-screen bg-base-300 text-base-content">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold">{t('register.title')}</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
};
