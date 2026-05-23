import React, { useState } from 'react';

interface BudgetSectionProps {
  budget: number;
  currentLang: string;
  onAddBudget: (amount: number) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ budget, currentLang, onAddBudget }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [budgetInput, setBudgetInput] = useState('');

  const openModal = () => setIsModalOpen(true);
  
  const closeModal = () => {
    setIsModalOpen(false);
    setBudgetInput('');
  };

  const handleSubmitBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(budgetInput);
    if (!isNaN(amount) && amount > 0) {
      onAddBudget(amount);
      closeModal(); 
    }
  };

  return (
    <>
      <div className="text-center mb-16">
        <p className="text-base-content/60 text-sm uppercase tracking-widest mb-2">
          {currentLang === 'FR' ? 'Budget Restant' : 'Remaining Budget'}
        </p>
        
        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="text-5xl text-primary font-extrabold">
            {budget.toFixed(2)} €
          </p>
          
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-base-100 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-base-content/10 text-left">
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
    </>
  );
};