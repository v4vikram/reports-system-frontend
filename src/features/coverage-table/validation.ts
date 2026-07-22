import { z } from "zod";

export const coverageTableSchema = z.object({
  category: z.string().max(80).nullable(),
});
export type CoverageTableFormValues = z.infer<typeof coverageTableSchema>;

export const coverageRowSchema = z.object({
  srNo: z.number().int().min(0),
  headline: z.string().max(500).nullable(),
  publication: z.string().max(200).nullable(),
  edition: z.string().max(120).nullable(),
  pageNo: z.string().max(20).nullable(),
  // react-hook-form works with plain strings for date inputs; converted to
  // ISO at the API boundary in report.api-adjacent hooks.
  date: z.string().nullable(),
  link: z.string().max(2000).nullable(),
  image: z.string().max(2000).nullable(),
  isTopCoverage: z.boolean(),
});
export type CoverageRowFormValues = z.infer<typeof coverageRowSchema>;
