import { awardService } from "@/features/award/award.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateAward() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof awardService.update>[1] }) =>
      awardService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast.success("Mukofot muvaffaqiyatli yangilandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Mukofotni yangilashda xatolik");
    },
  });
}