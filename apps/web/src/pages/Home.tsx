import React, { useState } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '../ThemeSelector.tsx';
import { Sidebar } from '../components/Sidebar.tsx';
import { BudgetSection } from '../components/BudgetSection.tsx';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export const HomePage = () => {
  const { i18n } = useTranslation();
  const { user, login, logout } = useAuth(); 
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [budget, setBudget] = useState(2299.50);

  const transactions: Transaction[] = [
    { id: '1', name: 'Salaire', amount: 2500.00, date: '2026-05-01', type: 'income' },
    { id: '2', name: 'Courses', amount: 120.50, date: '2026-05-15', type: 'expense' },
    { id: '3', name: 'Abonnement Internet', amount: 45.00, date: '2026-05-18', type: 'expense' },
    { id: '4', name: 'Remboursement', amount: 30.00, date: '2026-05-20', type: 'income' },
    { id: '5', name: 'Restaurant', amount: 65.00, date: '2026-05-22', type: 'expense' },
  ];

  const currentLang = i18n.language?.startsWith('en') ? 'EN' : 'FR';

  const toggleLanguage = () => {
    i18n.changeLanguage(currentLang === 'FR' ? 'en' : 'fr');
  };

  const handleAddBudget = (amount: number) => {
    setBudget(prevBudget => prevBudget + amount);
  };

  return (
    <div className="flex h-screen bg-base-300 text-base-content font-sans overflow-hidden">
      
      <Sidebar isOpen={isSidebarOpen} currentLang={currentLang} />

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        
        {/* Bouton Toggle Sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute top-6 left-6 z-20 p-2.5 bg-base-100 text-base-content hover:bg-base-200 rounded-full shadow-md border border-base-content/10 transition-all duration-200 hover:scale-105 active:scale-95"
          aria-label="Toggle Sidebar"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <header className="absolute top-0 right-0 p-6 flex items-center gap-4 z-10">
          
          {/* Nom de l'utilisateur (affiché à gauche des boutons s'il est connecté) */}
          {user && (
            <span className="text-lg font-semibold tracking-wide mr-2">{user.name}</span>
          )}

          <ThemeSelector />

          {/* Bouton de changement de langue */}
          <button 
            onClick={toggleLanguage} 
            className="px-3 py-1.5 bg-base-200 hover:bg-base-300 border border-base-content/20 rounded-md font-bold text-sm transition-all"
          >
            {currentLang}
          </button>

          {/* Boutons d'Authentification (Tout à droite) */}
          {user ? (
            <button 
              onClick={logout}
              className="px-4 py-1.5 bg-error text-error-content hover:opacity-90 rounded-md font-bold text-sm transition-all shadow-sm"
            >
              {currentLang === 'FR' ? 'Déconnexion' : 'Logout'}
            </button>
          ) : (
            <button 
              onClick={() => login({ email: 'test@example.com', password: 'password123' })}
              className="px-4 py-1.5 bg-primary text-primary-content hover:opacity-90 rounded-md font-bold text-sm transition-all shadow-sm"
            >
              {currentLang === 'FR' ? 'Connexion' : 'Login'}
            </button>
          )}

        </header>

        <section className="flex-1 flex flex-col items-center pt-32 pb-10 px-8">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            {currentLang === 'FR' ? 'Bienvenue' : 'Welcome'}
          </h1>
          
          {/* Composant Budget Isolé */}
          <BudgetSection 
            budget={budget} 
            currentLang={currentLang} 
            onAddBudget={handleAddBudget} 
          />

          <div className="w-full max-w-3xl bg-base-100 rounded-2xl p-8 border border-base-content/10 shadow-2xl">
            <h2 className="text-xl font-semibold mb-6 text-base-content">
              {currentLang === 'FR' ? 'Dernières transactions' : 'Latest transactions'}
            </h2>
            <ul className="space-y-3">
              {transactions.map((tx) => (
                <li key={tx.id} className="flex justify-between items-center bg-base-200 p-5 rounded-xl border border-base-content/5 hover:border-base-content/20 transition-colors">
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-lg">{tx.name}</span>
                    <span className="text-xs text-base-content/60">{tx.date}</span>
                  </div>
                  <span className={`font-bold text-xl ${tx.type === 'income' ? 'text-success' : 'text-error'}`}>
                    {tx.type === 'income' ? '+' : '-'}{tx.amount.toFixed(2)} €
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
};