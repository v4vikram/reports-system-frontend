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
  createdAt: string;
  updatedAt: string;
}
