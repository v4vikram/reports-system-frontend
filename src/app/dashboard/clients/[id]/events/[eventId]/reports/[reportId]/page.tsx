"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { PencilIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PermissionGate, useHasPermission } from "@/features/auth";
import { PERMISSIONS as CATEGORY_PERMISSIONS, useCategories } from "@/features/category";
import { PERMISSIONS as CLIENT_PERMISSIONS, useClient } from "@/features/client";
import { useEvent } from "@/features/event";
import {
  CoverPageEditor,
  PERMISSIONS as REPORT_PERMISSIONS,
  REPORT_VIEW_PERMISSIONS,
  ReportFormDialog,
  useReport,
} from "@/features/report";
import { SectionList } from "@/features/section";

export default function ReportDetailPage() {
  const { id, eventId, reportId } = useParams<{ id: string; eventId: string; reportId: string }>();
  const hasPermission = useHasPermission();
  const canView = REPORT_VIEW_PERMISSIONS.some((key) => hasPermission(key));
  const canEdit = hasPermission(REPORT_PERMISSIONS.REPORTS_UPDATE);
  const canDelete = hasPermission(REPORT_PERMISSIONS.REPORTS_DELETE);
  const canViewClient = hasPermission(CLIENT_PERMISSIONS.CLIENTS_READ);
  const canViewCategories = hasPermission(CATEGORY_PERMISSIONS.CATEGORIES_READ);

  const { data: client } = useClient(id, { enabled: canViewClient });
  const { data: event } = useEvent(eventId, { enabled: canViewClient });
  const { data: report, isLoading, isError } = useReport(reportId, { enabled: canView });
  const { data: categories } = useCategories({ enabled: canViewCategories });

  const [editOpen, setEditOpen] = useState(false);

  const categoryName = categories?.find((c) => c.id === report?.categoryId)?.name;

  return (
    <PermissionGate title="Report" canView={canView}>
      {isLoading ? (
        <div className="grid gap-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : isError || !report ? (
        <Card>
          <CardHeader>
            <CardTitle>Report</CardTitle>
            <CardDescription>
              This report doesn&apos;t exist, or you don&apos;t have access to it.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        // Scoped dark theme: `.dark` just flips the CSS-variable set that
        // `dark:` selectors key off (see globals.css's `@custom-variant
        // dark`), so applying it to this subtree only gives the Report
        // Builder its own dark, dense, enterprise look without changing the
        // rest of the (light) dashboard shell or requiring a global
        // next-themes toggle that doesn't exist in this app yet.
        <div className="dark grid gap-4 rounded-xl bg-background p-4 text-foreground">
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
                <BreadcrumbLink
                  render={
                    <Link href={`/dashboard/clients/${id}/events/${eventId}`}>{event?.title ?? "…"}</Link>
                  }
                />
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{report.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Card size="sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle>{report.title}</CardTitle>
                <CardDescription>{categoryName ?? "—"}</CardDescription>
              </div>
              {canEdit && (
                <Button size="sm" variant="outline" onClick={() => setEditOpen(true)}>
                  <PencilIcon /> Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="grid gap-2">
              {report.content && <p className="text-sm text-muted-foreground">{report.content}</p>}
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
            </CardContent>
          </Card>

          <Tabs defaultValue="content">
            <TabsList variant="line">
              <TabsTrigger value="content">Report Content</TabsTrigger>
              <TabsTrigger value="cover">Cover Page</TabsTrigger>
            </TabsList>
            <TabsContent value="content" className="pt-3">
              <SectionList reportId={report.id} canEdit={canEdit} canDelete={canDelete} />
            </TabsContent>
            <TabsContent value="cover" className="pt-3">
              <CoverPageEditor report={report} canEdit={canEdit} />
            </TabsContent>
          </Tabs>

          <ReportFormDialog open={editOpen} onOpenChange={setEditOpen} eventId={eventId} report={report} />
        </div>
      )}
    </PermissionGate>
  );
}
