import { lavozimService } from "@/features/lavozim/lavozim.service";
import { CreateLavozimDTO } from "@/features/lavozim/lavozim.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditLavozimInput {
  id: number;
  data: CreateLavozimDTO;
}

export function useEditLavozim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EditLavozimInput) => {
      return lavozimService.update(input.id, input.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lavozimlar"] });
      toast.success("Lavozim muvaffaqiyatli tahrirlandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Lavozim tahrirlashda xatolik");
    },
  });
}