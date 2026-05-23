import React, { useState } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-300 text-base-content">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold">{t('login.title')}</h1>
        </div>
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
      </div>
    </div>
  );
};

export const RegisterPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register({ email, password, name });
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="hero min-h-screen bg-base-300 text-base-content">
      <div className="hero-content flex-col w-full max-w-md">
        <div className="text-center mb-4">
          <h1 className="text-4xl font-bold">{t('register.title')}</h1>
        </div>
        <div className="card w-full shadow-2xl bg-base-100 border border-base-content/10">
          <form onSubmit={handleSubmit} className="card-body">
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">{t('register.name')}</span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">{t('register.email')}</span>
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
                <span className="label-text font-semibold">{t('register.password')}</span>
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
              <button type="submit" className="btn btn-secondary">{t('register.submit')}</button>
            </div>
            <p className="mt-4 text-center text-sm">
              {t('register.has_account')} <Link to="/login" className="link link-primary">{t('register.login')}</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};
