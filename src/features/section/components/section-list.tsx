"use client";

import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CoverageTablesList } from "@/features/coverage-table";
import { useSections } from "../hooks/use-sections";
import { useUpdateSection } from "../hooks/use-update-section";
import type { Section } from "../types";
import { DeleteSectionDialog } from "./delete-section-dialog";
import { SectionFormDialog } from "./section-form-dialog";

interface SectionListProps {
  reportId: string;
  canEdit: boolean;
  canDelete: boolean;
}

export function SectionList({ reportId, canEdit, canDelete }: SectionListProps) {
  const { data: sections, isLoading } = useSections(reportId, { enabled: true });
  const updateSection = useUpdateSection();

  const [formOpen, setFormOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<Section | null>(null);

  const sorted = [...(sections ?? [])].sort((a, b) => a.order - b.order);

  function move(section: Section, direction: -1 | 1) {
    const index = sorted.findIndex((s) => s.id === section.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    updateSection.mutate({ id: section.id, input: { order: swapWith.order } });
    updateSection.mutate({ id: swapWith.id, input: { order: section.order } });
  }

  if (isLoading) {
    return (
      <div className="grid gap-2">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sections yet.</p>
      ) : (
        sorted.map((section, index) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">{section.name}</CardTitle>
              {canEdit && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === 0}
                    onClick={() => move(section, -1)}
                  >
                    <ChevronUpIcon />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    disabled={index === sorted.length - 1}
                    onClick={() => move(section, 1)}
                  >
                    <ChevronDownIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSection(section);
                      setFormOpen(true);
                    }}
                  >
                    Rename
                  </Button>
                  {canDelete && (
                    <Button variant="outline" size="sm" onClick={() => setDeleteTarget(section)}>
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </CardHeader>
            <CardContent>
              <CoverageTablesList sectionId={section.id} canEdit={canEdit} canDelete={canDelete} />
            </CardContent>
          </Card>
        ))
      )}

      {canEdit && (
        <Button
          variant="outline"
          className="w-fit"
          onClick={() => {
            setEditingSection(undefined);
            setFormOpen(true);
          }}
        >
          <PlusIcon /> Add Section
        </Button>
      )}

      <SectionFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditingSection(undefined);
        }}
        reportId={reportId}
        nextOrder={sorted.length}
        section={editingSection}
      />

      <DeleteSectionDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        section={deleteTarget}
      />
    </div>
  );
}
