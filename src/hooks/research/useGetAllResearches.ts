import { researchService } from "@/features/research/research.service";
import { useQuery } from "@tanstack/react-query";
 
export function useGetAllResearches(page = 0, size = 10) {
  return useQuery({
    queryKey: ["researches", page, size],
    queryFn: () => researchService.getAll(page, size),
  });
}