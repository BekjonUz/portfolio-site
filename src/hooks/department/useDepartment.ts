import { departmentService } from "@/features/department/department.service";
import { useQuery } from "@tanstack/react-query";

export function useDepartment() {
  return useQuery({
    queryKey: ["departments"],
    queryFn: () => departmentService.getAll(),
  });
}