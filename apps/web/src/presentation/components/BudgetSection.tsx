import React from 'react';
import { useBudgetSection } from '../hooks/useBudgetSection.ts';

export interface BudgetSectionProps {
  budget: number;
  currentLang?: string;
  onAddBudget: (amount: number) => void;
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({
  budget,
  currentLang: propLang,
  onAddBudget,
}) => {
  const {
    currentLang,
    isModalOpen,
    budgetInput,
    setBudgetInput,
    openModal,
    closeModal,
    handleSubmitBudget,
  } = useBudgetSection({ currentLang: propLang, onAddBudget });

  return (
    <>
      <div className="text-center mb-16">
        <p className="text-base-content/60 text-sm uppercase tracking-widest mb-2 font-medium">
          {currentLang === 'FR' ? 'Budget Restant' : 'Remaining Budget'}
        </p>

        <div className="flex items-center justify-center gap-4 mt-2">
          <p className="text-5xl text-primary font-extrabold">{budget.toFixed(2)} €</p>

          <button
            onClick={openModal}
            className="btn btn-circle btn-primary btn-md shadow-lg hover:scale-110 active:scale-95 transition-all"
            title={currentLang === 'FR' ? 'Ajouter au budget' : 'Add to budget'}
            aria-label="Add to budget"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {isModalOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box relative">
            <button
              type="button"
              onClick={closeModal}
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
              aria-label="Close"
            >
              ✕
            </button>

            <h3 className="font-bold text-2xl text-base-content mb-6">
              {currentLang === 'FR' ? 'Ajouter au budget' : 'Add to budget'}
            </h3>

            <form onSubmit={handleSubmitBudget} className="flex flex-col gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-medium">
                    {currentLang === 'FR' ? 'Montant à ajouter (€) :' : 'Amount to add (€):'}
                  </span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  autoFocus
                  required
                  value={budgetInput}
                  onChange={(e) => setBudgetInput(e.target.value)}
                  placeholder="Ex: 150.00"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-ghost"
                >
                  {currentLang === 'FR' ? 'Annuler' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={!budgetInput || parseFloat(budgetInput) <= 0}
                  className="btn btn-primary"
                >
                  {currentLang === 'FR' ? 'Ajouter' : 'Add'}
                </button>
              </div>
            </form>
          </div>

          <form method="dialog" className="modal-backdrop" onClick={closeModal}>
            <button type="button">close</button>
          </form>
        </dialog>
      )}
    </>
  );
};