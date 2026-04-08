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
  role: string;
  age?: number;
  gender?: boolean;
  biography?: string | null;
  departmentName?: string | null;
  lavozimName?: string | null;
  orcId?: string;
  scopusId?: string;
  scienceId?: string;
  researcherId?: string;
}