import { awardService } from "@/features/award/award.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateAward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: awardService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Mukofot muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Mukofot qo'shishda xatolik");
    },
  });
}