import { awardService } from "@/features/award/award.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAwardById(id: number) {
  return useQuery({
    queryKey: ["awards", id],
    queryFn: () => awardService.getById(id),
    enabled: !!id,
  });
}