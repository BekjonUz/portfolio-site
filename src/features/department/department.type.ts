export interface CreateDepartmentDTO {
  name: string;
  imgUrl?: string;
  collegeId: number;
}

export interface Department {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
}

export interface DepartmentListResponse {
  success: boolean;
  message: string;
  data: Department[];
}

export interface DepartmentPageResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Department[];
  };
}

export interface DepartmentCreateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface DepartmentUpdateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface DepartmentDeleteResponse {
  success: boolean;
  message: string;
  data: string;
}