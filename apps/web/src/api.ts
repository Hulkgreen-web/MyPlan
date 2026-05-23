const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let accessToken: string | null = localStorage.getItem('accessToken');

export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
};

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    ...options.headers,
  };

  let response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include', // Important pour envoyer/recevoir les cookies (Refresh Token)
  });

  // Si on reçoit une 401, on tente de rafraîchir le token
  if (response.status === 401 && !endpoint.includes('/auth/refresh')) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const { accessToken: newToken } = await refreshRes.json();
      setAccessToken(newToken);
      
      // On re-tente la requête initiale avec le nouveau token
      return fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${newToken}`,
        },
        credentials: 'include',
      });
    }
  }

  return response;
};
