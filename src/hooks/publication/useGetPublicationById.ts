// features/publication/hooks/useGetPublicationById.ts
import { publicationService } from "@/features/publication/publication.service";
import { useQuery } from "@tanstack/react-query";

export function useGetPublicationById(publicationId: number) {
  return useQuery({
    queryKey: ["publications", publicationId],
    queryFn: () => publicationService.getById(publicationId),
    enabled: !!publicationId,
  });
}