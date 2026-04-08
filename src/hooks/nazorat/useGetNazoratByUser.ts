import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useQuery } from "@tanstack/react-query";

export function useGetNazoratByUser(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["nazoratlar", "byUser", userId, page, size],
    queryFn: () => nazoratService.getByUser(userId, page, size),
    enabled: !!userId,
  });
}