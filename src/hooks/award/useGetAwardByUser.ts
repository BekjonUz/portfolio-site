import { awardService } from "@/features/award/award.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAwardByUser(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["awards", "byUser", userId, page, size],
    queryFn: () => awardService.getByUser(userId, page, size),
    enabled: !!userId,
  });
}