import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
export function useCreateNazorat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: nazoratService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nazoratlar"] });
      toast.success("Nazorat muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nazorat qo'shishda xatolik");
    },
  });
}
