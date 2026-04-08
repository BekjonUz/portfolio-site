import { awardService } from "@/features/award/award.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteAward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => awardService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Mukofot muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Mukofotni o'chirishda xatolik");
    },
  });
}