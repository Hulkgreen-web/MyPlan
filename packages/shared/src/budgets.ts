import { z } from 'zod';

export const BudgetSchema = z.object({
    id: z.string(),
    amount: z.number().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Amount must have at most 2 decimal places',
    }),
});

export const UpdateBudgetSchema = BudgetSchema.pick({
    amount: true,
});

export const BudgetResponseSchema = z.object({
    id: z.string(),
    amount: z.number(),
    updatedAt: z.coerce.date(),
});

export type Budget = z.infer<typeof BudgetSchema>;
export type UpdateBudget = z.infer<typeof UpdateBudgetSchema>;
export type BudgetResponse = z.infer<typeof BudgetResponseSchema>;