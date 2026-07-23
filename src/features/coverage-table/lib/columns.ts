import { COVERAGE_COLUMNS } from "../types";

export type ColumnKey = (typeof COVERAGE_COLUMNS)[number]["key"];

// Layout hints keyed off the same fixed column set the backend validates
// hiddenColumns against (COVERAGE_COLUMN_KEYS) — there's no user-defined
// column here, so a switch/lookup over this closed set is simpler to
// maintain than a generic render-registry with only nine call sites.
export const COLUMN_WIDTH: Record<ColumnKey, string> = {
  srNo: "w-14",
  isTopCoverage: "w-12",
  headline: "min-w-56",
  publication: "min-w-36",
  edition: "min-w-28",
  pageNo: "w-20",
  date: "w-36",
  link: "min-w-40",
  image: "w-16",
};

export const COLUMN_ALIGN_CENTER: Partial<Record<ColumnKey, true>> = {
  isTopCoverage: true,
  image: true,
};
