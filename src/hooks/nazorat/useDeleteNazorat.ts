import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteNazorat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => nazoratService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nazoratlar"] });
      toast.success("Nazorat muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nazoratni o'chirishda xatolik");
    },
  });
}