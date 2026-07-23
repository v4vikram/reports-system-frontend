"use client";

import { Loader2Icon, UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUploadImage } from "../hooks/use-upload-image";

interface ScreenshotUploaderProps {
  onUpload: (urls: string[]) => void;
  disabled?: boolean;
}

// Native HTML5 drag-and-drop instead of a library — the project has no
// dropzone dependency installed, and a plain dragover/drop handler on a div
// covers everything the spec asks for (drop area, drag-active state, click
// fallback) without adding one.
export function ScreenshotUploader({ onUpload, disabled }: ScreenshotUploaderProps) {
  const uploadImage = useUploadImage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFiles(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    setIsUploading(true);
    try {
      const urls: string[] = [];
      for (const file of imageFiles) {
        const result = await uploadImage.mutateAsync(file);
        urls.push(result.url);
      }
      onUpload(urls);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;
        void uploadFiles(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed py-6 text-center transition-colors",
        disabled && "pointer-events-none opacity-50",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground/40 hover:bg-muted/30"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      {isUploading ? (
        <>
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          <p className="text-xs text-muted-foreground">Uploading…</p>
        </>
      ) : (
        <>
          <UploadIcon className="size-5 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">
            {isDragging ? "Drop images here" : "Drag & drop images here, or click to upload"}
          </p>
        </>
      )}
    </div>
  );
}
