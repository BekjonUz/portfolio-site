import { departmentService } from "@/features/department/department.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteDepartmentInput {
  id: number;
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: DeleteDepartmentInput) => {
      return departmentService.delete(input.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Kafedra muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Kafedra o'chirishda xatolik");
    },
  });
}