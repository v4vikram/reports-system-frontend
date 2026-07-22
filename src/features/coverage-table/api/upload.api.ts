import { apiClient } from "@/lib/api-client";

export const uploadApi = {
  image: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiClient.post<{ url: string }>("/api/uploads/image", form);
  },
};
