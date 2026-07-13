import { apiClient } from "@/lib/api-client";
import type { Category } from "../types";
import type { CreateCategoryFormValues, UpdateCategoryFormValues } from "../validation";

export const categoryApi = {
  list: () => apiClient.get<Category[]>("/api/categories"),
  create: (input: CreateCategoryFormValues) =>
    apiClient.post<Category>("/api/categories", input),
  update: (id: string, input: UpdateCategoryFormValues) =>
    apiClient.patch<Category>(`/api/categories/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/categories/${id}`),
};
