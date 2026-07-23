"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSections } from "../hooks/use-sections";
import { useUpdateSection } from "../hooks/use-update-section";
import type { Section } from "../types";
import { SectionCard } from "./section-card";
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
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sorted = [...(sections ?? [])].sort((a, b) => a.order - b.order);

  function move(section: Section, direction: -1 | 1) {
    const index = sorted.findIndex((s) => s.id === section.id);
    const swapWith = sorted[index + direction];
    if (!swapWith) return;
    updateSection.mutate({ id: section.id, input: { order: swapWith.order } });
    updateSection.mutate({ id: swapWith.id, input: { order: section.order } });
  }

  function reorderByDrag(targetId: string) {
    if (!dragId || dragId === targetId) return;
    const fromIndex = sorted.findIndex((s) => s.id === dragId);
    const toIndex = sorted.findIndex((s) => s.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;

    const next = [...sorted];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    next.forEach((section, index) => {
      if (section.order !== index) {
        updateSection.mutate({ id: section.id, input: { order: index } });
      }
    });
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
    <div className="grid gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Sections</h2>
        {canEdit && (
          <Button size="sm" onClick={() => setFormOpen(true)}>
            <PlusIcon /> Add Section
          </Button>
        )}
      </div>

      {sorted.length === 0 ? (
        <p className="text-sm text-muted-foreground">No sections yet.</p>
      ) : (
        <div className="grid gap-3">
          {sorted.map((section, index) => (
            <SectionCard
              key={section.id}
              section={section}
              reportId={reportId}
              isFirst={index === 0}
              isLast={index === sorted.length - 1}
              canEdit={canEdit}
              canDelete={canDelete}
              onMove={(direction) => move(section, direction)}
              isDropTarget={overId === section.id && dragId !== section.id}
              dragHandlers={{
                draggable: canEdit,
                onDragStart: () => setDragId(section.id),
                onDragOver: (e) => {
                  e.preventDefault();
                  if (dragId && dragId !== section.id) setOverId(section.id);
                },
                onDrop: (e) => {
                  e.preventDefault();
                  reorderByDrag(section.id);
                  setDragId(null);
                  setOverId(null);
                },
                onDragEnd: () => {
                  setDragId(null);
                  setOverId(null);
                },
              }}
            />
          ))}
        </div>
      )}

      <SectionFormDialog open={formOpen} onOpenChange={setFormOpen} reportId={reportId} nextOrder={sorted.length} />
    </div>
  );
}
