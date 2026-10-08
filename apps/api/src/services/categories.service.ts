import { SqlEntityManager } from '@mikro-orm/postgresql';
import { CreateCategory, UpdateCategory, CategoryResponse } from 'shared';
import { Category } from '../entities/Category.js';

export class CategoriesService {
  constructor(private readonly em: SqlEntityManager) {}

  /**
   * Récupère toutes les catégories avec leurs transactions associées.
   */
  async findAll(): Promise<CategoryResponse[]> {
    const categories = await this.em.find(
      Category,
      {},
      {
        populate: ['transactions'] as any,
        orderBy: { name: 'ASC' } as any,
      }
    );

    return categories.map((category) => this.mapToResponse(category));
  }

  /**
   * Récupère une catégorie par son identifiant.
   */
  async findById(id: string): Promise<CategoryResponse> {
    const category = await this.em.findOneOrFail(
      Category,
      id,
      { populate: ['transactions'] as any }
    );

    return this.mapToResponse(category);
  }

  /**
   * Crée une nouvelle catégorie.
   */
  async create(data: CreateCategory): Promise<CategoryResponse> {
    const category = new Category(data.name, data.estimatedAmount);

    this.em.persist(category);
    await this.em.flush();

    return this.mapToResponse(category);
  }

  /**
   * Met à jour une catégorie existante.
   */
  async update(id: string, data: UpdateCategory): Promise<CategoryResponse> {
    const category = await this.em.findOneOrFail(
      Category,
      id,
      { populate: ['transactions'] as any }
    );

    this.em.assign(category, data);
    await this.em.flush();

    return this.mapToResponse(category);
  }

  /**
   * Supprime une catégorie par son identifiant.
   */
  async delete(id: string): Promise<void> {
    const category = await this.em.findOneOrFail(Category, id);
    this.em.remove(category);
    await this.em.flush();
  }

  /**
   * Mappe l'entité Category vers le schéma de réponse CategoryResponse.
   */
  private mapToResponse(category: Category): CategoryResponse {
    const transactionIds = Array.isArray(category.transactions)
      ? category.transactions.map((t: any) => (typeof t === 'string' ? t : t.id))
      : category.transactions?.isInitialized?.()
      ? category.transactions.getItems().map((t) => t.id)
      : [];

    return {
      id: category.id,
      name: category.name,
      estimatedAmount: category.estimatedAmount,
      transactions: transactionIds,
    };
  }
}