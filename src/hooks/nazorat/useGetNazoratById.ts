import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useQuery } from "@tanstack/react-query";

export function useGetNazoratById(id: number) {
  return useQuery({
    queryKey: ["nazoratlar", id],
    queryFn: () => nazoratService.getById(id),
    enabled: !!id,
  });
}