"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import type { CreateCategoryFormValues } from "../validation";
import { CATEGORIES_QUERY_KEY } from "./use-categories";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateCategoryFormValues) => categoryApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
