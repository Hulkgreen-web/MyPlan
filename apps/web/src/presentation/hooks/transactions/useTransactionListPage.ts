import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTransactions } from './useTransactions.ts';

export function useTransactionListPage() {
  const { t, i18n } = useTranslation();
  const isEn = i18n.language?.startsWith('en');

  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    filteredTransactions,
    isLoading,
    error,
    filter,
    setFilter,
    fetchTransactions,
  } = useTransactions();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTransactionCreated = () => {
    fetchTransactions();
  };

  return {
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
  };
}
