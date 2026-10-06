import { http, HttpResponse, delay } from 'msw';

const STORAGE_KEYS = {
  USERS: 'myplan_demo_users',
  SESSION: 'myplan_demo_session',
  TRANSACTIONS: 'myplan_demo_transactions',
  LOGGED_OUT: 'myplan_demo_logged_out',
};

const INITIAL_USER = {
  id: 'usr_demo_42',
  email: 'demo@myplan.local',
  name: 'Arnaud Démo',
  password: 'password123',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
};

const INITIAL_TRANSACTIONS = [
  {
    id: 'tx_demo_01',
    name: 'Salaire mensuel',
    amount: 3200,
    type: 'income',
    transactionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_demo_02',
    name: 'Loyer appartement',
    amount: 850,
    type: 'expense',
    transactionDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_demo_03',
    name: 'Courses Carrefour',
    amount: 142.3,
    type: 'expense',
    transactionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_demo_04',
    name: 'Abonnement Internet & Mobile',
    amount: 49.99,
    type: 'expense',
    transactionDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_demo_05',
    name: 'Vente vélo occasion',
    amount: 150,
    type: 'income',
    transactionDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'tx_demo_06',
    name: 'Restaurant entre amis',
    amount: 58,
    type: 'expense',
    transactionDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface MockUser {
  id: string;
  email: string;
  name: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface MockTransaction {
  id: string;
  name: string;
  amount: number;
  type: string;
  transactionDate: string;
}

interface MockSession {
  user: {
    id: string;
    email: string;
    name: string;
    createdAt?: string;
  };
  accessToken: string;
}

function getStoredUsers(): MockUser[] {
  const data = localStorage.getItem(STORAGE_KEYS.USERS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([INITIAL_USER]));
    return [INITIAL_USER];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [INITIAL_USER];
  }
}

function saveStoredUsers(users: MockUser[]): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function getStoredTransactions(): MockTransaction[] {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return [...INITIAL_TRANSACTIONS];
  }
  try {
    return JSON.parse(data);
  } catch {
    return [...INITIAL_TRANSACTIONS];
  }
}

function saveStoredTransactions(transactions: MockTransaction[]): void {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

function getStoredSession(): MockSession | null {
  const isLoggedOut = localStorage.getItem(STORAGE_KEYS.LOGGED_OUT) === 'true';
  if (isLoggedOut) {
    return null;
  }
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!data) {
    // Default initial demo session to allow instantaneous navigation
    const defaultSession: MockSession = {
      user: {
        id: INITIAL_USER.id,
        email: INITIAL_USER.email,
        name: INITIAL_USER.name,
        createdAt: INITIAL_USER.createdAt,
      },
      accessToken: 'demo-token-initial',
    };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(defaultSession));
    return defaultSession;
  }
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

function setStoredSession(session: MockSession): void {
  localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

function clearStoredSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
  localStorage.setItem(STORAGE_KEYS.LOGGED_OUT, 'true');
}

export const handlers = [
  // --- AUTH HANDLERS ---
  http.post('*/auth/login', async ({ request }) => {
    await delay(50);
    const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string };
    const { email, password } = body;

    const users = getStoredUsers();
    const user = users.find((u) => u.email.toLowerCase() === email?.toLowerCase());

    if (!user || (user.password && user.password !== password)) {
      return HttpResponse.json(
        { message: 'Identifiants invalides' },
        { status: 401 }
      );
    }

    const session: MockSession = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
      },
      accessToken: `demo-token-${Date.now()}`,
    };

    setStoredSession(session);

    return HttpResponse.json({
      message: 'Connexion réussie',
      user: session.user,
      accessToken: session.accessToken,
    });
  }),

  http.post('*/auth/register', async ({ request }) => {
    await delay(50);
    const body = (await request.json().catch(() => ({}))) as { email?: string; password?: string; name?: string };
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return HttpResponse.json(
        { message: 'Champs requis manquants' },
        { status: 400 }
      );
    }

    const users = getStoredUsers();
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return HttpResponse.json(
        { message: 'Cet email est déjà utilisé' },
        { status: 409 }
      );
    }

    const newUser: MockUser = {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      email,
      name,
      password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveStoredUsers(users);

    return HttpResponse.json(
      { message: 'Compte créé avec succès' },
      { status: 201 }
    );
  }),

  http.post('*/auth/logout', async () => {
    await delay(50);
    clearStoredSession();
    return HttpResponse.json({ message: 'Déconnexion réussie' });
  }),

  http.post('*/auth/refresh', async () => {
    await delay(50);
    const session = getStoredSession();
    if (!session) {
      return HttpResponse.json(
        { message: 'Session expirée' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: session.user,
      accessToken: session.accessToken,
    });
  }),

  http.get('*/auth/me', async () => {
    await delay(50);
    const session = getStoredSession();
    if (!session) {
      return HttpResponse.json(
        { message: 'Utilisateur non authentifié' },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      user: session.user,
    });
  }),

  // --- TRANSACTIONS HANDLERS ---
  http.get('*/transactions', async () => {
    await delay(50);
    const transactions = getStoredTransactions();
    return HttpResponse.json(transactions);
  }),

  http.post('*/transactions', async ({ request }) => {
    await delay(50);
    const body = (await request.json().catch(() => ({}))) as {
      name?: string;
      amount?: number;
      type?: string;
      transactionDate?: string;
    };

    if (!body.name || body.amount === undefined || !body.type) {
      return HttpResponse.json(
        { message: 'Données de transaction incomplètes' },
        { status: 400 }
      );
    }

    const newTransaction: MockTransaction = {
      id: `tx_${Math.random().toString(36).substring(2, 9)}`,
      name: body.name,
      amount: Number(body.amount),
      type: body.type,
      transactionDate: body.transactionDate
        ? new Date(body.transactionDate).toISOString()
        : new Date().toISOString(),
    };

    const transactions = getStoredTransactions();
    transactions.unshift(newTransaction);
    saveStoredTransactions(transactions);

    return HttpResponse.json(newTransaction, { status: 201 });
  }),

  http.patch('*/transactions/:id', async ({ params, request }) => {
    await delay(50);
    const { id } = params;
    const body = (await request.json().catch(() => ({}))) as Partial<MockTransaction>;

    const transactions = getStoredTransactions();
    const index = transactions.findIndex((tx) => tx.id === id);

    if (index === -1) {
      return HttpResponse.json(
        { message: 'Transaction introuvable' },
        { status: 404 }
      );
    }

    const updatedTransaction = {
      ...transactions[index],
      ...body,
      amount: body.amount !== undefined ? Number(body.amount) : transactions[index].amount,
    };

    transactions[index] = updatedTransaction;
    saveStoredTransactions(transactions);

    return HttpResponse.json(updatedTransaction);
  }),

  http.delete('*/transactions/:id', async ({ params }) => {
    await delay(50);
    const { id } = params;
    const transactions = getStoredTransactions();
    const filtered = transactions.filter((tx) => tx.id !== id);

    if (filtered.length === transactions.length) {
      return HttpResponse.json(
        { message: 'Transaction introuvable' },
        { status: 404 }
      );
    }

    saveStoredTransactions(filtered);
    return HttpResponse.json({ message: 'Transaction supprimée avec succès' });
  }),

  // --- USERS HANDLERS ---
  http.get('*/users', async () => {
    await delay(50);
    const users = getStoredUsers().map(({ password, ...u }) => u);
    return HttpResponse.json(users);
  }),
];
