import { departmentService } from "@/features/department/department.service";
import { CreateDepartmentDTO } from "@/features/department/department.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateDepartmentInput {
  name: string;
  image: File;
  collegeId: number;
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDepartmentInput) => {
      const imgUrl = await fileService.uploadImage(input.image);
      const departmentData: CreateDepartmentDTO = {
        name: input.name,
        imgUrl,
        collegeId: input.collegeId,
      };

      return departmentService.create(departmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Kafedra muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Kafedra qo'shishda xatolik");
    },
  });
}