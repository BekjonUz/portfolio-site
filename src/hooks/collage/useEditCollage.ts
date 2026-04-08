import { collageService } from "@/features/collage/collage.service";
import { CreateCollageDTO } from "@/features/collage/collage.type";
import { fileService } from "@/features/file/file.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface EditCollageInput {
  id: number;
  name: string;
  image?: File;
  imgUrl?: string;
}

export function useEditCollage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: EditCollageInput) => {
      const imgUrl = input.image
        ? await fileService.uploadImage(input.image)
        : (input.imgUrl ?? "");

      const collageData: CreateCollageDTO = {
        name: input.name,
        imgUrl,
      };
      return collageService.edit(input.id, collageData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collages"] });
      toast.success("Fakultet muvaffaqiyatli tahrirlandi");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Fakultet tahrirlashda xatolik");
    },
  });
}