import { apiClient } from "@/lib/api-client";
import type { Employee, Permission, Role } from "../types";

export interface CreateEmployeeInput {
  name: string;
  email: string;
  password: string;
}

// Calls the backend's generic /api/users, /api/roles, and /api/permissions
// endpoints — the "Employee" framing is a frontend-only concern (this
// business runs on employees managing clients, so that's the vocabulary
// the UI uses), not a separate backend resource.
export const employeeApi = {
  list: () => apiClient.get<Employee[]>("/api/users"),
  create: (input: CreateEmployeeInput) => apiClient.post<Employee>("/api/users", input),
  remove: (id: string) => apiClient.delete<null>(`/api/users/${id}`),
  update: (id: string, input: { isActive: boolean }) =>
    apiClient.patch<Employee>(`/api/users/${id}`, input),
  assignRoles: (id: string, roleIds: string[]) =>
    apiClient.put<Employee>(`/api/users/${id}/roles`, { roleIds }),
  assignPermissions: (id: string, permissionIds: string[]) =>
    apiClient.put<Employee>(`/api/users/${id}/permissions`, { permissionIds }),
  listRoles: () => apiClient.get<Role[]>("/api/roles"),
  listPermissions: () => apiClient.get<Permission[]>("/api/permissions"),
};
