import { nazoratService } from "@/features/nazorat/nazorat.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useUpdateNazorat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Parameters<typeof nazoratService.update>[1] }) =>
      nazoratService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nazoratlar"] });
      toast.success("Nazorat muvaffaqiyatli yangilandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Nazoratni yangilashda xatolik");
    },
  });
}