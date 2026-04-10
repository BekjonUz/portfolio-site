import { departmentService } from "@/features/department/department.service";
import { useQuery } from "@tanstack/react-query";

export function useDepartmentPage(page = 0, size = 10, name?: string, collegeId?: number) {
  return useQuery({
    queryKey: ["departments", "page", page, size, name, collegeId],
    queryFn: () => departmentService.getPage(page, size, name, collegeId),
  });
}