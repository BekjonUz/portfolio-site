import { apiClient } from "@/api/client";
import type {
  TeacherGetResponse,
  TeacherSearchResponse,
  TeacherCreateResponse,
  TeacherUpdateResponse,
  TeacherDeleteResponse,
  CreateTeacherDTO,
  UpdateTeacherProfileDTO,
  EditTeacherDTO,
  TeacherSearchParams,
} from "./teacher.type";
import { TEACHER } from "@/constants/apiEndpoint";

export const teacherService = {
  getAll(params?: TeacherSearchParams) {
    return apiClient.get<TeacherSearchResponse>(TEACHER.GETALL, { params });
  },

  getById(userId: number, page = 0, size = 10) {
    return apiClient.get<TeacherGetResponse>(
      TEACHER.GET_BY_ID.replace(":id", userId.toString()),
      { params: { page, size } }
    );
  },

  save(data: CreateTeacherDTO) {
    return apiClient.post<TeacherCreateResponse>(TEACHER.CREATE, data);
  },

  updateProfile(data: UpdateTeacherProfileDTO) {
    return apiClient.put<TeacherUpdateResponse>(TEACHER.UPDATE_PROFILE, data);
  },

  editSelf(data: EditTeacherDTO) {
    return apiClient.put<TeacherUpdateResponse>(TEACHER.EDIT_SELF, data);
  },

  delete(userId: number) {
    return apiClient.delete<TeacherDeleteResponse>(
      TEACHER.DELETE.replace(":id", userId.toString())
    );
  },
};