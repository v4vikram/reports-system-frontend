"use client";

import { useMutation } from "@tanstack/react-query";
import { uploadApi } from "../api/upload.api";

export function useUploadImage() {
  return useMutation({
    mutationFn: (file: File) => uploadApi.image(file),
  });
}
