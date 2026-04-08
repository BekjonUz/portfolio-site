import { userService } from "@/features/user/user.service";
import { UserProfile } from "@/features/user/user.type"; 
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  // queryKey uchun 'user-me' yetarli, chunki u joriy foydalanuvchini olib keladi
  return useQuery({
    queryKey: ["user-me"], 
    queryFn: async (): Promise<UserProfile> => {
      const response = await userService.getMe();
      
      // Backenddan { success, message, data: { ... } } keladi
      // Bizga faqat 'data' ichidagilar (id, fullName va h.k.) kerak
      return response.data; 
    },
    // Bu so'rov har doim ishga tushishi kerak
    staleTime: 1000 * 60 * 5, // 5 daqiqa keshda saqlaydi
  });
}