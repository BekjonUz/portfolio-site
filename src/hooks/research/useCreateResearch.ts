import { researchService } from "@/features/research/research.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
 
export function useCreateResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: researchService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      toast.success("Tadqiqot muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Tadqiqot qo'shishda xatolik");
    },
  });
}
 