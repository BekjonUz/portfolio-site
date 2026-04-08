import { departmentService } from "@/features/department/department.service";
import { CreateDepartmentDTO } from "@/features/department/department.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditDepartmentInput {
  id: number;
  name: string;
  collegeId: number;
  image?: File;
  imgUrl?: string;
}

export function useEditDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EditDepartmentInput) => {
      const imgUrl = input.image
        ? await fileService.uploadImage(input.image)
        : (input.imgUrl ?? "");

      const departmentData: CreateDepartmentDTO = {
        name: input.name,
        imgUrl,
        collegeId: input.collegeId,
      };
      return departmentService.edit(input.id, departmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments"] });
      toast.success("Kafedra muvaffaqiyatli tahrirlandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Kafedra tahrirlashda xatolik");
    },
  });
}