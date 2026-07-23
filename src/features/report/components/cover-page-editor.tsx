"use client";

import { CopyIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploadField, useCellBuffer } from "@/features/coverage-table";
import { env } from "@/lib/env";
import { useUpdateReportCoverPages } from "../hooks/use-update-report-cover-pages";
import type { CoverPage, Report } from "../types";

function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

interface CoverPageEditorProps {
  report: Report;
  canEdit: boolean;
}

// Deliberately a simple content+image editor, not the drag/shape canvas
// builder a full "cover page designer" implies — the backend only stores
// {content, image} per page (Report.coverPages), and a freeform canvas would
// need its own schema (layers, positions, shapes) that doesn't exist yet.
// This covers what today's data model can actually support; a real canvas
// builder is a separate, much larger feature.
export function CoverPageEditor({ report, canEdit }: CoverPageEditorProps) {
  const updateCoverPages = useUpdateReportCoverPages();
  const pages = report.coverPages;

  function save(next: CoverPage[]) {
    updateCoverPages.mutate({ id: report.id, coverPages: next });
  }

  function addPage() {
    save([...pages, { content: null, image: null }]);
  }

  function duplicatePage(index: number) {
    const next = [...pages];
    next.splice(index + 1, 0, { ...pages[index] });
    save(next);
  }

  function removePage(index: number) {
    save(pages.filter((_, i) => i !== index));
  }

  function updatePage(index: number, patch: Partial<CoverPage>) {
    save(pages.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  }

  return (
    <div className="grid gap-3">
      {pages.length === 0 ? (
        <p className="text-sm text-muted-foreground">No cover pages yet.</p>
      ) : (
        pages.map((page, index) => (
          <CoverPageCard
            key={index}
            index={index}
            page={page}
            total={pages.length}
            canEdit={canEdit}
            onChange={(patch) => updatePage(index, patch)}
            onDuplicate={() => duplicatePage(index)}
            onRemove={() => removePage(index)}
          />
        ))
      )}
      {canEdit && (
        <Button variant="outline" size="sm" className="w-fit" onClick={addPage}>
          <PlusIcon /> Add Cover Page
        </Button>
      )}
    </div>
  );
}

interface CoverPageCardProps {
  index: number;
  page: CoverPage;
  total: number;
  canEdit: boolean;
  onChange: (patch: Partial<CoverPage>) => void;
  onDuplicate: () => void;
  onRemove: () => void;
}

function CoverPageCard({ index, page, total, canEdit, onChange, onDuplicate, onRemove }: CoverPageCardProps) {
  const content = useCellBuffer(page.content ?? "", (v) => onChange({ content: v || null }));

  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            Page {index + 1} of {total}
          </span>
          {canEdit && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon-sm" onClick={onDuplicate} aria-label="Duplicate page">
                <CopyIcon />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                disabled={total <= 1}
                onClick={onRemove}
                aria-label="Remove page"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2Icon />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <Textarea
          rows={8}
          placeholder="Cover page content…"
          disabled={!canEdit}
          value={content.value}
          onChange={(e) => content.onChange(e.target.value)}
          onFocus={content.onFocus}
          onBlur={content.onBlur}
        />
        <div className="grid content-start gap-2">
          <span className="text-xs font-medium text-muted-foreground">Cover image</span>
          {canEdit ? (
            <ImageUploadField value={page.image} onChange={(url) => onChange({ image: url })} />
          ) : page.image ? (
            // eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image
            <img
              src={resolveImageUrl(page.image)}
              alt=""
              className="h-32 w-full rounded object-cover ring-1 ring-foreground/10"
            />
          ) : (
            <span className="text-xs text-muted-foreground">No image</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
