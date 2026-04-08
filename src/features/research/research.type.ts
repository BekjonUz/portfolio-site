export type MemberEnum = "MILLIY" | "XALQARO";

export interface Research {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: MemberEnum;
}

export interface ResearchCreateDTO {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: MemberEnum;
}

export interface ResearchUpdateDTO {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  univerName: string;
  finished: boolean;
  memberEnum: MemberEnum;
}

export interface ResearchPaginatedData {
  page: number;
  size: number;
  totalPage: number;
  totalElements: number;
  body: Research[];
}

export interface ResearchGetResponse {
  success: boolean;
  message: string;
  data: Research;
}

export interface ResearchListResponse {
  success: boolean;
  message: string;
  data: ResearchPaginatedData;
}

export interface ResearchMutationResponse {
  success: boolean;
  message: string;
  data: string;
}