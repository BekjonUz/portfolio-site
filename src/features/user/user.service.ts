import { apiClient } from "@/api/client";
import type { UserResponse, ProfileCompletionResponse } from "./user.type";
import { USER } from "@/constants/apiEndpoint";

export const userService = {
  getMe() {
    return apiClient.get<UserResponse>(USER.USER_ME);
  },

  getProfileCompletion(userId: number) {
    return apiClient.get<ProfileCompletionResponse>(
      USER.PROFILE_COMPLETION.replace(":userId", String(userId))
    );
  },
};