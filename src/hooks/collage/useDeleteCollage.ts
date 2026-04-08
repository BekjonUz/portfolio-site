import { collageService } from "@/features/collage/collage.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCollageInput {
	id:number;
}

export function useDeleteCollage() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (input: DeleteCollageInput) => {
			return collageService.delete(input.id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["collages"] });
			toast.success("Fakultet muvaffaqiyatli o'chirildi");
		},
		onError: (error: { message: string }) => {
			toast.error(error.message || "Fakultet o'chirishda xatolik");
		},
	});
}
