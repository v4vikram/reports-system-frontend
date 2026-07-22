export interface CoverageRow {
  id: string;
  coverageTableId: string;
  srNo: number;
  headline: string | null;
  publication: string | null;
  edition: string | null;
  pageNo: string | null;
  date: string | null;
  link: string | null;
  image: string | null;
  isTopCoverage: boolean;
  order: number;
}

export interface ScreenshotItem {
  url: string;
  caption: string | null;
  order: number;
}

export interface CoverageTable {
  id: string;
  sectionId: string;
  category: string | null;
  order: number;
  hiddenColumns: string[];
  screenshots: ScreenshotItem[];
  rows: CoverageRow[];
}

// Must match backend/src/modules/coverageTables/coverageTables.validation.ts's
// COVERAGE_COLUMN_KEYS.
export const COVERAGE_COLUMNS = [
  { key: "srNo", label: "Sr No" },
  { key: "isTopCoverage", label: "Top" },
  { key: "headline", label: "Headline" },
  { key: "publication", label: "Publication" },
  { key: "edition", label: "Edition" },
  { key: "pageNo", label: "Page No" },
  { key: "date", label: "Date" },
  { key: "link", label: "Link" },
  { key: "image", label: "Image" },
] as const;
