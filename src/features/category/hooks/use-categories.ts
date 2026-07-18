"use client";

import { useQuery } from "@tanstack/react-query";
import { categoryApi } from "../api/category.api";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export function useCategories(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoryApi.list,
    enabled: options?.enabled,
  });
}
