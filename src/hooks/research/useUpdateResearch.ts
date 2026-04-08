import { researchService } from "@/features/research/research.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
 
export function useUpdateResearch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof researchService.update>[1] }) =>
      researchService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["researches"] });
      toast.success("Tadqiqot muvaffaqiyatli yangilandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Tadqiqotni yangilashda xatolik");
    },
  });
}
 