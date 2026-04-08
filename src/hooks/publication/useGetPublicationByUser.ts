// features/publication/hooks/useGetPublicationByUser.ts
import { publicationService } from "@/features/publication/publication.service";
import { useQuery } from "@tanstack/react-query";

export function useGetPublicationByUser(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["publications", "byUser", userId, page, size],
    queryFn: () => publicationService.getByUser(userId, page, size),
    enabled: !!userId,
  });
}