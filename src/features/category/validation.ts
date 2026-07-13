import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  parentId: z.string().nullable(),
  description: z.string().max(500).nullable(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryFormValues = z.infer<typeof updateCategorySchema>;
