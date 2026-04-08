import { apiClient } from "@/api/client";
import type {
  LavozimListResponse,
  LavozimCreateResponse,
  LavozimUpdateResponse,
  LavozimDeleteResponse,
  LavozimStatisticsResponse,
  CreateLavozimDTO,
} from "./lavozim.type";
import { LAVOZIM } from "@/constants/apiEndpoint";

export const lavozimService = {
  getAll() {
    return apiClient.get<LavozimListResponse>(LAVOZIM.GETALL);
  },

  create(data: CreateLavozimDTO) {
    return apiClient.post<LavozimCreateResponse>(LAVOZIM.CREATE, data);
  },

  update(id: number, data: CreateLavozimDTO) {
    return apiClient.put<LavozimUpdateResponse>(
      LAVOZIM.UPDATE.replace(":id", id.toString()),
      data
    );
  },

  delete(id: number) {
    return apiClient.delete<LavozimDeleteResponse>(
      LAVOZIM.DELETE.replace(":id", id.toString())
    );
  },

  getStatistics() {
    return apiClient.get<LavozimStatisticsResponse>(LAVOZIM.STATISTICS);
  },
};