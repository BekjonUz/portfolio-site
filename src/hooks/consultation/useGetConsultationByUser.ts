import { consultationService } from "@/features/consultation/consultation.service";
import { useQuery } from "@tanstack/react-query";

export function useGetConsultationByUser(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["consultations", "byUser", userId, page, size],
    queryFn: () => consultationService.getByUser(userId, page, size),
    enabled: !!userId,
  });
}