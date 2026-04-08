import { consultationService } from "@/features/consultation/consultation.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateConsultation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: consultationService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      toast.success("Consultation muvaffaqiyatli qo'shildi");
    },
    onError: (error: any) => {
      toast.error(error.message || "Xatolik yuz berdi");
    },
  });
}