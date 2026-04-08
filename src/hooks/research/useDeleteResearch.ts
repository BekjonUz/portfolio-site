import { researchService } from "@/features/research/research.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
 
export function useDeleteResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => researchService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      toast.success("Tadqiqot muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Tadqiqotni o'chirishda xatolik");
    },
  });
}