"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PlusIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useHasPermission } from "@/features/auth";
import { PERMISSIONS as CATEGORY_PERMISSIONS, useCategories } from "@/features/category";
import { PERMISSIONS as CLIENT_PERMISSIONS, useClient } from "@/features/client";
import { useEvent } from "@/features/event";
import {
  PERMISSIONS as REPORT_PERMISSIONS,
  REPORT_VIEW_PERMISSIONS,
  ReportFormDialog,
  ReportTable,
  useReports,
} from "@/features/report";

export default function EventDetailPage() {
  const { id, eventId } = useParams<{ id: string; eventId: string }>();
  const hasPermission = useHasPermission();
  const canViewClient = hasPermission(CLIENT_PERMISSIONS.CLIENTS_READ);
  const canViewReports = REPORT_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const canCreateReport = hasPermission(REPORT_PERMISSIONS.REPORTS_CREATE);
  const canUpdateReport = hasPermission(REPORT_PERMISSIONS.REPORTS_UPDATE);
  const canDeleteReport = hasPermission(REPORT_PERMISSIONS.REPORTS_DELETE);
  const canViewCategories = hasPermission(CATEGORY_PERMISSIONS.CATEGORIES_READ);

  const { data: client } = useClient(id, { enabled: canViewClient });
  const { data: event, isLoading: eventLoading, isError } = useEvent(eventId, { enabled: canViewClient });
  const { data: reports, isLoading: reportsLoading } = useReports(
    { eventId },
    { enabled: canViewReports && !!event }
  );
  const { data: categories } = useCategories({ enabled: canViewCategories });

  const [createOpen, setCreateOpen] = useState(false);

  if (!canViewClient) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event</CardTitle>
          <CardDescription>You don&apos;t have permission to view this page.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (eventLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (isError || !event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Event</CardTitle>
          <CardDescription>This event doesn&apos;t exist, or you don&apos;t have access to it.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/dashboard/clients">Clients</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={`/dashboard/clients/${id}`}>{client?.name ?? "…"}</Link>} />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{event.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{event.title}</CardTitle>
          <CardDescription>
            {event.eventDate ? new Date(event.eventDate).toLocaleDateString() : "No date set"}
            {event.description ? ` — ${event.description}` : ""}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
          <div>
            <CardTitle>Reports</CardTitle>
            <CardDescription>Reports filed under this event.</CardDescription>
          </div>
          {canCreateReport && (
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <PlusIcon /> New report
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!canViewReports ? (
            <p className="text-sm text-muted-foreground">You don&apos;t have permission to view reports.</p>
          ) : reportsLoading ? (
            <div className="grid gap-2">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : (reports?.length ?? 0) === 0 ? (
            <p className="text-sm text-muted-foreground">No reports found.</p>
          ) : (
            <ReportTable
              reports={reports ?? []}
              categories={categories}
              canUpdate={canUpdateReport}
              canDelete={canDeleteReport}
            />
          )}
        </CardContent>
      </Card>

      <ReportFormDialog open={createOpen} onOpenChange={setCreateOpen} eventId={eventId} />
    </div>
  );
}
