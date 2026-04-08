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
import { useCreateConsultation } from "@/hooks/consultation/useCreateConsultation";
import { useUpdateConsultation } from "@/hooks/consultation/useUpdateConsultation";
import { useUser } from "@/hooks/user/useUser";
import { fileService } from "@/features/file/file.service";

type MaslahatFormData = {
  name: string;
  description: string;
  year: string;
  leader: string;
  member: "HA" | "YO'Q";
  finishedEnum: "COMPLETED" | "IN_PROGRESS" | "FINISHED" | "";
  pdf: File | null;
};

export function MaslahatModal() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const isOpen = useModalIsOpen();
  const editData = useModalEditData();
  const { close } = useModalActions();
  const [isUploading, setIsUploading] = useState(false);

  const visible = isOpen && editData?._type === "maslahat";
  const isEdit = visible && !!editData?.id;
  const userId = paramsId || userData?.id;

  const { mutate: createCon, isPending: isCreating } = useCreateConsultation();
  const { mutate: updateCon, isPending: isUpdating } = useUpdateConsultation();

  const isPending = isCreating || isUpdating || isUploading;

  const { register, handleSubmit, control, reset } = useForm<MaslahatFormData>({
    defaultValues: {
      name: "",
      description: "",
      year: "",
      leader: "",
      finishedEnum: "",
      member: "HA",
      pdf: null,
    },
  });

  useEffect(() => {
    if (visible && isEdit) {
      reset({
        name: editData.name || "",
        description: editData.description || "",
        year: String(editData.year || ""),
        leader: editData.leader || "",
        finishedEnum: editData.finishedEnum || "",
        member: editData.member ? "HA" : "YO'Q",
        pdf: null,
      });
    } else if (visible && !isEdit) {
      reset({ name: "", description: "", year: "", leader: "", finishedEnum: "", member: "HA", pdf: null });
    }
  }, [visible, isEdit, editData, reset]);

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: MaslahatFormData) => {
    if (!userId) return toast.error("User ID missing");

    try {
      let finalFileUrl = editData?.fileUrl || "";

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
        member: data.member === "HA",
        finishedEnum: (data.finishedEnum || "IN_PROGRESS") as any,
        leader: data.leader,
      };

      if (isEdit) {
        updateCon({ id: Number(editData.id), data: payload }, { onSuccess: handleClose });
      } else {
        createCon(payload, { onSuccess: handleClose });
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Error processing request");
    }
  };

  return (
    <Modal open={visible} onClose={handleClose} title={isEdit ? "Maslahatni tahrirlash" : "Maslahat qo'shish"}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Maslahat nomi</Label>
          <Input placeholder="Nomni kiriting..." {...register("name", { required: true })} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Qisqa tavsif</Label>
          <Textarea placeholder="Tavsif..." className="min-h-[80px] resize-none" {...register("description")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Yil</Label>
            <Input type="number" {...register("year")} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Rahbar</Label>
            <Input placeholder="Ismi..." {...register("leader")} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>A'zolik</Label>
            <Controller
              name="member"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HA">Ha</SelectItem>
                    <SelectItem value="YO'Q">Yo'q</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Holat</Label>
            <Controller
              name="finishedEnum"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger><SelectValue placeholder="Tanlang" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IN_PROGRESS">IN PROGRESS</SelectItem>
                    <SelectItem value="FINISHED">FINISHED</SelectItem>
                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>PDF yuklash</Label>
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