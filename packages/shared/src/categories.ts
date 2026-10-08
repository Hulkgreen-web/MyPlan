import z from "zod";


export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    estimatedAmount: z.number().positive().refine((val) => /^\d+(\.\d{1,2})?$/.test(val.toString()), {
        message: 'Amount must have at most 2 decimal places',
    }),
    transactions: z.array(z.string()),
});

export const CreateCategorySchema = CategorySchema.pick({
    name: true,
    estimatedAmount: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export const CategoryResponseSchema = z.object({
    id: z.string(),
    name: z.string(),
    estimatedAmount: z.number(),
    transactions: z.array(z.string()),
});

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;