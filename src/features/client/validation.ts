import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
  company: z.string().max(160).nullable(),
  email: z.email("Invalid email address").nullable(),
  phone: z.string().max(40).nullable(),
  address: z.string().max(500).nullable(),
  notes: z.string().max(2000).nullable(),
  assignedUserId: z.string().nullable(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
