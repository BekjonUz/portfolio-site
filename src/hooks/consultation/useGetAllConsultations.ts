import { useQuery } from "@tanstack/react-query";
import { consultationService } from "@/features/consultation/consultation.service";

export function useGetAllConsultations(page = 0, size = 10) {
  return useQuery({
    queryKey: ["consultations", page, size],
    queryFn: () => consultationService.getAll(page, size),
  });
}