import { z } from "zod";

export const eventSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  description: z.string().max(2000).nullable(),
  eventDate: z.string().nullable(),
});

export type EventFormValues = z.infer<typeof eventSchema>;
