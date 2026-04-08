import { lavozimService } from "@/features/lavozim/lavozim.service";
import { useQuery } from "@tanstack/react-query";

export function useLavozimStatistics() {
  return useQuery({
    queryKey: ["lavozimlar", "statistics"],
    queryFn: () => lavozimService.getStatistics(),
  });
}