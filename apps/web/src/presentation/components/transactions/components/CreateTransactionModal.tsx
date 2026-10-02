import React from 'react';
import { Transaction } from '@domain/transactions/models/transaction.model.ts';
import { TransactionType } from 'shared';
import { useCreateTransactionModal } from '@presentation/hooks/transactions/useCreateTransactionModal.ts';

export interface CreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: Transaction) => void;
}

export const CreateTransactionModal: React.FC<CreateTransactionModalProps> = (props) => {
  const {
    t,
    isEn,
    name,
    setName,
    amount,
    setAmount,
    type,
    setType,
    date,
    setDate,
    isSubmitting,
    error,
    handleSubmit,
    handleClose,
  } = useCreateTransactionModal(props);

  if (!props.isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box relative">
        <button
          type="button"
          onClick={handleClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="font-bold text-2xl text-base-content mb-6">
          {t('transactions.create_title', {
            defaultValue: isEn ? 'New Transaction' : 'Nouvelle transaction',
          })}
        </h3>

        {error && (
          <div className="alert alert-error text-sm mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control w-full">
            <div className="join w-full grid grid-cols-2">
              <button
                type="button"
                onClick={() => setType(TransactionType.EXPENSE)}
                className={`btn join-item ${
                  type === TransactionType.EXPENSE ? 'btn-error' : 'btn-ghost bg-base-200'
                }`}
              >
                {t('transactions.type_expense', { defaultValue: isEn ? 'Expense' : 'Dépense' })}
              </button>
              <button
                type="button"
                onClick={() => setType(TransactionType.INCOME)}
                className={`btn join-item ${
                  type === TransactionType.INCOME ? 'btn-success' : 'btn-ghost bg-base-200'
                }`}
              >
                {t('transactions.type_income', { defaultValue: isEn ? 'Income' : 'Revenu' })}
              </button>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                {t('transactions.label_name', { defaultValue: isEn ? 'Description' : 'Description' })}
              </span>
            </label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={isEn ? 'e.g. Groceries, Salary' : 'Ex: Courses, Salaire'}
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                {t('transactions.label_amount', { defaultValue: isEn ? 'Amount (€)' : 'Montant (€)' })}
              </span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="input input-bordered w-full"
            />
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text font-medium">
                {t('transactions.label_date', { defaultValue: isEn ? 'Date' : 'Date' })}
              </span>
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input input-bordered w-full"
            />
          </div>

          <div className="modal-action">
            <button type="button" onClick={handleClose} className="btn btn-ghost">
              {t('common.cancel', { defaultValue: isEn ? 'Cancel' : 'Annuler' })}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !amount}
              className="btn btn-primary"
            >
              {isSubmitting && <span className="loading loading-spinner loading-xs"></span>}
              {t('transactions.submit_create', { defaultValue: isEn ? 'Create' : 'Créer' })}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop" onClick={handleClose}>
        <button type="button">close</button>
      </form>
    </dialog>
  );
};
