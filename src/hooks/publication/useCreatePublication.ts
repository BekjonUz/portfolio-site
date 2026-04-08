// features/publication/hooks/useCreatePublication.ts
import { publicationService } from "@/features/publication/publication.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publicationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("Nashr muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nashr qo'shishda xatolik");
    },
  });
}