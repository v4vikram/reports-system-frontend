import { apiClient } from "@/lib/api-client";
import type { CoverageRow } from "../types";
import type { CoverageRowFormValues } from "../validation";

export const coverageRowApi = {
  create: (coverageTableId: string, input: CoverageRowFormValues) =>
    apiClient.post<CoverageRow>("/api/coverage-rows", { ...input, coverageTableId }),
  update: (id: string, input: Partial<CoverageRowFormValues>) =>
    apiClient.patch<CoverageRow>(`/api/coverage-rows/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/coverage-rows/${id}`),
};
