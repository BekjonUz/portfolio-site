import { researchService } from "@/features/research/research.service";
import { useQuery } from "@tanstack/react-query";
 
export function useGetResearchByUser(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["researches", "byUser", userId, page, size],
    queryFn: () => researchService.getByUser(userId, page, size),
    enabled: !!userId,
  });
}