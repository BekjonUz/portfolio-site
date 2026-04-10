import { collageService } from "@/features/collage/collage.service";
import { useQuery } from "@tanstack/react-query";

export function useCollagePage(page = 0, size = 10, name?: string) {
  return useQuery({
    queryKey: ["collages", "page", page, size, name],
    queryFn: () => collageService.getPage(page, size, name),
  });
}