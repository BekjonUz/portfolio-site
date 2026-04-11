import { userService } from "@/features/user/user.service";
import { useQuery } from "@tanstack/react-query";

export function useProfileCompletion(userId: number) {
  return useQuery({
    queryKey: ["profile-completion", userId],
    queryFn: () => userService.getProfileCompletion(userId),
    enabled: !!userId,
  });
}