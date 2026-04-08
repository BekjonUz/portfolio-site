// features/publication/hooks/useGetAllPublications.ts
import { publicationService } from "@/features/publication/publication.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAllPublications(page = 0, size = 10) {
  return useQuery({
    queryKey: ["publications", page, size],
    queryFn: () => publicationService.getAll(page, size),
  });
}