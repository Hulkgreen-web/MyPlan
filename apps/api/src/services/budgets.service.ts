import { SqlEntityManager } from "@mikro-orm/postgresql";
import { BudgetResponse, UpdateBudget } from "shared";
import { Budget } from "../entities/Budget.js";

export class BudgetsService {
    constructor(private readonly em: SqlEntityManager) {}

    async findById(userId: string): Promise<BudgetResponse> {
        const budget = await this.em.findOne(Budget, { user: userId });

        if (!budget) {
            const error = new Error('Budget not found');
            (error as any).statusCode = 404;
            throw error;
        }

        return this.mapToResponse(budget);
    }

    async addMoneyToBudget(userId: string, data: UpdateBudget): Promise<BudgetResponse> {
        const budget = await this.em.findOne(Budget, { user: userId });

        if (!budget) {
            const error = new Error('Budget not found');
            (error as any).statusCode = 404;
            throw error;
        }

        const newAmount = budget.amount + data.amount;

        this.em.assign(budget, { amount: newAmount });

        await this.em.flush();

        return this.mapToResponse(budget);
    }

    async dropMoneyFromBudget(userId: string, data: UpdateBudget): Promise<BudgetResponse> {
        const budget = await this.em.findOne(Budget, { user: userId });

        if (!budget) {
            const error = new Error('Budget not found');
            (error as any).statusCode = 404;
            throw error;
        }

        const newAmount = budget.amount - data.amount;

        this.em.assign(budget, { amount: newAmount });

        await this.em.flush();

        return this.mapToResponse(budget);
    }

    async resetBudget(userId: string): Promise<BudgetResponse> {
        const budget = await this.em.findOne(Budget, { user: userId });

        if (!budget) {
            const error = new Error('Budget not found');
            (error as any).statusCode = 404;
            throw error;
        }

        const newAmount = 0

        this.em.assign(budget, { amount: newAmount });

        await this.em.flush();

        return this.mapToResponse(budget);
    }

    private mapToResponse(budget: Budget): BudgetResponse {
        return {
            id: budget.id,
            amount: budget.amount,
            updatedAt: budget.updatedAt,
        };
    }
}