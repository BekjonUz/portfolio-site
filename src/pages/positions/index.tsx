import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { Card, CardContent } from "@/ui/card";
import { Pencil, Trash2, Users } from "lucide-react"; // Users ikonkasi qo'shildi
import { useEffect, useMemo } from "react";
import { useModalActions, useModalIsOpen, useModalEditData } from "@/store/modalStore";
import { Modal } from "@/components/modal/modal";
import { Button } from "@/ui/button";
import { useForm } from "react-hook-form";
import { Label } from "@/ui/label";
import { Input } from "@/ui/input";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import { useLavozimStatistics } from "@/hooks/lavozim/useLavozimStatistics";
import { useCreateLavozim } from "@/hooks/lavozim/useCreateLavozim";
import { useEditLavozim } from "@/hooks/lavozim/useEditLavozim";
import { useDeleteLavozim } from "@/hooks/lavozim/useDeleteLavozim";
import type { Lavozim } from "@/features/lavozim/lavozim.type";

type PositionFormValues = {
  name: string;
};

export default function Positions() {
  const isOpen = useModalIsOpen();
  const { close, open } = useModalActions();
  const editData = useModalEditData() as Lavozim | null;
  const isEdit = editData !== null;

  const { data: lavozimResponse, isLoading: isLavozimLoading } = useLavozim();
  const { data: lavozimStatistics, isLoading: isStatsLoading } = useLavozimStatistics();
  
  const { mutate: createLavozim, isPending } = useCreateLavozim();
  const { mutate: editLavozim, isPending: isEditPending } = useEditLavozim();
  const { mutate: deleteLavozim } = useDeleteLavozim();

  // Lavozimlar va statistikani birlashtirish
  const combinedData = useMemo(() => {
    const list = lavozimResponse?.data ?? [];
    const stats = lavozimStatistics?.data?.data ?? [];

    return list.map((item) => {
      const stat = stats.find((s) => s.name === item.name);
      return {
        ...item,
        totalEmployees: stat ? stat.totalEmployees : 0,
      };
    });
  }, [lavozimResponse, lavozimStatistics]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PositionFormValues>({
    defaultValues: { name: "" },
  });

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name });
    }
  }, [editData, reset]);

  function handleClose() {
    reset();
    close();
  }

  const onSubmit = (values: PositionFormValues) => {
    if (isEdit) {
      editLavozim(
        { id: editData.id, data: { name: values.name } },
        { onSuccess: handleClose },
      );
    } else {
      createLavozim({ name: values.name }, { onSuccess: handleClose });
    }
  };

  const isSubmitting = isPending || isEditPending;
  const isLoading = isLavozimLoading || isStatsLoading;

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Lavozimlar soni"
        count={combinedData.length}
        showSearch={false} // Qidiruv o'chirildi
        onAdd={() => open()}
        addLabel="Lavozim qo'shish"
      />

      {isLoading ? (
        <p className="text-center text-muted-foreground py-10 text-[14px]">Yuklanmoqda...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {combinedData.length ? (
            combinedData.map((position) => (
              <Card key={position.id} className="group hover:border-blue-200 transition-all shadow-sm">
                <CardContent className="flex flex-col gap-4 px-5 py-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-[15px] font-semibold text-foreground leading-tight">
                      {position.name}
                    </span>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Users className="size-3.5" />
                      <span className="text-[13px]">
                        {position.totalEmployees} ta xodim
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-start items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => open(position)}
                      className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                    >
                      <Pencil className="size-3" />
                      Tahrirlash
                    </button>
                    
                    <ConfirmPopover 
                       onConfirm={() => deleteLavozim(position.id)}
                       disabled={position.totalEmployees > 0 || true} 
                    >
                      <button
                        type="button"
                        disabled={position.totalEmployees > 0}
                        className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-[12px] font-semibold px-3 py-1.5 rounded-md transition-colors cursor-pointer"
                        title={position.totalEmployees > 0 ? "Xodimi bor lavozimni o'chirib bo'lmaydi" : ""}
                      >
                        <Trash2 className="size-3" />
                        O'chirish
                      </button>
                    </ConfirmPopover>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-10 text-[14px]">
              Ma'lumot topilmadi.
            </p>
          )}
        </div>
      )}

      <Modal
        open={isOpen}
        onClose={handleClose}
        title={isEdit ? "Lavozim tahrirlash" : "Lavozim qo'shish"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="position-name">Lavozim nomi</Label>
            <Input
              id="position-name"
              placeholder="Masalan: Professor"
              {...register("name", { required: "Lavozim nomi kiritilishi shart" })}
            />
            {errors.name && (
              <span className="text-[12px] text-red-500">{errors.name.message}</span>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}