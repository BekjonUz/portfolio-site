// features/publication/publication.type.ts

export type PublicationTypeEnum = "ARTICLE" | "BOOK" | "PROCEEDING" | "OTHERS";
export type AuthorEnum = "COAUTHOR" | "FIRST_AUTHOR" | "BOTH_AUTHOR";
export type DegreeEnum = "INTERNATIONAL" | "NATIONAL";

export interface PublicationCreateDTO {
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationTypeEnum;
  author: AuthorEnum;
  degree: DegreeEnum;
  volume: string;
  institution: string;
  popular: boolean;
}

export interface PublicationUpdateDTO extends PublicationCreateDTO {}

export interface PublicationItem {
  id: number;
  userId: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  type: PublicationTypeEnum;
  author: AuthorEnum;
  degree: DegreeEnum;
  volume: string;
  institution: string;
  popular: boolean;
}

export interface PublicationGetResponse {
  success: boolean;
  message: string;
  data: PublicationItem;
}

export interface PublicationListResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: PublicationItem[];
  };
}

export interface PublicationMutationResponse {
  success: boolean;
  message: string;
  data: string;
}