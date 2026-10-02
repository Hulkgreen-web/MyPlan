import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/AuthContext.tsx';
import { useTranslation } from 'react-i18next';

export function useLoginForm() {
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

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    error,
    handleSubmit,
  };
}

export function useRegisterForm() {
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

  return {
    t,
    email,
    setEmail,
    password,
    setPassword,
    name,
    setName,
    error,
    handleSubmit,
  };
}
