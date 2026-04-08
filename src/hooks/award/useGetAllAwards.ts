import { awardService } from "@/features/award/award.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAllAwards(page = 0, size = 10) {
  return useQuery({
    queryKey: ["awards", page, size],
    queryFn: () => awardService.getAll(page, size),
  });
}