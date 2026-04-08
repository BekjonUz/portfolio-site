import { lavozimService } from "@/features/lavozim/lavozim.service";
import { useQuery } from "@tanstack/react-query";

export function useLavozim() {
  return useQuery({
    queryKey: ["lavozimlar"],
    queryFn: () => lavozimService.getAll(),
  });
}