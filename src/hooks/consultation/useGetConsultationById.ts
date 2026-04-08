import { consultationService } from "@/features/consultation/consultation.service";
import { useQuery } from "@tanstack/react-query";

export function useGetConsultationById(id: number) {
  return useQuery({
    queryKey: ["consultations", id],
    queryFn: () => consultationService.getById(id),
    enabled: !!id,
  });
}