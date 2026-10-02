import React, { createContext, useContext, useMemo } from 'react';
import { TransactionApi } from '@data/transactions/api/TransactionApi.ts';
import { TransactionRepository } from '@data/transactions/repositories/TransactionRepository.ts';
import { GetTransactionsUseCase } from '@domain/transactions/usecases/get-transactions.usecase.ts';
import { CreateTransactionUseCase } from '@domain/transactions/usecases/create-transaction.usecase.ts';

import { AuthApi } from '@data/auth/api/AuthApi.ts';
import { AuthRepository } from '@data/auth/repositories/AuthRepository.ts';
import { LoginUseCase } from '@domain/auth/usecases/login.usecase.ts';
import { RegisterUseCase } from '@domain/auth/usecases/register.usecase.ts';
import { LogoutUseCase } from '@domain/auth/usecases/logout.usecase.ts';
import { RefreshSessionUseCase } from '@domain/auth/usecases/refresh-session.usecase.ts';
import { GetCurrentUserUseCase } from '@domain/auth/usecases/get-current-user.usecase.ts';

export interface TransactionDependencies {
  getTransactionsUseCase: GetTransactionsUseCase;
  createTransactionUseCase: CreateTransactionUseCase;
}

export interface AuthDependencies {
  loginUseCase: LoginUseCase;
  registerUseCase: RegisterUseCase;
  logoutUseCase: LogoutUseCase;
  refreshSessionUseCase: RefreshSessionUseCase;
  getCurrentUserUseCase: GetCurrentUserUseCase;
}

export interface AppDependencies {
  transactions: TransactionDependencies;
  auth: AuthDependencies;
}

export function createAppDependencies(): AppDependencies {
  // Transactions wiring
  const transactionApi = new TransactionApi();
  const transactionRepository = new TransactionRepository(transactionApi);
  const getTransactionsUseCase = new GetTransactionsUseCase(transactionRepository);
  const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository);

  // Auth wiring
  const authApi = new AuthApi();
  const authRepository = new AuthRepository(authApi);
  const loginUseCase = new LoginUseCase(authRepository);
  const registerUseCase = new RegisterUseCase(authRepository);
  const logoutUseCase = new LogoutUseCase(authRepository);
  const refreshSessionUseCase = new RefreshSessionUseCase(authRepository);
  const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

  return {
    transactions: {
      getTransactionsUseCase,
      createTransactionUseCase,
    },
    auth: {
      loginUseCase,
      registerUseCase,
      logoutUseCase,
      refreshSessionUseCase,
      getCurrentUserUseCase,
    },
  };
}

export const defaultAppDependencies = createAppDependencies();

const AppDependenciesContext = createContext<AppDependencies>(defaultAppDependencies);

export const CompositionRootProvider: React.FC<{
  children: React.ReactNode;
  dependencies?: AppDependencies;
}> = ({ children, dependencies }) => {
  const value = useMemo(
    () => dependencies ?? createAppDependencies(),
    [dependencies]
  );

  return (
    <AppDependenciesContext.Provider value={value}>
      {children}
    </AppDependenciesContext.Provider>
  );
};

export const useTransactionUseCases = (): TransactionDependencies => {
  const context = useContext(AppDependenciesContext);
  if (!context) {
    throw new Error('useTransactionUseCases must be used within CompositionRootProvider');
  }
  return context.transactions;
};

export const useAuthUseCases = (): AuthDependencies => {
  const context = useContext(AppDependenciesContext);
  if (!context) {
    throw new Error('useAuthUseCases must be used within CompositionRootProvider');
  }
  return context.auth;
};

// Aliases for compatibility
export const TransactionProvider = CompositionRootProvider;
