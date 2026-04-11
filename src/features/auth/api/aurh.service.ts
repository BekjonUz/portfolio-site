import { apiClient } from "@/api/client";
import { LoginDTO, LoginResponse } from "./auth.type";
import { LOGIN } from "@/constants/apiEndpoint";

export const authService = {
  login(data: LoginDTO) {
    return apiClient.post<LoginResponse>(LOGIN, {
      phone: data.phone.replace(/^\+/, ""),
      password: data.password,
    });
  },
};
