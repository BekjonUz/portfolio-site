import { teacherService } from "@/features/teacher/teacher.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return teacherService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli o'chirildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "O'qituvchini o'chirishda xatolik");
    },
  });
}