import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface UseBudgetSectionProps {
  currentLang?: string;
  onAddBudget: (amount: number) => void;
}

export function useBudgetSection({ currentLang: propLang, onAddBudget }: UseBudgetSectionProps) {
  const { i18n } = useTranslation();
  const currentLang = propLang ?? (i18n.language?.startsWith('en') ? 'EN' : 'FR');
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

  return {
    currentLang,
    isModalOpen,
    budgetInput,
    setBudgetInput,
    openModal,
    closeModal,
    handleSubmitBudget,
  };
}
