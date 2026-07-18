export interface Event {
  id: string;
  clientId: string;
  title: string;
  description: string | null;
  eventDate: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
