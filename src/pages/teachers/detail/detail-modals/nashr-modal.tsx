import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "sonner";

import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { useCreatePublication } from "@/hooks/publication/useCreatePublication";
import { useUpdatePublication } from "@/hooks/publication/useUpdatePublication";
import { useUser } from "@/hooks/user/useUser";
import { fileService } from "@/features/file/file.service";

type NashrFormData = {
  name: string;
  description: string;
  year: string;
  organization: string;
  type: "ARTICLE" | "BOOK" | "PROCEEDING" | "OTHERS" | "";
  author: "COAUTHOR" | "FIRST_AUTHOR" | "BOTH_AUTHOR" | "";
  degree: "INTERNATIONAL" | "NATIONAL" | "";
  volume: string;
  popular: boolean;
  pdf: File | null;
};

export function NashrModal() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const isOpen = useModalIsOpen();
  const editData = useModalEditData();
  const { close } = useModalActions();
  const [isUploading, setIsUploading] = useState(false);

  const visible = isOpen && editData?._type === "publication";
  const isEdit = visible && !!editData?.id;
  const userId = paramsId || userData?.id;

  const { mutate: createPub, isPending: isCreating } = useCreatePublication();
  const { mutate: updatePub, isPending: isUpdating } = useUpdatePublication();

  const isPending = isCreating || isUpdating || isUploading;

  const { register, handleSubmit, control, reset } = useForm<NashrFormData>({
    defaultValues: {
      name: "",
      description: "",
      year: "",
      organization: "",
      type: "",
      author: "",
      degree: "",
      volume: "",
      popular: false,
      pdf: null,
    },
  });

  useEffect(() => {
    if (visible && isEdit) {
      reset({
        name: editData.name ?? "",
        description: editData.description ?? "",
        year: String(editData.year ?? ""),
        organization: editData.institution ?? "",
        type: editData.type ?? "",
        author: editData.author ?? "",
        degree: editData.degree ?? "",
        volume: editData.volume ?? "",
        popular: !!editData.popular,
        pdf: null,
      });
    } else if (visible && !isEdit) {
      reset({ name: "", description: "", year: "", organization: "", type: "", author: "", degree: "", volume: "", popular: false, pdf: null });
    }
  }, [visible, isEdit, editData, reset]);

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: NashrFormData) => {
    if (!userId) return toast.error("User ID missing");

    try {
      let finalFileUrl = editData?.fileUrl ?? "";

      if (data.pdf) {
        setIsUploading(true);
        finalFileUrl = await fileService.uploadPdf(data.pdf);
        setIsUploading(false);
      }

      const payload = {
        name: data.name,
        description: data.description,
        year: Number(data.year),
        fileUrl: finalFileUrl,
        userId: Number(userId),
        type: data.type as any,
        author: data.author as any,
        degree: data.degree as any,
        volume: data.volume,
        institution: data.organization,
        popular: data.popular,
      };

      if (isEdit) {
        updatePub({ id: Number(editData.id), data: payload }, { onSuccess: handleClose });
      } else {
        createPub(payload, { onSuccess: handleClose });
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Operation failed");
    }
  };

  return (
    <Modal open={visible} onClose={handleClose} title={isEdit ? "Nashrni tahrirlash" : "Nashr qo'shish"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <Label>Nashr nomi</Label>
          <Input {...register("name", { required: true })} placeholder="Nomini kiriting..." />
        </div>

        <div className="flex flex-col gap-1">
          <Label>Tavsif</Label>
          <Textarea {...register("description")} className="min-h-[70px] resize-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <Label>Yil</Label>
            <Input type="number" {...register("year")} />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Muassasa / Tashkilot</Label>
            <Input {...register("organization")} />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Nashr turi</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARTICLE">ARTICLE</SelectItem>
                    <SelectItem value="BOOK">BOOK</SelectItem>
                    <SelectItem value="PROCEEDING">PROCEEDING</SelectItem>
                    <SelectItem value="OTHERS">OTHERS</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Mualliflik</Label>
            <Controller
              name="author"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIRST_AUTHOR">ASOSIY MUALLIF</SelectItem>
                    <SelectItem value="COAUTHOR">HAMMUALLIF</SelectItem>
                    <SelectItem value="BOTH_AUTHOR">HAR IKKISI</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Daraja</Label>
            <Controller
              name="degree"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INTERNATIONAL">XALQARO</SelectItem>
                    <SelectItem value="NATIONAL">MAHALLIY</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label>Jild (Volume)</Label>
            <Input {...register("volume")} placeholder="Vol. 12" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input type="checkbox" id="isPopular" {...register("popular")} className="size-4 cursor-pointer" />
          <Label htmlFor="isPopular" className="cursor-pointer">Ommabop nashr (Popular)</Label>
        </div>

        <div className="flex flex-col gap-1">
          <Label>PDF Fayl</Label>
          <Controller
            name="pdf"
            control={control}
            render={({ field }) => (
              <FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>Bekor qilish</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
        </div>
      </form>
    </Modal>
  );
}