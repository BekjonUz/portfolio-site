// features/publication/hooks/useDeletePublication.ts
import { publicationService } from "@/features/publication/publication.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeletePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => publicationService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("Nashr muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nashrni o'chirishda xatolik");
    },
  });
}