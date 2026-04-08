import { apiClient } from "@/api/client";
import { CONSULTATION } from "@/constants/apiEndpoint";
import type {
  ConsultationCreateDTO,
  ConsultationUpdateDTO,
  ConsultationGetResponse,
  ConsultationListResponse,
  ConsultationMutationResponse,
} from "./consultation.type";

export const consultationService = {
  getAll(page = 0, size = 10) {
    return apiClient.get<ConsultationListResponse>(
      CONSULTATION.GET_ALL,
      { params: { page, size } }
    );
  },

  getById(id: number) {
    return apiClient.get<ConsultationGetResponse>(
      CONSULTATION.GET_BY_ID.replace(":id", String(id))
    );
  },

  getByUser(id: number, page = 0, size = 10) {
    return apiClient.get<ConsultationListResponse>(
      CONSULTATION.GET_BY_USER.replace(":id", String(id)),
      { params: { page, size } }
    );
  },

  create(data: ConsultationCreateDTO) {
    return apiClient.post<ConsultationMutationResponse>(
      CONSULTATION.CREATE,
      data
    );
  },

  update(id: number, data: ConsultationUpdateDTO) {
    return apiClient.put<ConsultationMutationResponse>(
      CONSULTATION.UPDATE.replace(":id", String(id)),
      data
    );
  },

  delete(id: number) {
    return apiClient.delete<ConsultationMutationResponse>(
      CONSULTATION.DELETE.replace(":id", String(id))
    );
  },
};