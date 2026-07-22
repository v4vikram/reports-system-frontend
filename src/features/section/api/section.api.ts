import { apiClient } from "@/lib/api-client";
import type { Section } from "../types";
import type { SectionFormValues } from "../validation";

export const sectionApi = {
  list: (reportId: string) => apiClient.get<Section[]>("/api/sections", { params: { reportId } }),
  create: (reportId: string, input: SectionFormValues & { order?: number }) =>
    apiClient.post<Section>("/api/sections", { ...input, reportId }),
  update: (id: string, input: Partial<SectionFormValues & { order: number }>) =>
    apiClient.patch<Section>(`/api/sections/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/sections/${id}`),
};
