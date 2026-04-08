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
import { useCreateNazorat } from "@/hooks/nazorat/useCreateNazorat";
import { useUpdateNazorat } from "@/hooks/nazorat/useUpdateNazorat";
import { useUser } from "@/hooks/user/useUser";
import { fileService } from "@/features/file/file.service";

type PublicationFormData = {
  name: string;
  description: string;
  researcherName: string;
  univerName: string;
  year: string;
  level: string;
  memberEnum: "MILLIY" | "XALQARO" | "";
  status: "JARAYONDA" | "TUGALLANGAN" | "";
  pdf: File | null;
};

export function PublicationModal() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const isOpen = useModalIsOpen();
  const editData = useModalEditData();
  const { close } = useModalActions();
  const [isUploading, setIsUploading] = useState(false);

  const visible = isOpen && editData?._type === "nazorat";
  const isEdit = visible && !!editData?.id;
  const userId = paramsId || userData?.id;

  const { mutate: createNazorat, isPending: isCreating } = useCreateNazorat();
  const { mutate: updateNazorat, isPending: isUpdating } = useUpdateNazorat();

  const isPending = isCreating || isUpdating || isUploading;

  const { register, handleSubmit, control, reset } = useForm<PublicationFormData>({
    defaultValues: {
      name: "",
      description: "",
      researcherName: "",
      univerName: "",
      year: "",
      level: "",
      memberEnum: "",
      status: "",
      pdf: null,
    },
  });

  useEffect(() => {
    if (visible && isEdit) {
      reset({
        name: editData.name ?? "",
        description: editData.description ?? "",
        researcherName: editData.researcherName ?? "",
        univerName: editData.univerName ?? "",
        year: String(editData.year ?? ""),
        level: editData.level ?? "",
        memberEnum: editData.memberEnum ?? "",
        status: editData.finished ? "TUGALLANGAN" : "JARAYONDA",
        pdf: null,
      });
    } else if (visible && !isEdit) {
      reset({ name: "", description: "", researcherName: "", univerName: "", year: "", level: "", memberEnum: "", status: "", pdf: null });
    }
  }, [visible, isEdit, editData, reset]);

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: PublicationFormData) => {
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
        researcherName: data.researcherName,
        univerName: data.univerName,
        level: data.level,
        memberEnum: data.memberEnum,
        finished: data.status === "TUGALLANGAN",
      };

      if (isEdit) {
        updateNazorat({ id: Number(editData.id), data: payload }, { onSuccess: handleClose });
      } else {
        createNazorat(payload, { onSuccess: handleClose });
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Operation failed");
    }
  };

  return (
    <Modal open={visible} onClose={handleClose} title={isEdit ? "Nazoratni tahrirlash" : "Nazorat qo'shish"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="n-name">Nazorat nomi</Label>
          <Input id="n-name" placeholder="Nomni kiriting..." {...register("name", { required: true })} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="n-desc">Tavsif</Label>
          <Textarea id="n-desc" className="min-h-[80px] resize-none" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="n-researcher">Tadqiqotchi</Label>
            <Input id="n-researcher" placeholder="F.I.Sh..." {...register("researcherName")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="n-university">Universitet</Label>
            <Input id="n-university" placeholder="Tashkilot nomi..." {...register("univerName")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="n-year">Yil</Label>
            <Input id="n-year" type="number" {...register("year")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Daraja</Label>
            <Input placeholder="Darajani kiriting" {...register("level")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>A'zolik turi</Label>
            <Controller
              name="memberEnum"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MILLIY">MILLIY</SelectItem>
                    <SelectItem value="XALQARO">XALQARO</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Holati</Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="JARAYONDA">JARAYONDA</SelectItem>
                    <SelectItem value="TUGALLANGAN">TUGALLANGAN</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>PDF yuklash</Label>
          <Controller
            name="pdf"
            control={control}
            render={({ field }) => (
              <FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
            )}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>Bekor qilish</Button>
          <Button type="submit" disabled={isPending}>{isPending ? "Saqlanmoqda..." : "Saqlash"}</Button>
        </div>
      </form>
    </Modal>
  );
}