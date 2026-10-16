import { z } from 'zod';
import { TransactionType } from './utils/type-transaction.js';

export const TransactionSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(100),
    transactionDate: z.coerce.date().default(() => new Date()),
    amount: z.number().positive().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Amount must have at most 2 decimal places',
    }),
    type: z.nativeEnum(TransactionType),
    category: z.string(),
});

export const CreateTransactionSchema = TransactionSchema.pick({
    name: true,
    transactionDate: true,
    amount: true,
    type: true,
    category: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export const TransactionResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    transactionDate: z.coerce.date(),
    amount: z.number(),
    type: z.string(),
    category: z.string(),
});

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
export type TransactionResponse = z.infer<typeof TransactionResponseSchema>;