"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";
import { CATEGORIES_QUERY_KEY } from "./use-categories";

export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => categoryApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY });
    },
  });
}
