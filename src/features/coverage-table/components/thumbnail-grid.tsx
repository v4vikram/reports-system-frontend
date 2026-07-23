"use client";

import { ExpandIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";
import { useCellBuffer } from "../hooks/use-cell-buffer";
import type { ScreenshotItem } from "../types";

function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

interface ThumbnailGridProps {
  screenshots: ScreenshotItem[];
  onChange: (screenshots: ScreenshotItem[]) => void;
  canEdit: boolean;
}

export function ThumbnailGrid({ screenshots, onChange, canEdit }: ThumbnailGridProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  if (screenshots.length === 0) return null;

  function setCaption(index: number, caption: string) {
    onChange(screenshots.map((s, i) => (i === index ? { ...s, caption: caption || null } : s)));
  }

  function remove(index: number) {
    onChange(screenshots.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {screenshots.map((shot, index) => (
          <Thumbnail
            key={shot.url + index}
            shot={shot}
            canEdit={canEdit}
            onPreview={() => setPreviewIndex(index)}
            onDelete={() => remove(index)}
            onCaptionChange={(caption) => setCaption(index, caption)}
          />
        ))}
      </div>

      <Dialog open={previewIndex !== null} onOpenChange={(open) => !open && setPreviewIndex(null)}>
        <DialogContent className="max-w-2xl! p-2">
          {previewIndex !== null && (
            // eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image
            <img
              src={resolveImageUrl(screenshots[previewIndex].url)}
              alt={screenshots[previewIndex].caption ?? ""}
              className="max-h-[75vh] w-full rounded-lg object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface ThumbnailProps {
  shot: ScreenshotItem;
  canEdit: boolean;
  onPreview: () => void;
  onDelete: () => void;
  onCaptionChange: (caption: string) => void;
}

function Thumbnail({ shot, canEdit, onPreview, onDelete, onCaptionChange }: ThumbnailProps) {
  const caption = useCellBuffer(shot.caption ?? "", onCaptionChange);

  return (
    <div className="w-28">
      <div className="group/thumb relative size-28 overflow-hidden rounded-lg border border-border bg-muted/30">
        {/* eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image */}
        <img src={resolveImageUrl(shot.url)} alt={shot.caption ?? ""} className="size-full object-cover" />
        <div className="absolute inset-0 flex items-start justify-between p-1 opacity-0 transition-opacity group-hover/thumb:opacity-100">
          <Button
            type="button"
            variant="secondary"
            size="icon-xs"
            onClick={onPreview}
            aria-label="Preview screenshot"
          >
            <ExpandIcon />
          </Button>
          {canEdit && (
            <Button
              type="button"
              variant="destructive"
              size="icon-xs"
              onClick={onDelete}
              aria-label="Delete screenshot"
            >
              <XIcon />
            </Button>
          )}
        </div>
      </div>
      {canEdit ? (
        <Input
          placeholder="Caption…"
          value={caption.value}
          onChange={(e) => caption.onChange(e.target.value)}
          onFocus={caption.onFocus}
          onBlur={caption.onBlur}
          className="mt-1 h-6 border-none bg-transparent px-1 text-[11px] shadow-none focus-visible:bg-muted"
        />
      ) : (
        shot.caption && <p className="mt-1 truncate px-1 text-[11px] text-muted-foreground">{shot.caption}</p>
      )}
    </div>
  );
}
