import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { Textarea } from "@/ui/textarea";

import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { useCreateAward } from "@/hooks/award/useCreateAward";
import { useUpdateAward } from "@/hooks/award/useUpdateAward";
import { useUser } from "@/hooks/user/useUser";
import { fileService } from "@/features/file/file.service";
import type { AwardEnum, MemberEnum } from "@/features/award/award.type";

type MukofotFormData = {
  name: string;
  description: string;
  year: string;
  awardEnum: AwardEnum | "";
  memberEnum: MemberEnum | "";
  pdf: File | string | null;
};

export function MukofotModal() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const isOpen = useModalIsOpen();
  const editData = useModalEditData();
  const { close } = useModalActions();
  
  const [isUploading, setIsUploading] = useState(false);

  const visible = isOpen && editData?._type === "mukofot";
  const isEdit = visible && !!editData?.id;
  const userId = Number(paramsId || userData?.id);

  const { mutate: createAward, isPending: isCreating } = useCreateAward();
  const { mutate: updateAward, isPending: isUpdating } = useUpdateAward();
  const isPending = isCreating || isUpdating || isUploading;

  const { register, handleSubmit, control, reset } = useForm<MukofotFormData>({
    defaultValues: {
      name: "",
      description: "",
      year: "",
      awardEnum: "Trening_Va_Amaliyot",
      memberEnum: "MILLIY",
      pdf: null,
    },
  });

  useEffect(() => {
    if (visible) {
      if (isEdit) {
        reset({
          name: editData.name || "",
          description: editData.description || "",
          year: String(editData.year || ""),
          awardEnum: editData.awardEnum || "Trening_Va_Amaliyot",
          memberEnum: editData.memberEnum || "MILLIY",
          pdf: editData.fileUrl || null,
        });
      } else {
        reset({
          name: "",
          description: "",
          year: "",
          awardEnum: "Trening_Va_Amaliyot",
          memberEnum: "MILLIY",
          pdf: null,
        });
      }
    }
  }, [visible, isEdit, editData, reset]);

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = async (data: MukofotFormData) => {
    if (!userId) return toast.error("Foydalanuvchi ID topilmadi");

    try {
      let finalFileUrl = typeof data.pdf === "string" ? data.pdf : (editData?.fileUrl || "");

      if (data.pdf instanceof File) {
        setIsUploading(true);
        finalFileUrl = await fileService.uploadPdf(data.pdf);
        setIsUploading(false);
      }

      const payload = {
        name: data.name,
        description: data.description,
        year: Number(data.year),
        fileUrl: finalFileUrl,
        userId: userId,
        awardEnum: data.awardEnum as AwardEnum,
        memberEnum: data.memberEnum as MemberEnum,
      };

      if (isEdit) {
        updateAward(
          { id: Number(editData.id), data: payload },
          { onSuccess: handleClose }
        );
      } else {
        createAward(payload, { onSuccess: handleClose });
      }
    } catch (error) {
      setIsUploading(false);
      toast.error("Amalni bajarishda xatolik yuz berdi");
    }
  };

  return (
    <Modal
      open={visible}
      onClose={handleClose}
      title={isEdit ? "Mukofotni tahrirlash" : "Mukofot qo'shish"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mk-name">Mukofot nomi</Label>
          <Input 
            id="mk-name" 
            placeholder="Nomni kiriting..." 
            {...register("name", { required: true })} 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="mk-desc">Qisqa tavsif</Label>
          <Textarea
            id="mk-desc"
            placeholder="Tavsif..."
            className="min-h-[80px] resize-none"
            {...register("description")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="mk-year">Yil</Label>
            <Input 
              id="mk-year" 
              type="number" 
              placeholder={new Date().getFullYear().toString()} 
              {...register("year", { required: true })} 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Daraja</Label>
            <Controller
              name="memberEnum"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
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
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Mukofot turi</Label>
          <Controller
            name="awardEnum"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tanlang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Trening_Va_Amaliyot">Trening va Amaliyot</SelectItem>
                  <SelectItem value="Tahririyat_Kengashiga_Azolik">Tahririyat Kengashiga A'zolik</SelectItem>
                  <SelectItem value="Maxsus_Kengash_Azoligi">Maxsus Kengash A'zoligi</SelectItem>
                  <SelectItem value="Patent_Dgu">Patent DGU</SelectItem>
                  <SelectItem value="Davlat_Mukofoti">Davlat Mukofoti</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>PDF yuklash</Label>
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
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
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