"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { env } from "@/lib/env";
import { useUploadImage } from "../hooks/use-upload-image";

interface ImageUploadFieldProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

// Uploaded images are returned as a path (e.g. "/uploads/xyz.png") relative
// to the backend origin, not the frontend's — resolve it for display here so
// every caller doesn't have to remember to.
function resolveImageUrl(url: string) {
  return url.startsWith("/") ? `${env.NEXT_PUBLIC_API_URL}${url}` : url;
}

export function ImageUploadField({ value, onChange }: ImageUploadFieldProps) {
  const uploadImage = useUploadImage();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadImage.mutate(file, { onSuccess: (result) => onChange(result.url) });
    e.target.value = "";
  }

  return (
    <div className="flex items-center gap-2">
      {value && (
        // eslint-disable-next-line @next/next/no-img-element -- locally-uploaded, arbitrary-origin image
        <img
          src={resolveImageUrl(value)}
          alt=""
          className="size-10 rounded object-cover ring-1 ring-foreground/10"
        />
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={uploadImage.isPending}
        onClick={() => inputRef.current?.click()}
      >
        {uploadImage.isPending ? "Uploading…" : value ? "Replace" : "Upload"}
      </Button>
      {value && (
        <Button type="button" variant="ghost" size="sm" onClick={() => onChange(null)}>
          Remove
        </Button>
      )}
    </div>
  );
}
