"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CopyIcon, PlusIcon, RotateCcwIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { coverageRowApi } from "../api/coverage-row.api";
import { coverageTablesQueryKey } from "../hooks/use-coverage-tables";
import { useCreateCoverageRow } from "../hooks/use-create-coverage-row";
import { useUpdateCoverageTable } from "../hooks/use-update-coverage-table";
import { duplicateCoverageTable } from "../lib/duplicate-table";
import { COVERAGE_COLUMNS, type CoverageTable, type ScreenshotItem } from "../types";
import { ColumnSelector } from "./column-selector";
import { DeleteCoverageTableDialog } from "./delete-coverage-table-dialog";
import { ReportTable } from "./report-table";
import { ScreenshotUploader } from "./screenshot-uploader";
import { ThumbnailGrid } from "./thumbnail-grid";
import { Toolbar } from "./toolbar";

interface TableCardProps {
  table: CoverageTable;
  canEdit: boolean;
  canDelete: boolean;
}

export function TableCard({ table, canEdit, canDelete }: TableCardProps) {
  const queryClient = useQueryClient();
  const updateTable = useUpdateCoverageTable();
  const createRow = useCreateCoverageRow(table.id);

  const [category, setCategory] = useState(table.category ?? "");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [autoIncrementing, setAutoIncrementing] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  function commitCategory() {
    if (category === (table.category ?? "")) return;
    updateTable.mutate({ id: table.id, input: { category: category || null } });
  }

  function toggleColumn(key: string, visible: boolean) {
    const next = visible ? table.hiddenColumns.filter((k) => k !== key) : [...table.hiddenColumns, key];
    updateTable.mutate({ id: table.id, input: { hiddenColumns: next } });
  }

  function toggleAllColumns() {
    const allKeys = COVERAGE_COLUMNS.map((c) => c.key);
    const allVisible = table.hiddenColumns.length === 0;
    updateTable.mutate({
      id: table.id,
      input: { hiddenColumns: allVisible ? allKeys.filter((k) => k !== "srNo") : [] },
    });
  }

  async function autoIncrementSrNo() {
    setAutoIncrementing(true);
    try {
      const sorted = [...table.rows].sort((a, b) => a.order - b.order);
      await Promise.all(
        sorted.map((row, index) =>
          row.srNo === index + 1 ? Promise.resolve() : coverageRowApi.update(row.id, { srNo: index + 1 })
        )
      );
      await queryClient.invalidateQueries({ queryKey: ["coverage-tables"] });
      toast.success("Rows renumbered");
    } catch {
      toast.error("Failed to renumber some rows");
    } finally {
      setAutoIncrementing(false);
    }
  }

  async function duplicateTable() {
    setDuplicating(true);
    try {
      await duplicateCoverageTable(table.sectionId, table, {
        category: table.category ? `${table.category} (Copy)` : null,
        order: table.order + 1,
      });
      await queryClient.invalidateQueries({ queryKey: coverageTablesQueryKey(table.sectionId) });
      toast.success("Table duplicated");
    } catch {
      toast.error("Failed to duplicate table");
    } finally {
      setDuplicating(false);
    }
  }

  function addRow() {
    const nextSrNo = table.rows.length === 0 ? 1 : Math.max(...table.rows.map((r) => r.srNo)) + 1;
    createRow.mutate({
      srNo: nextSrNo,
      headline: null,
      publication: null,
      edition: null,
      pageNo: null,
      date: new Date().toISOString().slice(0, 10),
      link: null,
      image: null,
      isTopCoverage: false,
    });
  }

  function handleScreenshotsUploaded(urls: string[]) {
    const next: ScreenshotItem[] = [
      ...table.screenshots,
      ...urls.map((url, i) => ({ url, caption: null, order: table.screenshots.length + i })),
    ];
    updateTable.mutate({ id: table.id, input: { screenshots: next } });
  }

  function handleScreenshotsChange(screenshots: ScreenshotItem[]) {
    updateTable.mutate({ id: table.id, input: { screenshots } });
  }

  const imageCount = table.rows.filter((r) => r.image).length + table.screenshots.length;

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={commitCategory}
            placeholder="Category (e.g. TV, Online)"
            disabled={!canEdit}
            className="h-7 max-w-40 border-none bg-transparent px-1 text-sm font-semibold shadow-none focus-visible:bg-muted"
          />
          <div className="flex items-center gap-3">
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              Images: {imageCount} · Rows: {table.rows.length}
            </span>
            {(canEdit || canDelete) && (
              <Toolbar>
                {canEdit && (
                  <Button variant="ghost" size="xs" disabled={autoIncrementing} onClick={autoIncrementSrNo}>
                    <RotateCcwIcon /> Auto Sr No
                  </Button>
                )}
                {canEdit && (
                  <Button variant="ghost" size="xs" onClick={toggleAllColumns}>
                    Check/Uncheck all
                  </Button>
                )}
                {canEdit && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          disabled={duplicating}
                          onClick={duplicateTable}
                          aria-label="Duplicate table"
                        >
                          <CopyIcon />
                        </Button>
                      }
                    />
                    <TooltipContent>Duplicate table</TooltipContent>
                  </Tooltip>
                )}
                {canDelete && (
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => setDeleteOpen(true)}
                          aria-label="Delete table"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2Icon />
                        </Button>
                      }
                    />
                    <TooltipContent>Delete table</TooltipContent>
                  </Tooltip>
                )}
              </Toolbar>
            )}
          </div>
        </div>
        {canEdit && <ColumnSelector hiddenColumns={table.hiddenColumns} onToggle={toggleColumn} />}
      </CardHeader>
      <CardContent className="grid gap-3">
        <ReportTable table={table} canEdit={canEdit} canDelete={canDelete} />

        <div className="flex items-center justify-between gap-2">
          {canEdit ? (
            <Button variant="ghost" size="sm" onClick={addRow}>
              <PlusIcon /> Add Row
            </Button>
          ) : (
            <span />
          )}
          {canEdit && (
            <Button
              size="sm"
              className="bg-linear-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600"
              onClick={() => toast.info("AI auto-fill isn't wired up yet — coming in a future update.")}
            >
              <SparklesIcon /> Auto-Fill from Image
            </Button>
          )}
        </div>

        <div className="grid gap-2 border-t border-border pt-3">
          <span className="text-xs font-medium text-muted-foreground">Screenshots</span>
          {canEdit && <ScreenshotUploader onUpload={handleScreenshotsUploaded} />}
          <ThumbnailGrid screenshots={table.screenshots} onChange={handleScreenshotsChange} canEdit={canEdit} />
        </div>
      </CardContent>

      <DeleteCoverageTableDialog open={deleteOpen} onOpenChange={setDeleteOpen} table={table} />
    </Card>
  );
}
