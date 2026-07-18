import { apiClient } from "@/lib/api-client";
import type { Event } from "../types";
import type { EventFormValues } from "../validation";

export const eventApi = {
  list: (clientId: string) => apiClient.get<Event[]>("/api/events", { params: { clientId } }),
  getById: (id: string) => apiClient.get<Event>(`/api/events/${id}`),
  create: (clientId: string, input: EventFormValues) =>
    apiClient.post<Event>("/api/events", { ...input, clientId }),
  update: (id: string, input: Partial<EventFormValues> & { isActive?: boolean }) =>
    apiClient.patch<Event>(`/api/events/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/events/${id}`),
};
