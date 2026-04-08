import { lavozimService } from "@/features/lavozim/lavozim.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteLavozim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      return lavozimService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lavozimlar"] });
      toast.success("Lavozim muvaffaqiyatli o'chirildi");
    },
    onError: (error: {
      response?: { data?: { message?: string } };
      message: string;
    }) => {
      const serverMessage = error?.response?.data?.message ?? "";

      if (serverMessage.includes("foreign key constraint")) {
        toast.error(
          "Bu lavozimga bog'liq xodimlar mavjud. Avval xodimlarni o'chiring yoki lavozimini o'zgartiring.",
        );
      } else {
        toast.error("Bu lavozimga bog'liq xodimlar mavjud. Avval xodimlarni o'chiring yoki lavozimini o'zgartiring");
      }
    },
  });
}
