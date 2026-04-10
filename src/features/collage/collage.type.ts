export interface CreateCollageDTO {
  name: string;
  imgUrl?: string;
}

export interface Collage {
  id: number;
  name: string;
  imgUrl: string;
}

export interface CollageListResponse {
  success: boolean;
  message: string;
  data: Collage[];
}

export interface CollagePageResponse {
  success: boolean;
  message: string;
  data: {
    page: number;
    size: number;
    totalPage: number;
    totalElements: number;
    body: Collage[];
  };
}

export interface CollageCreateResponse {
  success: boolean;
  message: string;
  data: Collage;
}

export interface CollageDeleteResponse {
  success: boolean;
  message: string;
  data: Collage;
}