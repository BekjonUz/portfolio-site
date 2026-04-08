export interface CreateTeacherDTO {
  fullName: string;
  phoneNumber: string;
  imgUrl: string;
  fileUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface UpdateTeacherProfileDTO {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  biography: string;
  input: string;
  age: number;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  imageUrl: string;
  fileUrl: string;
  profession: string;
  lavozmId: number;
  departmentId: number;
}

export interface EditTeacherDTO {
  id: number;
  fullName: string;
  phoneNumber: string;
  imgUrl: string;
  fileUrl: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export interface Teacher {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  biography: string;
  input: string;
  age: number;
  gender: boolean;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  imageUrl: string;
  fileUrl: string;
  profession: string;
  departmentName: string; 
  lavozimName: string;
}

export interface TeacherSearchParams {
  name?: string;
  college?: string;
  lavozim?: string;
  page?: number;
  size?: number;
}

export interface TeacherPaginatedData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: Teacher[];
}

export interface TeacherGetResponse {
  success: boolean;
  message: string;
  data: Teacher;
}

export interface TeacherSearchResponse {
  success: boolean;
  message: string;
  data: TeacherPaginatedData;
}

export interface TeacherCreateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface TeacherUpdateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface TeacherDeleteResponse {
  success: boolean;
  message: string;
  data: string;
}