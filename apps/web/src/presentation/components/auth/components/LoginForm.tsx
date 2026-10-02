import React from 'react';
import { Link } from 'react-router-dom';
import { useLoginForm } from '@presentation/hooks/auth/useAuthForms.ts';

export const LoginForm: React.FC = () => {
  const { t, email, setEmail, password, setPassword, error, handleSubmit } = useLoginForm();

  return (
    <div className="card w-full shadow-2xl bg-base-100 border border-base-content/10">
      <form onSubmit={handleSubmit} className="card-body">
        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">{t('login.email')}</span>
          </label>
          <input
            type="email"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full focus:input-primary"
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-semibold">{t('login.password')}</span>
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full focus:input-primary"
            required
          />
        </div>
        <div className="form-control mt-8">
          <button type="submit" className="btn btn-primary">{t('login.submit')}</button>
        </div>
        <p className="mt-4 text-center text-sm">
          {t('login.no_account')} <Link to="/register" className="link link-primary">{t('login.register')}</Link>
        </p>
      </form>
    </div>
  );
};
