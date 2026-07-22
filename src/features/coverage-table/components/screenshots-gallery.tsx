"use client";

import { XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";
import type { ScreenshotItem } from "../types";
import { ImageUploadField } from "./image-upload-field";

function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

interface ScreenshotsGalleryProps {
  screenshots: ScreenshotItem[];
  onChange: (screenshots: ScreenshotItem[]) => void;
  canEdit: boolean;
}

export function ScreenshotsGallery({ screenshots, onChange, canEdit }: ScreenshotsGalleryProps) {
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [pendingCaption, setPendingCaption] = useState("");

  function addScreenshot() {
    if (!pendingUrl) return;
    onChange([...screenshots, { url: pendingUrl, caption: pendingCaption || null, order: screenshots.length }]);
    setPendingUrl(null);
    setPendingCaption("");
  }

  function removeScreenshot(index: number) {
    onChange(screenshots.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i })));
  }

  return (
    <div className="grid gap-2">
      <span className="text-sm font-medium">Screenshots</span>
      {screenshots.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {screenshots.map((shot, index) => (
            <div key={shot.url + index} className="relative w-24">
              {/* eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image */}
              <img
                src={resolveImageUrl(shot.url)}
                alt={shot.caption ?? ""}
                className="h-24 w-24 rounded object-cover ring-1 ring-foreground/10"
              />
              {shot.caption && <p className="mt-1 truncate text-xs text-muted-foreground">{shot.caption}</p>}
              {canEdit && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon-xs"
                  className="absolute -top-1.5 -right-1.5 rounded-full"
                  onClick={() => removeScreenshot(index)}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
      {canEdit && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-dashed p-2">
          <ImageUploadField value={pendingUrl} onChange={setPendingUrl} />
          <Input
            placeholder="Caption (optional)"
            value={pendingCaption}
            onChange={(e) => setPendingCaption(e.target.value)}
            className="w-48"
          />
          <Button type="button" variant="outline" size="sm" disabled={!pendingUrl} onClick={addScreenshot}>
            Add
          </Button>
        </div>
      )}
    </div>
  );
}
