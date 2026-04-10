import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions, useModalEditData, useModalIsOpen } from "@/store/modalStore";
import { useCreateCollage } from "@/hooks/collage/useCreateCollage";
import { useCollagePage } from "@/hooks/collage/useCollagePage";
import { useDeleteCollage } from "@/hooks/collage/useDeleteCollage";
import { useEditCollage } from "@/hooks/collage/useEditCollage";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import type { Collage } from "@/features/collage/collage.type";
import { Image } from "antd";

type FacultyFormValues = {
  name: string;
  image: File | null;
};

function createColumns(
  onEdit: (row: Collage) => void,
  onDelete: (row: Collage) => void,
  page: number,
): ColumnDef<Collage>[] {
  return [
    {
      accessorKey: "id",
      header: "#",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{page * 10 + row.index + 1}</span>
      ),
    },
    {
      accessorKey: "imgUrl",
      header: "Rasm",
      cell: ({ row }) => {
        const imgUrl = row.original.imgUrl;
        return imgUrl ? (
          <Image
            src={imgUrl}
            alt={row.original.name}
            width={30}
            height={30}
            preview={{ mask: null }}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[13px]">
            {row.original.name.charAt(0).toUpperCase()}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Fakultet",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      id: "actions",
      header: () => <div className="text-center">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="size-3" /> Tahrirlash
          </button>
          <ConfirmPopover onConfirm={() => onDelete(row.original)}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="size-3" /> O'chirish
            </button>
          </ConfirmPopover>
        </div>
      ),
    },
  ];
}

export default function Faculties() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const search = searchParams.get("name") ?? "";

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const setSearch = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("name", value);
      } else {
        next.delete("name");
      }
      next.set("page", "0");
      return next;
    });
  };

  const isOpen = useModalIsOpen();
  const editData = useModalEditData() as Collage | null;
  const { open, close } = useModalActions();
  const isEdit = editData !== null;

  const { mutate: createCollage, isPending } = useCreateCollage();
  const { mutate: editCollage, isPending: isEditPending } = useEditCollage();
  const { data: collageResponse, isLoading } = useCollagePage(page, 10, search || undefined);
  const { mutate: deleteCollage } = useDeleteCollage();

  const collages = collageResponse?.data?.body ?? [];
  const totalElements = collageResponse?.data?.totalElements ?? 0;
  const totalPage = collageResponse?.data?.totalPage ?? 0;

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<FacultyFormValues>({
    defaultValues: { name: "", image: null },
  });

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name, image: null });
    }
  }, [editData, reset]);

  const columns = useMemo(
    () => createColumns((row) => open(row), (row) => deleteCollage({ id: row.id }), page),
    [open, page],
  );

  const handleClose = () => {
    reset();
    close();
  };

  const onSubmit = (values: FacultyFormValues) => {
    if (isEdit) {
      editCollage(
        { id: editData.id, name: values.name, image: values.image ?? undefined, imgUrl: editData.imgUrl },
        { onSuccess: handleClose },
      );
      return;
    }
    createCollage({ name: values.name, image: values.image }, { onSuccess: handleClose });
  };

  const isSubmitting = isPending || isEditPending;

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Fakultetlar soni"
        count={totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => open()}
        addLabel="Fakultet qo'shish"
      />

      <DataTable
        columns={columns}
        data={collages}
        isLoading={isLoading}
        page={page}
        totalPage={totalPage}
        onPageChange={setPage}
      />

      <Modal open={isOpen} onClose={handleClose} title={isEdit ? "Fakultet tahrirlash" : "Fakultet qo'shish"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-2">
            <Label>Rasm</Label>
            <Controller
              name="image"
              control={control}
              rules={{ required: isEdit ? false : "Rasm tanlanishi shart" }}
              render={({ field }) => (
                <FileInput type="image" value={field.value} onChange={field.onChange} />
              )}
            />
            {errors.image && <span className="text-[12px] text-red-500">{errors.image.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="faculty-name">Fakultet nomi</Label>
            <Input
              id="faculty-name"
              placeholder="Masalan: Davolash fakulteti"
              {...register("name", { required: "Fakultet nomi kiritilishi shart" })}
            />
            {errors.name && <span className="text-[12px] text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
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