import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from './transactions/useTransactions.ts';

export function useHomePage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [budget, setBudget] = useState(2299.50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { transactions, isLoading, error, fetchTransactions } = useTransactions();

  const handleAddBudget = (amount: number) => {
    setBudget((prevBudget) => prevBudget + amount);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTransactionCreated = () => {
    fetchTransactions();
  };

  return {
    t,
    isEn,
    budget,
    handleAddBudget,
    recentTransactions: transactions.slice(0, 5),
    isLoading,
    error,
    isModalOpen,
    openModal,
    closeModal,
    handleTransactionCreated,
  };
}
