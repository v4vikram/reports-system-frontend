"use client";

import { useQueryClient } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  CopyIcon,
  GripVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { type DragEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  CoverageTablesList,
  coverageTableApi,
  duplicateCoverageTable,
  useCoverageTables,
} from "@/features/coverage-table";
import { sectionApi } from "../api/section.api";
import { sectionsQueryKey } from "../hooks/use-sections";
import { useUpdateSection } from "../hooks/use-update-section";
import type { Section } from "../types";
import { DeleteSectionDialog } from "./delete-section-dialog";

interface DragHandlers {
  draggable: boolean;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent) => void;
  onDragEnd: () => void;
}

interface SectionCardProps {
  section: Section;
  reportId: string;
  isFirst: boolean;
  isLast: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onMove: (direction: -1 | 1) => void;
  dragHandlers: DragHandlers;
  isDropTarget: boolean;
}

export function SectionCard({
  section,
  reportId,
  isFirst,
  isLast,
  canEdit,
  canDelete,
  onMove,
  dragHandlers,
  isDropTarget,
}: SectionCardProps) {
  const queryClient = useQueryClient();
  const updateSection = useUpdateSection();
  const { data: tables } = useCoverageTables(section.id, { enabled: true });

  const [isExpanded, setIsExpanded] = useState(true);
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(section.name);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  function startRename() {
    setNameDraft(section.name);
    setIsRenaming(true);
  }

  function commitRename() {
    setIsRenaming(false);
    if (nameDraft.trim() && nameDraft !== section.name) {
      updateSection.mutate({ id: section.id, input: { name: nameDraft.trim() } });
    }
  }

  // Duplicates the section plus every table (and every row in each table)
  // inside it, via the same sequential-create helper TableCard's own
  // "Duplicate table" action uses — a section duplicate is just that,
  // applied once per table.
  async function duplicateSection() {
    setDuplicating(true);
    try {
      const newSection = await sectionApi.create(reportId, {
        name: `${section.name} (Copy)`,
        order: section.order + 1,
      });
      if (section.type === "standard") {
        const sourceTables = await coverageTableApi.list(section.id);
        for (const table of [...sourceTables].sort((a, b) => a.order - b.order)) {
          await duplicateCoverageTable(newSection.id, table);
        }
      }
      await queryClient.invalidateQueries({ queryKey: sectionsQueryKey(reportId) });
      toast.success("Section duplicated");
    } catch {
      toast.error("Failed to duplicate section");
    } finally {
      setDuplicating(false);
    }
  }

  const tableCount = tables?.length ?? 0;

  return (
    <Card
      size="sm"
      {...dragHandlers}
      className={isDropTarget ? "ring-2 ring-primary" : undefined}
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CardHeader>
          <div className="flex items-center gap-2">
            {canEdit && (
              <span className="cursor-grab text-muted-foreground/50 active:cursor-grabbing" aria-label="Drag to reorder">
                <GripVerticalIcon className="size-4" />
              </span>
            )}
            <CollapsibleTrigger
              render={
                <button type="button" className="flex items-center gap-1.5 text-muted-foreground" aria-label="Toggle section">
                  {isExpanded ? <ChevronDownIcon className="size-4" /> : <ChevronRightIcon className="size-4" />}
                </button>
              }
            />

            {isRenaming ? (
              <Input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onBlur={commitRename}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") setIsRenaming(false);
                }}
                className="h-7 max-w-56 text-base font-medium"
              />
            ) : (
              <span className="truncate text-base font-medium">{section.name}</span>
            )}

            <Badge variant="secondary" className="shrink-0">
              {tableCount} {tableCount === 1 ? "table" : "tables"}
            </Badge>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              {canEdit && (
                <>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" disabled={isFirst} onClick={() => onMove(-1)} aria-label="Move up">
                          <ChevronUpIcon />
                        </Button>
                      }
                    />
                    <TooltipContent>Move up</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" disabled={isLast} onClick={() => onMove(1)} aria-label="Move down">
                          <ChevronDownIcon />
                        </Button>
                      }
                    />
                    <TooltipContent>Move down</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" disabled={duplicating} onClick={duplicateSection} aria-label="Duplicate section">
                          <CopyIcon />
                        </Button>
                      }
                    />
                    <TooltipContent>Duplicate section</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger
                      render={
                        <Button variant="ghost" size="icon-sm" onClick={startRename} aria-label="Rename section">
                          <PencilIcon />
                        </Button>
                      }
                    />
                    <TooltipContent>Rename</TooltipContent>
                  </Tooltip>
                </>
              )}
              {canDelete && (
                <Tooltip>
                  <TooltipTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteOpen(true)}
                        aria-label="Delete section"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2Icon />
                      </Button>
                    }
                  />
                  <TooltipContent>Delete section</TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent>
            <CoverageTablesList sectionId={section.id} canEdit={canEdit} canDelete={canDelete} />
          </CardContent>
        </CollapsibleContent>
      </Collapsible>

      <DeleteSectionDialog open={deleteOpen} onOpenChange={setDeleteOpen} section={section} />
    </Card>
  );
}
