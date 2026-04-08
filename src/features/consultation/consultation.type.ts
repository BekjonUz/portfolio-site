export type FinishedEnum = "COMPLETED" | "IN_PROGRESS" | "FINISHED";

export interface ConsultationCreateDTO {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

export interface ConsultationUpdateDTO extends ConsultationCreateDTO {}

export interface ConsultationItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  member: boolean;
  finishedEnum: FinishedEnum;
  leader: string;
}

export interface ConsultationGetResponse {
  success: boolean;
  message: string;
  data: ConsultationItem;
}

export interface ConsultationListResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: ConsultationItem[];
  };
}

export interface ConsultationMutationResponse {
  success: boolean;
  message: string;
  data: string;
}