import { teacherService } from "@/features/teacher/teacher.service";
import type { CreateTeacherDTO } from "@/features/teacher/teacher.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateTeacherInput {
  fullName: string;
  phoneNumber: string;
  image: File;
  file: File;
  lavozmId: number;
  gender: boolean;
  password: string;
  departmentId: number;
}

export function useCreateTeacher() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTeacherInput) => {
      const imgUrl = await fileService.uploadImage(input.image);
      const fileUrl = await fileService.uploadPdf(input.file);

      const data: CreateTeacherDTO = {
        fullName: input.fullName,
        phoneNumber: input.phoneNumber,
        imgUrl,
        fileUrl,
        lavozmId: input.lavozmId,
        gender: input.gender,
        password: input.password,
        departmentId: input.departmentId,
      };

      return teacherService.save(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("O'qituvchi muvaffaqiyatli qo'shildi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "O'qituvchi qo'shishda xatolik");
    },
  });
}