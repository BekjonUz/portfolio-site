export type AwardEnum =
  | "Trening_Va_Amaliyot"
  | "Tahririyat_Kengashiga_Azolik"
  | "Maxsus_Kengash_Azoligi"
  | "Patent_Dgu"
  | "Davlat_Mukofoti";

export type MemberEnum = "MILLIY" | "XALQARO";

export interface AwardCreateDTO {
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}

export interface AwardUpdateDTO extends AwardCreateDTO {}

export interface AwardItem {
  id: number;
  name: string;
  description: string;
  year: number;
  fileUrl: string;
  userId: number;
  awardEnum: AwardEnum;
  memberEnum: MemberEnum;
}

export interface AwardGetResponse {
  success: boolean;
  message: string;
  data: AwardItem;
}

export interface AwardListResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: AwardItem[];
  };
}

export interface AwardMutationResponse {
  success: boolean;
  message: string;
  data: string;
}