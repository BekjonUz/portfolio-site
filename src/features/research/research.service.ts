import { apiClient } from "@/api/client";
import { RESEARCH } from "@/constants/apiEndpoint";
import type {
  ResearchCreateDTO,
  ResearchUpdateDTO,
  ResearchGetResponse,
  ResearchListResponse,
  ResearchMutationResponse,
} from "./research.type";

export const researchService = {
  getAll(page = 0, size = 10) {
    return apiClient.get<ResearchListResponse>(RESEARCH.GET_ALL, {
      params: { page, size },
    });
  },

  getById(id: number) {
    return apiClient.get<ResearchGetResponse>(
      RESEARCH.GET_BY_ID.replace(":id", String(id)),
    );
  },

  getByUser(userId: number, page = 0, size = 10) {
    return apiClient.get<ResearchListResponse>(
      RESEARCH.GET_BY_USER.replace(":id", String(userId)),
      { params: { page, size } },
    );
  },

  create(data: ResearchCreateDTO) {
    return apiClient.post<ResearchMutationResponse>(RESEARCH.CREATE, data);
  },

  update(id: number, data: ResearchUpdateDTO) {
    return apiClient.put<ResearchMutationResponse>(
      RESEARCH.UPDATE.replace(":id", String(id)),
      data,
    );
  },

  delete(id: number) {
    return apiClient.delete<ResearchMutationResponse>(
      RESEARCH.DELETE.replace(":id", String(id)),
    );
  },
};