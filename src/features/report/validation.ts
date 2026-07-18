import { z } from "zod";

export const reportSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  content: z.string().max(20000).nullable(),
  categoryId: z.string().min(1, "Category is required"),
  // No .default([]) — an array default makes zod's input type diverge from
  // its output type (optional vs required), which zodResolver can't
  // reconcile against useForm<ReportFormValues>. The empty-array default is
  // supplied via useForm's defaultValues instead.
  assigneeUserIds: z.array(z.string()),
});

export type ReportFormValues = z.infer<typeof reportSchema>;
