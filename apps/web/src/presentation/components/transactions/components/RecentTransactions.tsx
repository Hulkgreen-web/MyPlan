import React from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionItem } from './TransactionItem.tsx';
import { Transaction } from '@domain/transactions/models/transaction.model.ts';

interface RecentTransactionsProps {
  transactions: Transaction[];
  isLoading?: boolean;
  onAddClick?: () => void;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
  isLoading,
  onAddClick,
}) => {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  return (
    <div className="card bg-base-100 shadow-xl border border-base-content/10 w-full max-w-3xl">
      <div className="card-body p-6 sm:p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-xl font-bold text-base-content">
            {t('home.recent_transactions', { defaultValue: isEn ? 'Latest transactions' : 'Dernières transactions' })}
          </h2>
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="btn btn-sm btn-primary gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              {t('transactions.new', { defaultValue: isEn ? 'New' : 'Nouveau' })}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-md text-primary"></span>
          </div>
        ) : transactions.length === 0 ? (
          <p className="text-base-content/60 text-center py-4">
            {t('home.no_transactions', { defaultValue: isEn ? 'No recent transactions' : 'Aucune transaction récente' })}
          </p>
        ) : (
          <ul className="space-y-3">
            {transactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
