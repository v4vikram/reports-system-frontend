export interface Client {
  id: string;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  isActive: boolean;
  assignedUserId: string | null;
  // The CLIENT-role user who logs in as this client, if any. Distinct from
  // assignedUserId (the employee who manages this client).
  portalUserId: string | null;
  createdAt: string;
  updatedAt: string;
}
