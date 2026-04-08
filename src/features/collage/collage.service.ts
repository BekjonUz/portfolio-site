import { apiClient } from "@/api/client";
import type { CollageListResponse, CollageCreateResponse, CreateCollageDTO,CollageDeleteResponse } from "./collage.type";
import { COLLAGE } from "@/constants/apiEndpoint";

export const collageService = {
	getAll() {
		return apiClient.get<CollageListResponse>(COLLAGE.GETALL);
	},
	create(data: CreateCollageDTO) {
		return apiClient.post<CollageCreateResponse>(COLLAGE.CREATE, data);
	},
	delete(id:number){
		return apiClient.delete<CollageDeleteResponse>(COLLAGE.DELETE.replace(":id", id.toString()));
	},
	edit(id:number, data: CreateCollageDTO) {
		return apiClient.put<CollageCreateResponse>(COLLAGE.EDIT.replace(":id", id.toString()), data);
	},
};