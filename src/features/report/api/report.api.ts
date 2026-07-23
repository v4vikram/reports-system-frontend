import { apiClient } from "@/lib/api-client";
import type { CoverPage, Report } from "../types";
import type { ReportFormValues } from "../validation";

export interface ReportsFilter {
  clientId?: string;
  eventId?: string;
}

export const reportApi = {
  list: (filter: ReportsFilter = {}) => apiClient.get<Report[]>("/api/reports", { params: filter }),
  getById: (id: string) => apiClient.get<Report>(`/api/reports/${id}`),
  create: (eventId: string, input: ReportFormValues) =>
    apiClient.post<Report>("/api/reports", { ...input, eventId }),
  update: (id: string, input: Partial<ReportFormValues>) =>
    apiClient.patch<Report>(`/api/reports/${id}`, input),
  // Separate from `update` — coverPages isn't part of ReportFormValues (the
  // edit-report form), it's driven by its own tab's own controls.
  updateCoverPages: (id: string, coverPages: CoverPage[]) =>
    apiClient.patch<Report>(`/api/reports/${id}`, { coverPages }),
  remove: (id: string) => apiClient.delete<null>(`/api/reports/${id}`),
};
