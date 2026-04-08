import { apiClient } from "@/api/client";
import type {
  DepartmentListResponse,
  DepartmentCreateResponse,
  DepartmentUpdateResponse,
  DepartmentDeleteResponse,
  CreateDepartmentDTO,
} from "./department.type";
import { DEPARTMENT } from "@/constants/apiEndpoint";

export const departmentService = {
  getAll() {
    return apiClient.get<DepartmentListResponse>(DEPARTMENT.GET);
  },
  create(data: CreateDepartmentDTO) {
    return apiClient.post<DepartmentCreateResponse>(DEPARTMENT.CREATE, data);
  },
  delete(id: number) {
    return apiClient.delete<DepartmentDeleteResponse>(
      DEPARTMENT.DELETE.replace(":id", id.toString())
    );
  },
  edit(id: number, data: CreateDepartmentDTO) {
    return apiClient.put<DepartmentUpdateResponse>(
      DEPARTMENT.EDIT.replace(":id", id.toString()),
      data
    );
  },
};