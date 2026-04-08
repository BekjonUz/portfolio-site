import { apiClient } from "@/api/client";
import { FILE } from "@/constants/apiEndpoint";
import type { FileUploadResponse } from "./file.type";

export const fileService = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<string>(FILE.IMAGE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res;
  },

  async uploadPdf(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await apiClient.post<FileUploadResponse>(FILE.PDF, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  },
};