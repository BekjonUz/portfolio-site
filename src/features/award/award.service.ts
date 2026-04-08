import { apiClient } from "@/api/client";
import { AWARD } from "@/constants/apiEndpoint";
import type {
  AwardCreateDTO,
  AwardUpdateDTO,
  AwardGetResponse,
  AwardListResponse,
  AwardMutationResponse,
} from "./award.type";

export const awardService = {
  getAll(page = 0, size = 10) {
    return apiClient.get<AwardListResponse>(AWARD.GET_ALL, {
      params: { page, size },
    });
  },

  getById(id: number) {
    return apiClient.get<AwardGetResponse>(
      AWARD.GET_BY_ID.replace(":id", String(id))
    );
  },

  getByUser(id: number, page = 0, size = 10) {
    return apiClient.get<AwardListResponse>(
      AWARD.GET_BY_USER.replace(":id", String(id)),
      { params: { page, size } }
    );
  },

  create(data: AwardCreateDTO) {
    return apiClient.post<AwardMutationResponse>(AWARD.CREATE, data);
  },

  update(id: number, data: AwardUpdateDTO) {
    return apiClient.put<AwardMutationResponse>(
      AWARD.UPDATE.replace(":id", String(id)),
      data
    );
  },

  delete(id: number) {
    return apiClient.delete<AwardMutationResponse>(
      AWARD.DELETE.replace(":id", String(id))
    );
  },
};