import { teacherService } from "@/features/teacher/teacher.service";
import type { EditTeacherDTO } from "@/features/teacher/teacher.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditTeacherInput {
  id: number;
  fullName: string;
  phoneNumber: string;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
  image?: File;
  imgUrl?: string;
  file?: File;
  fileUrl?: string;
}

export function useEditTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EditTeacherInput) => {
      const imgUrl = input.image
        ? await fileService.uploadImage(input.image)
        : (input.imgUrl ?? "");

      const fileUrl = input.file
        ? await fileService.uploadPdf(input.file)
        : (input.fileUrl ?? "");

      const data: EditTeacherDTO = {
        id: input.id,
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        imgUrl,
        fileUrl,
        lavozmId: input.lavozmId,
        gender: input.gender,
        password: input.password,
        departmentId: input.departmentId,
      };

      return teacherService.editSelf(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli tahrirlandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "O'qituvchini tahrirlashda xatolik");
    },
  });
}