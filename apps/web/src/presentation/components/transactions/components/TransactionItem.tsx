import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { TransactionType } from 'shared';
import { Transaction } from '@domain/transactions/models/transaction.model.ts';

interface TransactionItemProps {
  transaction: Transaction;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({ transaction }) => {
  const { i18n } = useTranslation();
  const isIncome = transaction.type === TransactionType.INCOME;

  const formattedDate = useMemo(() => {
    try {
      return transaction.transactionDate.toLocaleDateString(
        i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }
      );
    } catch {
      return String(transaction.transactionDate);
    }
  }, [transaction.transactionDate, i18n.language]);

  return (
    <li className="flex justify-between items-center bg-base-200 p-4 rounded-box border border-base-content/5 hover:border-base-content/20 transition-colors">
      <div className="flex flex-col gap-0.5">
        <span className="font-semibold text-lg text-base-content">{transaction.name}</span>
        <span className="text-xs text-base-content/60">{formattedDate}</span>
      </div>
      <div
        className={`badge badge-lg font-bold py-3.5 px-4 text-base ${
          isIncome ? 'badge-success text-success-content' : 'badge-error text-error-content'
        }`}
      >
        {isIncome ? '+' : '-'}{transaction.amount.toFixed(2)} €
      </div>
    </li>
  );
};
