import { teacherService } from "@/features/teacher/teacher.service";
import type { TeacherSearchParams } from "@/features/teacher/teacher.type";
import { useQuery } from "@tanstack/react-query";

export function useGetAllTeachers(params?: TeacherSearchParams) {
  return useQuery({
    queryKey: ["teachers", params],
    queryFn: () => teacherService.getAll(params),
  });
}