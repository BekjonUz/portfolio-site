import { teacherService } from "@/features/teacher/teacher.service";
import type { UpdateTeacherProfileDTO } from "@/features/teacher/teacher.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateTeacherProfileInput {
  id: number;
  fullName: string;
  phoneNumber: string;
  email: string;
  biography: string;
  input: string;
  age: number;
  orcId: string;
  scopusId: string;
  scienceId: string;
  researcherId: string;
  gender: boolean;
  profession: string;
  lavozmId: number;
  departmentId: number;
  image?: File | string;
  imageUrl?: string;
  file?: File | string;
  fileUrl?: string;
}
export function useUpdateTeacherProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: UpdateTeacherProfileInput) => {
      // 1. Fayllarni tekshirish (oldingi xatolik yechimi)
      const imageUrl = (input.image instanceof File)
        ? await fileService.uploadImage(input.image)
        : (input.imageUrl ?? "");

      const fileUrl = (input.file instanceof File)
        ? await fileService.uploadPdf(input.file)
        : (input.fileUrl ?? "");

      // 2. Swagger talab qilgan formatda DTO shakllantirish
      const data: UpdateTeacherProfileDTO = {
        id: Number(input.id),
        fullName: input.fullName,
        phoneNumber: input.phoneNumber || "",
        email: input.email || "",
        biography: input.biography || "",
        input: input.input || "",
        age: Number(input.age) || 0,
        orcId: input.orcId || "",
        scopusId: input.scopusId || "",
        scienceId: input.scienceId || "",
        researcherId: input.researcherId || "",
        gender: Boolean(input.gender),
        imageUrl: imageUrl,
        fileUrl: fileUrl,
        profession: input.profession || "",
        // MUHIM: null ketsa server 500 berishi mumkin, shuning uchun raqamga o'tkazamiz
        lavozmId: input.lavozmId ? Number(input.lavozmId) : 0, 
        departmentId: input.departmentId ? Number(input.departmentId) : 0,
      };

      return teacherService.updateProfile(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Profil yangilandi");
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Server xatosi (500)");
    }
  });
}