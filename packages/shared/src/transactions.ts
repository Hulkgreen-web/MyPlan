import { z } from 'zod';
import { TransactionType } from './utils/type-transaction.js';

export const TransactionSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1).max(100),
    transactionDate: z.coerce.date().default(() => new Date()),
    amount: z.number().positive().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Amount must have at most 2 decimal places',
    }),
    type: z.nativeEnum(TransactionType),
});

export const CreateTransactionSchema = TransactionSchema.pick({
    name: true,
    transactionDate: true,
    amount: true,
    type: true,
});

export const UpdateTransactionSchema = CreateTransactionSchema.partial();

export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;