export interface CreateLavozimDTO {
  name: string;
}
export interface Lavozim {
  id: number;
  name: string;
}
export interface LavozimStatistics {
  [key: string]: object;
}
export interface LavozimListResponse {
  success: boolean;
  message: string;
  data: Lavozim[];
}

export interface LavozimCreateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface LavozimUpdateResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface LavozimDeleteResponse {
  success: boolean;
  message: string;
  data: string;
}

export interface LavozimStatisticsResponse {
  success: boolean;
  message: string;
  data: LavozimStatistics;
}