import React, { useState } from 'react';
import { useAuth } from '../AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { ThemeSelector } from '../ThemeSelector.tsx';
import { MyPlanLogo } from '../components/logo/MyPlanLogo.tsx';

interface Transaction {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: 'income' | 'expense';
}

export const HomePage = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  
  // États de la page
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [budget, setBudget] = useState(2299.50);
  
  // États pour la popup d'ajout de budget
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

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

  // Fonctions pour gérer la modale
  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setBudgetInput(''); // On vide le champ quand on ferme
  };

  const handleSubmitBudget = (e: React.FormEvent) => {
    e.preventDefault(); // Empêche le rechargement de la page
    const amount = parseFloat(budgetInput);
    
    if (!isNaN(amount) && amount > 0) {
      setBudget(prevBudget => prevBudget + amount);
      closeModal(); 
    }
  };

  return (
    <div className="flex h-screen bg-base-300 text-base-content font-sans overflow-hidden">
      
      {/* Sidebar avec transition sur la largeur */}
      <aside 
        className={`bg-base-100 flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden border-base-content/10 ${
          isSidebarOpen ? 'w-64 border-r opacity-100' : 'w-0 border-none opacity-0'
        }`}
      >
        <div className="w-64 flex flex-col items-center py-8">
          
          {/* Conteneur du logo */}
          <div className="w-full shrink-0 mb-10 mt-2 flex justify-center px-4">
            <MyPlanLogo className="w-52 h-auto drop-shadow-sm" />
          </div>
          
          <nav className="flex flex-col w-full px-4 gap-2">
            {/* Lien Accueil */}
            <a href="#" className="flex items-center gap-3 p-3 bg-primary text-primary-content rounded-lg font-semibold shadow-lg shadow-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {currentLang === 'FR' ? 'Accueil' : 'Home'}
            </a>
            
            {/* Lien Transactions */}
            <a href="#" className="flex items-center gap-3 p-3 text-base-content/70 hover:bg-base-200 hover:text-base-content rounded-lg font-medium transition-colors whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {currentLang === 'FR' ? 'Transactions' : 'Transactions'}
            </a>
            
            {/* Lien Épargne */}
            <a href="#" className="flex items-center gap-3 p-3 text-base-content/70 hover:bg-base-200 hover:text-base-content rounded-lg font-medium transition-colors whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {currentLang === 'FR' ? 'Épargne' : 'Savings'}
            </a>
            
            {/* Lien Profil */}
            <a href="#" className="flex items-center gap-3 p-3 text-base-content/70 hover:bg-base-200 hover:text-base-content rounded-lg font-medium transition-colors whitespace-nowrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {currentLang === 'FR' ? 'Profil' : 'Profile'}
            </a>
          </nav>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-y-auto">
        
        {/* Bouton Toggle Sidebar Amélioré (Flottant, Rond, Dynamique) */}
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

        <header className="absolute top-0 right-0 p-6 flex items-center gap-6 z-10">
          <span className="text-lg font-semibold tracking-wide">{user?.name || 'Matteo'}</span>
          
          <ThemeSelector />

          <button 
            onClick={toggleLanguage} 
            className="px-3 py-1.5 bg-base-200 hover:bg-base-300 border border-base-content/20 rounded-md font-bold text-sm transition-all"
          >
            {currentLang}
          </button>
        </header>

        <section className="flex-1 flex flex-col items-center pt-32 pb-10 px-8">
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
            {currentLang === 'FR' ? 'Bienvenue' : 'Welcome'}
          </h1>
          
          <div className="text-center mb-16">
            <p className="text-base-content/60 text-sm uppercase tracking-widest mb-2">
              {currentLang === 'FR' ? 'Budget Restant' : 'Remaining Budget'}
            </p>
            
            {/* Conteneur Flex pour aligner le budget et le bouton d'ajout */}
            <div className="flex items-center justify-center gap-4 mt-2">
              <p className="text-5xl text-primary font-extrabold">
                {budget.toFixed(2)} €
              </p>
              
              {/* Bouton Ajouter au budget qui ouvre la modale */}
              <button 
                onClick={openModal}
                className="w-10 h-10 flex items-center justify-center bg-primary text-primary-content rounded-full shadow-lg hover:shadow-primary/30 hover:scale-110 active:scale-95 transition-all duration-200"
                title={currentLang === 'FR' ? 'Ajouter au budget' : 'Add to budget'}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>

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

      {/* MODALE D'AJOUT DE BUDGET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-base-100 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-base-content/10">
            <h3 className="text-2xl font-bold mb-6 text-base-content">
              {currentLang === 'FR' ? 'Ajouter au budget' : 'Add to budget'}
            </h3>
            
            <form onSubmit={handleSubmitBudget}>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-base-content/70">
                  {currentLang === 'FR' ? 'Montant à ajouter (€) :' : 'Amount to add (€):'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  autoFocus
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Ex: 150.00"
                  className="w-full p-3 bg-base-200 text-base-content border border-base-content/20 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-base-200 hover:bg-base-300 text-base-content rounded-lg font-medium transition-colors"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!budgetInput || parseFloat(budgetInput) <= 0}
                  className="px-5 py-2.5 bg-primary text-primary-content hover:opacity-90 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentLang === 'FR' ? 'Ajouter' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};  