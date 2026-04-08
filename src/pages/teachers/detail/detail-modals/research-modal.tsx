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
import { useCreateResearch } from "@/hooks/research/useCreateResearch";
import { useUpdateResearch } from "@/hooks/research/useUpdateResearch";
import { useUser } from "@/hooks/user/useUser";
import { fileService } from "@/features/file/file.service";

type ResearchFormData = {
  name: string;
  description: string;
  year: string;
  organization: string;
  membershipType: "MILLIY" | "XALQARO" | "";
  status: "JARAYONDA" | "TUGALLANGAN" | "";
  pdf: File | null;
};

export function ResearchModal() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const isOpen = useModalIsOpen();
  const editData = useModalEditData();
  const { close } = useModalActions();
  
  const [isUploading, setIsUploading] = useState(false);

  const visible = isOpen && editData?._type === "research";
  const isEdit = visible && !!editData?.id;
  const userId = paramsId || userData?.id;

  const { mutate: createResearch, isPending: isCreating } = useCreateResearch();
  const { mutate: updateResearch, isPending: isUpdating } = useUpdateResearch();

  const isPending = isCreating || isUpdating || isUploading;

  const { register, handleSubmit, control, reset } = useForm<ResearchFormData>({
    defaultValues: {
      name: "",
      description: "",
      year: "",
      organization: "",
      membershipType: "",
      status: "",
      pdf: null,
    },
  });

  useEffect(() => {
    if (visible && isEdit) {
      reset({
        name: editData.name ?? "",
        description: editData.description ?? "",
        year: String(editData.year ?? ""),
        organization: editData.univerName ?? "",
        membershipType: editData.memberEnum ?? "",
        status: editData.finished ? "TUGALLANGAN" : "JARAYONDA",
        pdf: null,
      });
    } else if (visible && !isEdit) {
      reset({
        name: "",
        description: "",
        year: "",
        organization: "",
        membershipType: "",
        status: "",
        pdf: null,
      });
    }
  }, [visible, isEdit, editData, reset]);

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: ResearchFormData) => {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

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
        member: data.membershipType !== "",
        univerName: data.organization,
        finished: data.status === "TUGALLANGAN",
        memberEnum: data.membershipType,
      };

      if (isEdit) {
        updateResearch(
          { id: Number(editData.id), data: payload },
          { onSuccess: handleClose }
        );
      } else {
        createResearch(payload, { onSuccess: handleClose });
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Operation failed");
    }
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      title={isEdit ? "Tadqiqotni tahrirlash" : "Tadqiqot qo'shish"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="r-name">Tadqiqot nomi</Label>
          <Input 
            id="r-name" 
            {...register("name", { required: true })} 
            placeholder="Mavzuni kiriting"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="r-desc">Qisqa tavsif</Label>
          <Textarea 
            id="r-desc" 
            {...register("description")} 
            className="min-h-[80px] resize-none" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="r-year">Yil</Label>
            <Input id="r-year" type="number" {...register("year")} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="r-org">Universitet / Tashkilot</Label>
            <Input id="r-org" {...register("organization")} />
          </div>

          <div className="flex flex-col gap-2">
            <Label>A'zolik turi</Label>
            <Controller
              name="membershipType"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Tanlang" />
                  </SelectTrigger>
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
          <Label>PDF yuklash (ixtiyoriy)</Label>
          <Controller
            name="pdf"
            control={control}
            render={({ field }) => (
              <FileInput 
                type="document" 
                accept=".pdf" 
                value={field.value} 
                onChange={field.onChange} 
              />
            )}
          />
          {isEdit && editData.fileUrl && !control._formValues.pdf && (
            <p className="text-[11px] text-emerald-600 font-medium italic">
              * Tizimda fayl mavjud. Yangilash uchun yangisini tanlang.
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 pt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose} 
            disabled={isPending}
          >
            Bekor qilish
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saqlanmoqda..." : "Saqlash"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}