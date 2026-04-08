import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAllNazoratlar(page = 0, size = 10) {
  return useQuery({
    queryKey: ["nazoratlar", page, size],
    queryFn: () => nazoratService.getAll(page, size),
  });
}