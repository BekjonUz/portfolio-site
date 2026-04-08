import { apiClient } from "@/api/client";
import { NAZORAT } from "@/constants/apiEndpoint";
import type {
  NazoratCreateDTO,
  NazoratUpdateDTO,
  NazoratGetResponse,
  NazoratListResponse,
  NazoratMutationResponse,
} from "./nazorat.type";

export const nazoratService = {
  getAll(page = 0, size = 10) {
    return apiClient.get<NazoratListResponse>(NAZORAT.GET_ALL, {
      params: { page, size },
    });
  },

  getById(id: number) {
    return apiClient.get<NazoratGetResponse>(
      NAZORAT.GET_BY_ID.replace(":id", String(id)),
    );
  },

  getByUser(userId: number, page = 0, size = 10) {
    return apiClient.get<NazoratListResponse>(
      NAZORAT.GET_BY_USER.replace(":id", String(userId)),
      { params: { page, size } },
    );
  },

  create(data: NazoratCreateDTO) {
    return apiClient.post<NazoratMutationResponse>(NAZORAT.CREATE, data);
  },

  update(id: number, data: NazoratUpdateDTO) {
    return apiClient.put<NazoratMutationResponse>(
      NAZORAT.UPDATE.replace(":id", String(id)),
      data,
    );
  },

  delete(id: number) {
    return apiClient.delete<NazoratMutationResponse>(
      NAZORAT.DELETE.replace(":id", String(id)),
    );
  },
};