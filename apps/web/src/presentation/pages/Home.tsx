import React from 'react';
import { BudgetSection } from '@presentation/components/BudgetSection.tsx';
import { RecentTransactions } from '@presentation/components/transactions/components/RecentTransactions.tsx';
import { CreateTransactionModal } from '@presentation/components/transactions/components/CreateTransactionModal.tsx';
import { useHomePage } from '@presentation/hooks/useHomePage.ts';

export const HomePage: React.FC = () => {
  const {
    t,
    isEn,
    budget,
    handleAddBudget,
    recentTransactions,
    isLoading,
    error,
    isModalOpen,
    openModal,
    closeModal,
    handleTransactionCreated,
  } = useHomePage();

  return (
    <>
      <h1 className="text-5xl font-bold mb-4 tracking-tight">
        {t('home.welcome', { defaultValue: isEn ? 'Welcome' : 'Bienvenue' })}
      </h1>

      <BudgetSection
        budget={budget}
        onAddBudget={handleAddBudget}
      />

      {error && (
        <div className="alert alert-warning w-full max-w-3xl mb-4">
          <span>{error}</span>
        </div>
      )}

      <RecentTransactions
        transactions={recentTransactions}
        isLoading={isLoading}
        onAddClick={openModal}
      />

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleTransactionCreated}
      />
    </>
  );
};