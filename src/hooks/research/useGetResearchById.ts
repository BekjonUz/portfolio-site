import { researchService } from "@/features/research/research.service";
import { useQuery } from "@tanstack/react-query";
 
export function useGetResearchById(id: number) {
  return useQuery({
    queryKey: ["researches", id],
    queryFn: () => researchService.getById(id),
    enabled: !!id,
  });
}