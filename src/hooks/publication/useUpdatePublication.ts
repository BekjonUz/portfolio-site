// features/publication/hooks/useUpdatePublication.ts
import { publicationService } from "@/features/publication/publication.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdatePublication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof publicationService.update>[1] }) =>
      publicationService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      toast.success("Nashr muvaffaqiyatli yangilandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nashrni yangilashda xatolik");
    },
  });
}