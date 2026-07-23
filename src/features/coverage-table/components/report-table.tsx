"use client";

import { StarIcon } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { env } from "@/lib/env";
import { useCreateCoverageRow } from "../hooks/use-create-coverage-row";
import { useDeleteCoverageRow } from "../hooks/use-delete-coverage-row";
import { useUpdateCoverageRow } from "../hooks/use-update-coverage-row";
import { useCellBuffer } from "../hooks/use-cell-buffer";
import { COLUMN_ALIGN_CENTER, COLUMN_WIDTH } from "../lib/columns";
import { COVERAGE_COLUMNS, type CoverageRow, type CoverageTable } from "../types";
import { ImageUploadField } from "./image-upload-field";
import { RowActions } from "./row-actions";

function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

interface ReportTableProps {
  table: CoverageTable;
  canEdit: boolean;
  canDelete: boolean;
}

export function ReportTable({ table, canEdit, canDelete }: ReportTableProps) {
  const updateRow = useUpdateCoverageRow();
  const createRow = useCreateCoverageRow(table.id);
  const deleteRow = useDeleteCoverageRow();

  const isVisible = (key: string) => !table.hiddenColumns.includes(key);
  const visibleColumns = COVERAGE_COLUMNS.filter((c) => isVisible(c.key));
  const showActions = canEdit || canDelete;
  const rows = [...table.rows].sort((a, b) => a.order - b.order);

  function commit(rowId: string, field: string, value: unknown) {
    updateRow.mutate({ id: rowId, input: { [field]: value } });
  }

  function duplicateRow(row: CoverageRow) {
    const maxSrNo = table.rows.reduce((max, r) => Math.max(max, r.srNo), 0);
    createRow.mutate({
      srNo: maxSrNo + 1,
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

  if (rows.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No rows yet.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted/60 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent">
            {visibleColumns.map((col) => (
              <TableHead
                key={col.key}
                className={cn(
                  "h-8 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase",
                  COLUMN_WIDTH[col.key],
                  COLUMN_ALIGN_CENTER[col.key] && "text-center"
                )}
              >
                {col.label}
              </TableHead>
            ))}
            {showActions && (
              <TableHead className="h-8 w-24 py-1 text-right text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <GridRow
              key={row.id}
              row={row}
              isVisible={isVisible}
              canEdit={canEdit}
              canDelete={canDelete}
              showActions={showActions}
              onCommit={(field, value) => commit(row.id, field, value)}
              onDuplicate={() => duplicateRow(row)}
              onDelete={() => deleteRow.mutate(row.id)}
              duplicating={createRow.isPending}
              deleting={deleteRow.isPending}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

interface GridRowProps {
  row: CoverageRow;
  isVisible: (key: string) => boolean;
  canEdit: boolean;
  canDelete: boolean;
  showActions: boolean;
  onCommit: (field: string, value: unknown) => void;
  onDuplicate: () => void;
  onDelete: () => void;
  duplicating: boolean;
  deleting: boolean;
}

// Own component (not inlined in the .map above) because each text cell needs
// its own useCellBuffer — hooks can't be called a variable number of times
// inside a loop in the parent.
function GridRow({
  row,
  isVisible,
  canEdit,
  canDelete,
  showActions,
  onCommit,
  onDuplicate,
  onDelete,
  duplicating,
  deleting,
}: GridRowProps) {
  const srNo = useCellBuffer(String(row.srNo), (v) => {
    const n = Number(v);
    if (Number.isFinite(n)) onCommit("srNo", n);
  });
  const headline = useCellBuffer(row.headline ?? "", (v) => onCommit("headline", v || null));
  const publication = useCellBuffer(row.publication ?? "", (v) => onCommit("publication", v || null));
  const edition = useCellBuffer(row.edition ?? "", (v) => onCommit("edition", v || null));
  const pageNo = useCellBuffer(row.pageNo ?? "", (v) => onCommit("pageNo", v || null));
  const date = useCellBuffer(row.date ? row.date.slice(0, 10) : "", (v) => onCommit("date", v || null));
  const link = useCellBuffer(row.link ?? "", (v) => onCommit("link", v || null));

  const cellInputClass =
    "h-7 w-full rounded-md border-none bg-transparent px-2 text-[13px] shadow-none focus-visible:bg-background focus-visible:ring-1";

  return (
    <TableRow className="[&>td]:py-0.5">
      {isVisible("srNo") && (
        <TableCell className={COLUMN_WIDTH.srNo}>
          <Input
            type="number"
            disabled={!canEdit}
            className={cellInputClass}
            value={srNo.value}
            onChange={(e) => srNo.onChange(e.target.value)}
            onFocus={srNo.onFocus}
            onBlur={srNo.onBlur}
          />
        </TableCell>
      )}
      {isVisible("isTopCoverage") && (
        <TableCell className={cn(COLUMN_WIDTH.isTopCoverage, "text-center")}>
          <button
            type="button"
            disabled={!canEdit}
            onClick={() => onCommit("isTopCoverage", !row.isTopCoverage)}
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md transition-colors disabled:pointer-events-none",
              row.isTopCoverage
                ? "text-amber-400"
                : "text-muted-foreground/40 hover:bg-muted hover:text-muted-foreground"
            )}
            aria-label={row.isTopCoverage ? "Remove from top coverage" : "Mark as top coverage"}
          >
            <StarIcon className={cn("size-3.5", row.isTopCoverage && "fill-current")} />
          </button>
        </TableCell>
      )}
      {isVisible("headline") && (
        <TableCell className={COLUMN_WIDTH.headline}>
          <Input
            disabled={!canEdit}
            className={cellInputClass}
            placeholder="Headline…"
            value={headline.value}
            onChange={(e) => headline.onChange(e.target.value)}
            onFocus={headline.onFocus}
            onBlur={headline.onBlur}
          />
        </TableCell>
      )}
      {isVisible("publication") && (
        <TableCell className={COLUMN_WIDTH.publication}>
          <Input
            disabled={!canEdit}
            className={cellInputClass}
            placeholder="Publication…"
            value={publication.value}
            onChange={(e) => publication.onChange(e.target.value)}
            onFocus={publication.onFocus}
            onBlur={publication.onBlur}
          />
        </TableCell>
      )}
      {isVisible("edition") && (
        <TableCell className={COLUMN_WIDTH.edition}>
          <Input
            disabled={!canEdit}
            className={cellInputClass}
            placeholder="Edition…"
            value={edition.value}
            onChange={(e) => edition.onChange(e.target.value)}
            onFocus={edition.onFocus}
            onBlur={edition.onBlur}
          />
        </TableCell>
      )}
      {isVisible("pageNo") && (
        <TableCell className={COLUMN_WIDTH.pageNo}>
          <Input
            disabled={!canEdit}
            className={cellInputClass}
            placeholder="Page#"
            value={pageNo.value}
            onChange={(e) => pageNo.onChange(e.target.value)}
            onFocus={pageNo.onFocus}
            onBlur={pageNo.onBlur}
          />
        </TableCell>
      )}
      {isVisible("date") && (
        <TableCell className={COLUMN_WIDTH.date}>
          <Input
            type="date"
            disabled={!canEdit}
            className={cn(cellInputClass, "[color-scheme:dark]")}
            value={date.value}
            onChange={(e) => date.onChange(e.target.value)}
            onFocus={date.onFocus}
            onBlur={date.onBlur}
          />
        </TableCell>
      )}
      {isVisible("link") && (
        <TableCell className={COLUMN_WIDTH.link}>
          <Input
            disabled={!canEdit}
            className={cn(cellInputClass, "text-blue-400")}
            placeholder="https://…"
            value={link.value}
            onChange={(e) => link.onChange(e.target.value)}
            onFocus={link.onFocus}
            onBlur={link.onBlur}
          />
        </TableCell>
      )}
      {isVisible("image") && (
        <TableCell className={cn(COLUMN_WIDTH.image, "text-center")}>
          {row.image ? (
            <div className="group/thumb relative mx-auto size-8 overflow-hidden rounded ring-1 ring-foreground/10">
              {/* eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image */}
              <img src={resolveImageUrl(row.image)} alt="" className="size-full object-cover" />
              {canEdit && (
                <button
                  type="button"
                  onClick={() => onCommit("image", null)}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 text-[10px] text-white opacity-0 transition-opacity group-hover/thumb:opacity-100"
                >
                  ✕
                </button>
              )}
            </div>
          ) : canEdit ? (
            <div className="flex justify-center">
              <ImageUploadField value={null} onChange={(url) => onCommit("image", url)} compact />
            </div>
          ) : (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </TableCell>
      )}
      {showActions && (
        <TableCell className="w-24 text-right">
          <RowActions
            srNo={row.srNo}
            canEdit={canEdit}
            canDelete={canDelete}
            onDuplicate={onDuplicate}
            onDelete={onDelete}
            duplicating={duplicating}
            deleting={deleting}
          />
        </TableCell>
      )}
    </TableRow>
  );
}
