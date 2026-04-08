export type MemberEnum = "MILLIY" | "XALQARO";

export interface Nazorat {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string | null;
  userId: number;
  researcherName: string;
  univerName: string;
  level: string;
  memberEnum: MemberEnum;
  finished: boolean;
}

export interface NazoratCreateDTO {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  researcherName: string;
  univerName: string;
  level: string;
  memberEnum: MemberEnum;
  finished: boolean;
}

export interface NazoratUpdateDTO extends NazoratCreateDTO {}

export interface NazoratPaginatedData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: Nazorat[];
}

export interface NazoratGetResponse {
  success: boolean;
  message: string;
  data: Nazorat;
}

export interface NazoratListResponse {
  success: boolean;
  message: string;
  data: NazoratPaginatedData;
}

export interface NazoratMutationResponse {
  success: boolean;
  message: string;
  data: string;
}