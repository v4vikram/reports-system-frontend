export interface Report {
  id: string;
  title: string;
  content: string | null;
  clientId: string;
  eventId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  // Resolved by the backend — a portal-linked client can see who worked on
  // their report without needing users:read (see backend reports.types.ts).
  assignees: { id: string; name: string }[];
}
