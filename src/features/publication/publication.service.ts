// features/publication/publication.service.ts

import { apiClient } from "@/api/client";
import { PUBLICATION } from "@/constants/apiEndpoint";
import type {
  PublicationCreateDTO,
  PublicationUpdateDTO,
  PublicationGetResponse,
  PublicationListResponse,
  PublicationMutationResponse,
} from "./publication.type";

export const publicationService = {
  getAll(page = 0, size = 10) {
    return apiClient.get<PublicationListResponse>(PUBLICATION.GET_ALL, {
      params: { page, size },
    });
  },

  getById(publicationId: number) {
    return apiClient.get<PublicationGetResponse>(
      PUBLICATION.GET_BY_ID.replace(":publicationId", String(publicationId))
    );
  },

  getByUser(id: number, page = 0, size = 10) {
    return apiClient.get<PublicationListResponse>(
      PUBLICATION.GET_BY_USER.replace(":id", String(id)),
      { params: { page, size } }
    );
  },

  create(data: PublicationCreateDTO) {
    return apiClient.post<PublicationMutationResponse>(PUBLICATION.CREATE, data);
  },

  update(id: number, data: PublicationUpdateDTO) {
    return apiClient.put<PublicationMutationResponse>(
      PUBLICATION.UPDATE.replace(":id", String(id)),
      data
    );
  },

  delete(id: number) {
    return apiClient.delete<PublicationMutationResponse>(
      PUBLICATION.DELETE.replace(":id", String(id))
    );
  },
};