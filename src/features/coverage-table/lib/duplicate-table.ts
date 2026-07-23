import { coverageRowApi } from "../api/coverage-row.api";
import { coverageTableApi } from "../api/coverage-table.api";
import type { CoverageTable } from "../types";

// Sequential create calls (create the table, replace its column/screenshot
// config, then create each row) rather than a bulk endpoint — fine for a
// human-triggered occasional action (duplicating a table, or a whole
// section's tables), not a hot path. Shared by TableCard's own "Duplicate
// table" action and SectionCard's "Duplicate section" (which duplicates
// every table inside it the same way).
export async function duplicateCoverageTable(
  targetSectionId: string,
  table: CoverageTable,
  overrides?: { category?: string | null; order?: number }
) {
  const newTable = await coverageTableApi.create(targetSectionId, {
    category: overrides?.category !== undefined ? overrides.category : table.category,
    order: overrides?.order ?? table.order,
  });
  await coverageTableApi.update(newTable.id, {
    hiddenColumns: table.hiddenColumns,
    screenshots: table.screenshots,
  });
  const sortedRows = [...table.rows].sort((a, b) => a.order - b.order);
  for (const row of sortedRows) {
    await coverageRowApi.create(newTable.id, {
      srNo: row.srNo,
      headline: row.headline,
      publication: row.publication,
      edition: row.edition,
      pageNo: row.pageNo,
      date: row.date,
      link: row.link,
      image: row.image,
      isTopCoverage: row.isTopCoverage,
    });
  }
  return newTable;
}
