import { apiClient } from "@/lib/api-client";
import type { Client } from "../types";
import type { ClientFormValues } from "../validation";

export const clientApi = {
  list: () => apiClient.get<Client[]>("/api/clients"),
  create: (input: ClientFormValues) => apiClient.post<Client>("/api/clients", input),
  update: (id: string, input: Partial<ClientFormValues> & { isActive?: boolean }) =>
    apiClient.patch<Client>(`/api/clients/${id}`, input),
  remove: (id: string) => apiClient.delete<null>(`/api/clients/${id}`),
};
