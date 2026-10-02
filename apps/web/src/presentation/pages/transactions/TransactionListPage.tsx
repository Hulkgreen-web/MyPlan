import React from 'react';
import { useTransactionListPage } from '@presentation/hooks/transactions/useTransactionListPage.ts';
import { TransactionItem } from '@presentation/components/transactions/components/TransactionItem.tsx';
import { CreateTransactionModal } from '@presentation/components/transactions/components/CreateTransactionModal.tsx';

export const TransactionListPage: React.FC = () => {
  const {
    t,
    isEn,
    filteredTransactions,
    isLoading,
    error,
    filter,
    setFilter,
    isModalOpen,
    openModal,
    closeModal,
    handleTransactionCreated,
  } = useTransactionListPage();

  return (
    <div className="card bg-base-100 shadow-xl border border-base-content/10 w-full max-w-3xl">
      <div className="card-body p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center gap-3">
            <h1 className="card-title text-3xl font-bold text-base-content">
              {t('transactions.title', { defaultValue: 'Transactions' })}
            </h1>
            <span className="badge badge-neutral badge-lg font-semibold">
              {filteredTransactions.length}
            </span>
          </div>

          <button
            onClick={openModal}
            className="btn btn-primary gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            {t('transactions.new', { defaultValue: isEn ? 'New transaction' : 'Nouvelle transaction' })}
          </button>
        </div>

        {/* Filter Tabs */}
        <div role="tablist" className="tabs tabs-boxed w-fit mb-6 bg-base-200">
          <button
            role="tab"
            type="button"
            onClick={() => setFilter('all')}
            className={`tab ${filter === 'all' ? 'tab-active font-bold' : ''}`}
          >
            {t('transactions.filter_all', { defaultValue: isEn ? 'All' : 'Toutes' })}
          </button>
          <button
            role="tab"
            type="button"
            onClick={() => setFilter('income')}
            className={`tab ${filter === 'income' ? 'tab-active font-bold !bg-success !text-success-content' : ''}`}
          >
            {t('transactions.filter_income', { defaultValue: isEn ? 'Income' : 'Revenus' })}
          </button>
          <button
            role="tab"
            type="button"
            onClick={() => setFilter('expense')}
            className={`tab ${filter === 'expense' ? 'tab-active font-bold !bg-error !text-error-content' : ''}`}
          >
            {t('transactions.filter_expense', { defaultValue: isEn ? 'Expenses' : 'Dépenses' })}
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="alert alert-warning mb-6">
            <span>{error}</span>
          </div>
        )}

        {/* Transactions list */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="card bg-base-200/50 border border-dashed border-base-content/20 py-12 px-4 text-center items-center">
            <p className="text-base-content/60 mb-4">
              {t('transactions.no_transactions', {
                defaultValue: isEn ? 'No transactions yet.' : 'Aucune transaction pour le moment.',
              })}
            </p>
            <button
              onClick={openModal}
              className="btn btn-outline btn-primary btn-sm"
            >
              {t('transactions.create_title', {
                defaultValue: isEn ? 'Create transaction' : 'Créer une transaction',
              })}
            </button>
          </div>
        ) : (
          <ul className="space-y-3">
            {filteredTransactions.map((tx) => (
              <TransactionItem key={tx.id} transaction={tx} />
            ))}
          </ul>
        )}
      </div>

      <CreateTransactionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={handleTransactionCreated}
      />
    </div>
  );
};
