"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionGate, useHasPermission } from "@/features/auth";
import { PERMISSIONS as CATEGORY_PERMISSIONS, useCategories } from "@/features/category";
import { useClients } from "@/features/client";
import {
  PERMISSIONS as REPORT_PERMISSIONS,
  REPORT_VIEW_PERMISSIONS,
  ReportTable,
  useReports,
} from "@/features/report";

// Flat, view-only complement to the Client → Event → Report drill-down —
// creation always happens contextually from an event page, since a report
// always needs a specific event.
export default function ReportsPage() {
  const hasPermission = useHasPermission();
  const canView = REPORT_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const canUpdate = hasPermission(REPORT_PERMISSIONS.REPORTS_UPDATE);
  const canDelete = hasPermission(REPORT_PERMISSIONS.REPORTS_DELETE);
  const canViewCategories = hasPermission(CATEGORY_PERMISSIONS.CATEGORIES_READ);

  const { data: reports, isLoading } = useReports({}, { enabled: canView });
  const { data: categories } = useCategories({ enabled: canViewCategories });
  const { data: clients } = useClients({ enabled: canView });

  return (
    <PermissionGate title="Reports" canView={canView}>
      <Card>
        <CardHeader>
          <CardTitle>Reports</CardTitle>
          <CardDescription>
            Every report you can see, across all clients. Open a client to file a new one.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (reports?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No reports found.</p>
          ) : (
            <ReportTable
              reports={reports ?? []}
              categories={categories}
              clients={clients}
              canUpdate={canUpdate}
              canDelete={canDelete}
            />
          )}
        </CardContent>
      </Card>
    </PermissionGate>
  );
}
