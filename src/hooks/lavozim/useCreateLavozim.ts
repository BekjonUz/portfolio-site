import { lavozimService } from "@/features/lavozim/lavozim.service";
import { CreateLavozimDTO } from "@/features/lavozim/lavozim.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateLavozim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateLavozimDTO) => {
      return lavozimService.create(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lavozimlar"] });
      toast.success("Lavozim muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Lavozim qo'shishda xatolik");
    },
  });
}