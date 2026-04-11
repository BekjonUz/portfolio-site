export interface PagedData<T> {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: T[];
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UserProfile {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  imageUrl: string | null;
  fileUrl: string | null;
  role: string;
  age?: number;
  gender?: boolean;
  biography?: string | null;
  input?: string | null;
  profession?: string | null;
  departmentName?: string | null;
  lavozimName?: string | null;
  orcId?: string;
  scopusId?: string;
  scienceId?: string;
  researcherId?: string;
  research?: PagedData<any>;
  nazorat?: PagedData<any>;
  publication?: PagedData<any>;
  consultation?: PagedData<any>;
  award?: PagedData<any>;
}

export interface ProfileCompletionResponse {
  success: boolean;
  message: string;
  data: number;
}