import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Transaction, CreateTransactionParams } from '@domain/transactions/models/transaction.model.ts';
import { TransactionType } from 'shared';
import { useTransactionUseCases } from '@/CompositionRoot.tsx';

export interface UseCreateTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (transaction: Transaction) => void;
}

export function useCreateTransactionModal({
  onClose,
  onSuccess,
}: UseCreateTransactionModalProps) {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');
  const { createTransactionUseCase } = useTransactionUseCases();

  const todayStr = new Date().toISOString().split('T')[0];

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(todayStr);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setAmount('');
    setType(TransactionType.EXPENSE);
    setDate(todayStr);
    setError(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      setError(isEn ? 'Name is required' : 'Le nom est obligatoire');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError(isEn ? 'Amount must be greater than 0' : 'Le montant doit être supérieur à 0');
      return;
    }

    const params: CreateTransactionParams = {
      name: name.trim(),
      amount: Math.round(parsedAmount * 100) / 100,
      type,
      transactionDate: new Date(date),
    };

    setIsSubmitting(true);
    try {
      const created = await createTransactionUseCase.execute(params);
      resetForm();
      onSuccess?.(created);
      onClose();
    } catch (err: any) {
      setError(
        err.message ||
          (isEn ? 'Failed to create transaction' : 'Échec de la création de la transaction')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
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
  };
}
