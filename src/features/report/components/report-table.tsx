"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Category } from "@/features/category";
import type { Client } from "@/features/client";
import { DeleteReportDialog } from "./delete-report-dialog";
import { ReportFormDialog } from "./report-form-dialog";
import type { Report } from "../types";

interface ReportTableProps {
  reports: Report[];
  categories?: Category[];
  // Only passed on the flat, cross-client reports page — the event-detail
  // page already shows the client in its own header, so a column here would
  // be redundant.
  clients?: Client[];
  canUpdate: boolean;
  canDelete: boolean;
}

export function ReportTable({ reports, categories, clients, canUpdate, canDelete }: ReportTableProps) {
  const [editTarget, setEditTarget] = useState<Report | undefined>(undefined);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Report | null>(null);

  function categoryName(report: Report) {
    return categories?.find((category) => category.id === report.categoryId)?.name ?? "—";
  }

  function clientName(report: Report) {
    return clients?.find((client) => client.id === report.clientId)?.name ?? "—";
  }

  const canManage = canUpdate || canDelete;

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            {clients && <TableHead>Client</TableHead>}
            <TableHead>Assigned to</TableHead>
            {canManage && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.title}</TableCell>
              <TableCell className="text-muted-foreground">{categoryName(report)}</TableCell>
              {clients && <TableCell className="text-muted-foreground">{clientName(report)}</TableCell>}
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {report.assignees.length === 0 ? (
                    <span className="text-xs text-muted-foreground">Unassigned</span>
                  ) : (
                    report.assignees.map((assignee) => (
                      <Badge key={assignee.id} variant="secondary">
                        {assignee.name}
                      </Badge>
                    ))
                  )}
                </div>
              </TableCell>
              {canManage && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {canUpdate && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditTarget(report);
                          setFormOpen(true);
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    {canDelete && (
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(report)}>
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

      {editTarget && (
        <ReportFormDialog
          open={formOpen}
          onOpenChange={(open) => {
            setFormOpen(open);
            if (!open) setEditTarget(undefined);
          }}
          eventId={editTarget.eventId}
          report={editTarget}
        />
      )}

      <DeleteReportDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        report={deleteTarget}
      />
    </>
  );
}
