import { apiClient } from "@/lib/api-client";
import type { CoverageTable, ScreenshotItem } from "../types";
import type { CoverageTableFormValues } from "../validation";

export interface UpdateCoverageTableInput extends Partial<CoverageTableFormValues> {
  order?: number;
  hiddenColumns?: string[];
  screenshots?: ScreenshotItem[];
}

export const coverageTableApi = {
  list: (sectionId: string) =>
    apiClient.get<CoverageTable[]>("/api/coverage-tables", { params: { sectionId } }),
  create: (sectionId: string, input: CoverageTableFormValues & { order?: number }) =>
    apiClient.post<CoverageTable>("/api/coverage-tables", { ...input, sectionId }),
  update: (id: string, input: UpdateCoverageTableInput) =>
    apiClient.patch<CoverageTable>(`/api/coverage-tables/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/coverage-tables/${id}`),
};
