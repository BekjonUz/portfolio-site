import { teacherService } from "@/features/teacher/teacher.service";
import { useQuery } from "@tanstack/react-query";

export function useGetTeacherById(userId: number, page = 0, size = 10) {
  return useQuery({
    queryKey: ["teachers", userId, page, size],
    queryFn: () => teacherService.getById(userId, page, size),
    enabled: !!userId,
  });
}