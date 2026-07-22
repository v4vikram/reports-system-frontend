import { z } from "zod";

// order isn't part of the form — it's managed by the reorder up/down actions
// in the section list, not hand-typed.
export const sectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
});

export type SectionFormValues = z.infer<typeof sectionSchema>;
