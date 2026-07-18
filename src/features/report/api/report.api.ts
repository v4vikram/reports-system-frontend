import { apiClient } from "@/lib/api-client";
import type { Report } from "../types";
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
  remove: (id: string) => apiClient.delete<null>(`/api/reports/${id}`),
};
