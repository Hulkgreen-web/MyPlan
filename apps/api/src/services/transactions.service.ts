import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Transaction } from '../entities/Transaction.js';
import { User } from '../entities/User.js';
import { Category } from '../entities/Category.js';
import { CreateTransaction, UpdateTransaction, TransactionResponse } from 'shared';

export class TransactionsService {
  constructor(private readonly em: SqlEntityManager) {}

  /**
   * Récupère toutes les transactions appartenant à un utilisateur, triées par date décroissante.
   */
  async findAll(userId: string): Promise<TransactionResponse[]> {
    const transactions = await this.em.find(
      Transaction,
      { user: userId },
      {
        orderBy: { transactionDate: 'DESC' } as any,
        populate: ['category'] as any,
      }
    );

    return transactions.map((transaction) => this.mapToResponse(transaction));
  }

  /**
   * Récupère une transaction spécifique par son identifiant pour un utilisateur donné.
   */
  async findById(userId: string, id: string): Promise<TransactionResponse> {
    const transaction = await this.em.findOneOrFail(
      Transaction,
      { id, user: userId },
      { populate: ['category'] as any }
    );

    return this.mapToResponse(transaction);
  }

  /**
   * Crée une nouvelle transaction pour un utilisateur avec sa catégorie.
   */
  async create(userId: string, data: CreateTransaction): Promise<TransactionResponse> {
    const user = await this.em.findOneOrFail(User, userId);
    const category = await this.em.findOneOrFail(Category, data.category);

    const transaction = new Transaction(
      data.name,
      data.transactionDate,
      data.amount,
      data.type,
      user,
      category
    );

    this.em.persist(transaction);
    await this.em.flush();

    return this.mapToResponse(transaction);
  }

  /**
   * Met à jour une transaction existante.
   */
  async update(userId: string, id: string, data: UpdateTransaction): Promise<TransactionResponse> {
    const transaction = await this.em.findOneOrFail(
      Transaction,
      { id, user: userId },
      { populate: ['category'] as any }
    );

    if (data.category) {
      const category = await this.em.findOneOrFail(Category, data.category);
      transaction.category = category;
    }

    const { category: _category, ...rest } = data;
    this.em.assign(transaction, rest);

    await this.em.flush();

    return this.mapToResponse(transaction);
  }

  /**
   * Supprime une transaction.
   */
  async delete(userId: string, id: string): Promise<void> {
    const transaction = await this.em.findOneOrFail(Transaction, { id, user: userId });
    this.em.remove(transaction);
    await this.em.flush();
  }

  /**
   * Mappe l'entité Transaction vers le schéma de réponse TransactionResponse.
   */
  private mapToResponse(transaction: Transaction): TransactionResponse {
    return {
      id: transaction.id,
      name: transaction.name,
      transactionDate: transaction.transactionDate,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category?.name ?? '',
    };
  }
}
