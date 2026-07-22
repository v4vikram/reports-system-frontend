"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { env } from "@/lib/env";
import { CoverageRowFormDialog } from "./coverage-row-form-dialog";
import { DeleteCoverageTableDialog } from "./delete-coverage-table-dialog";
import { ScreenshotsGallery } from "./screenshots-gallery";
import { useDeleteCoverageRow } from "../hooks/use-delete-coverage-row";
import { useUpdateCoverageRow } from "../hooks/use-update-coverage-row";
import { useUpdateCoverageTable } from "../hooks/use-update-coverage-table";
import { COVERAGE_COLUMNS, type CoverageRow, type CoverageTable, type ScreenshotItem } from "../types";

function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

interface CoverageTableCardProps {
  table: CoverageTable;
  canEdit: boolean;
  canDelete: boolean;
}

export function CoverageTableCard({ table, canEdit, canDelete }: CoverageTableCardProps) {
  const updateTable = useUpdateCoverageTable();
  const updateRow = useUpdateCoverageRow();
  const deleteRow = useDeleteCoverageRow();

  const [category, setCategory] = useState(table.category ?? "");
  const [rowFormOpen, setRowFormOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<CoverageRow | undefined>(undefined);
  const [deleteRowTarget, setDeleteRowTarget] = useState<CoverageRow | null>(null);
  const [deleteTableOpen, setDeleteTableOpen] = useState(false);
  const [autoIncrementing, setAutoIncrementing] = useState(false);

  const isVisible = (key: string) => !table.hiddenColumns.includes(key);

  function toggleColumn(key: string, visible: boolean) {
    const next = visible
      ? table.hiddenColumns.filter((k) => k !== key)
      : [...table.hiddenColumns, key];
    updateTable.mutate({ id: table.id, input: { hiddenColumns: next } });
  }

  function handleCategoryBlur() {
    if (category === (table.category ?? "")) return;
    updateTable.mutate({ id: table.id, input: { category: category || null } });
  }

  function handleScreenshotsChange(screenshots: ScreenshotItem[]) {
    updateTable.mutate({ id: table.id, input: { screenshots } });
  }

  async function autoIncrementSrNo() {
    setAutoIncrementing(true);
    try {
      const sorted = [...table.rows].sort((a, b) => a.order - b.order);
      await Promise.all(
        sorted.map((row, index) =>
          row.srNo === index + 1
            ? Promise.resolve()
            : updateRow.mutateAsync({ id: row.id, input: { srNo: index + 1 } })
        )
      );
    } finally {
      setAutoIncrementing(false);
    }
  }

  const nextSrNo = table.rows.length === 0 ? 1 : Math.max(...table.rows.map((r) => r.srNo)) + 1;

  return (
    <Card>
      <CardHeader className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={handleCategoryBlur}
            placeholder="Category (e.g. TV, Online)"
            disabled={!canEdit}
            className="max-w-48 font-medium"
          />
          {canDelete && (
            <Button variant="outline" size="sm" onClick={() => setDeleteTableOpen(true)}>
              Delete table
            </Button>
          )}
        </div>
        {canEdit && (
          <div className="flex flex-wrap gap-3">
            {COVERAGE_COLUMNS.map((col) => (
              <label key={col.key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Checkbox checked={isVisible(col.key)} onCheckedChange={(c) => toggleColumn(col.key, c === true)} />
                {col.label}
              </label>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex justify-between gap-2">
          {canEdit && (
            <Button variant="outline" size="sm" disabled={autoIncrementing} onClick={autoIncrementSrNo}>
              {autoIncrementing ? "Renumbering…" : "Auto-increment Sr No"}
            </Button>
          )}
          {canEdit && (
            <Button size="sm" onClick={() => { setEditingRow(undefined); setRowFormOpen(true); }}>
              + Add Row
            </Button>
          )}
        </div>

        {table.rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No rows yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {isVisible("srNo") && <TableHead>Sr No</TableHead>}
                  {isVisible("isTopCoverage") && <TableHead>Top</TableHead>}
                  {isVisible("headline") && <TableHead>Headline</TableHead>}
                  {isVisible("publication") && <TableHead>Publication</TableHead>}
                  {isVisible("edition") && <TableHead>Edition</TableHead>}
                  {isVisible("pageNo") && <TableHead>Page No</TableHead>}
                  {isVisible("date") && <TableHead>Date</TableHead>}
                  {isVisible("link") && <TableHead>Link</TableHead>}
                  {isVisible("image") && <TableHead>Image</TableHead>}
                  {(canEdit || canDelete) && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...table.rows]
                  .sort((a, b) => a.order - b.order)
                  .map((row) => (
                    <TableRow key={row.id}>
                      {isVisible("srNo") && <TableCell>{row.srNo}</TableCell>}
                      {isVisible("isTopCoverage") && (
                        <TableCell>{row.isTopCoverage && <Badge variant="secondary">Top</Badge>}</TableCell>
                      )}
                      {isVisible("headline") && <TableCell>{row.headline ?? "—"}</TableCell>}
                      {isVisible("publication") && (
                        <TableCell className="text-muted-foreground">{row.publication ?? "—"}</TableCell>
                      )}
                      {isVisible("edition") && (
                        <TableCell className="text-muted-foreground">{row.edition ?? "—"}</TableCell>
                      )}
                      {isVisible("pageNo") && <TableCell>{row.pageNo ?? "—"}</TableCell>}
                      {isVisible("date") && (
                        <TableCell>{row.date ? new Date(row.date).toLocaleDateString() : "—"}</TableCell>
                      )}
                      {isVisible("link") && (
                        <TableCell>
                          {row.link ? (
                            <a
                              href={row.link}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              Link
                            </a>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      )}
                      {isVisible("image") && (
                        <TableCell>
                          {row.image ? (
                            // eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image
                            <img
                              src={resolveImageUrl(row.image)}
                              alt=""
                              className="size-8 rounded object-cover ring-1 ring-foreground/10"
                            />
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      )}
                      {(canEdit || canDelete) && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {canEdit && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingRow(row);
                                  setRowFormOpen(true);
                                }}
                              >
                                Edit
                              </Button>
                            )}
                            {canDelete && (
                              <Button variant="outline" size="sm" onClick={() => setDeleteRowTarget(row)}>
                                Delete
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        )}

        <ScreenshotsGallery
          screenshots={table.screenshots}
          onChange={handleScreenshotsChange}
          canEdit={canEdit}
        />
      </CardContent>

      <CoverageRowFormDialog
        open={rowFormOpen}
        onOpenChange={(open) => {
          setRowFormOpen(open);
          if (!open) setEditingRow(undefined);
        }}
        coverageTableId={table.id}
        nextSrNo={nextSrNo}
        row={editingRow}
      />

      <DeleteCoverageTableDialog open={deleteTableOpen} onOpenChange={setDeleteTableOpen} table={table} />

      <AlertDialog open={!!deleteRowTarget} onOpenChange={(open) => !open && setDeleteRowTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete row {deleteRowTarget?.srNo}?</AlertDialogTitle>
            <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() =>
                deleteRowTarget &&
                deleteRow.mutate(deleteRowTarget.id, { onSuccess: () => setDeleteRowTarget(null) })
              }
              disabled={deleteRow.isPending}
              className="bg-destructive/10 text-destructive hover:bg-destructive/20"
            >
              {deleteRow.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
