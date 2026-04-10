import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { FileInput } from "@/components/file-input/file-input";
import { Modal } from "@/components/modal/modal";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions, useModalIsOpen, useModalEditData } from "@/store/modalStore";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { useCreateDepartment } from "@/hooks/department/useCreateDepartment";
import { useDeleteDepartment } from "@/hooks/department/useDeleteDeportment";
import { useEditDepartment } from "@/hooks/department/useEditDepartment";
import { useDepartmentPage } from "@/hooks/department/useDepartmentPage";
import { useCollage } from "@/hooks/collage/useCollage";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { Controller, useForm } from "react-hook-form";
import { Image } from "antd";

type DepartmentFormValues = {
  name: string;
  collegeId: string;
  image: File | null;
};

type DepartmentRow = {
  id: number;
  name: string;
  imgUrl: string;
  collegeId: number;
};

function createColumns(
  onEdit: (row: DepartmentRow) => void,
  onDelete: (row: DepartmentRow) => void,
  page: number,
): ColumnDef<DepartmentRow>[] {
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
            width={30}
            height={30}
            preview={{ mask: null }}
            alt={row.original.name}
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
      header: "Kafedra",
      cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(row.original)}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2 py-1 rounded-md transition-colors cursor-pointer"
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

export default function Departments() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page") ?? 0);
  const search = searchParams.get("name") ?? "";
  const collegeIdParam = searchParams.get("collegeId");
  const collegeId = collegeIdParam ? Number(collegeIdParam) : undefined;

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
  const { open, close } = useModalActions();
  const editData = useModalEditData() as DepartmentRow | null;
  const isEdit = editData !== null;

  const { data: departmentResponse, isLoading } = useDepartmentPage(page, 10, search || undefined, collegeId);
  const departments: DepartmentRow[] = departmentResponse?.data?.body ?? [];
  const totalElements = departmentResponse?.data?.totalElements ?? 0;
  const totalPage = departmentResponse?.data?.totalPage ?? 0;

  const { data: collageResponse } = useCollage();
  const colleges = useMemo(
    () => (collageResponse?.data ?? []).map((c) => ({ value: String(c.id), label: c.name })),
    [collageResponse],
  );

  const { mutate: createDepartment, isPending: isCreating } = useCreateDepartment();
  const { mutate: deleteDepartment } = useDeleteDepartment();
  const { mutate: editDepartment, isPending: isEditing } = useEditDepartment();

  const { register, handleSubmit, reset, control, formState: { errors } } = useForm<DepartmentFormValues>({
    defaultValues: { name: "", collegeId: "", image: null },
  });

  const columns = useMemo(
    () => createColumns((row) => open(row), (row) => deleteDepartment({ id: row.id }), page),
    [open, deleteDepartment, page],
  );

  const handleClose = () => {
    reset();
    close();
  };

  useEffect(() => {
    if (editData) {
      reset({ name: editData.name, collegeId: String(editData.collegeId), image: null });
    }
  }, [editData, reset]);

  const onSubmit = (values: DepartmentFormValues) => {
    if (isEdit) {
      editDepartment(
        { id: editData.id, name: values.name, collegeId: Number(values.collegeId), image: values.image ?? undefined, imgUrl: editData.imgUrl },
        { onSuccess: handleClose },
      );
    } else {
      if (!values.image) return;
      createDepartment(
        { name: values.name, collegeId: Number(values.collegeId), image: values.image },
        { onSuccess: handleClose },
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Kafedralar soni"
        count={totalElements}
        searchValue={search}
        onSearchChange={setSearch}
        onAdd={() => open()}
        addLabel="Kafedra qo'shish"
      />

      <DataTable
        columns={columns}
        data={departments}
        isLoading={isLoading}
        page={page}
        totalPage={totalPage}
        onPageChange={setPage}
      />

      <Modal open={isOpen} onClose={handleClose} title={isEdit ? "Kafedrani tahrirlash" : "Kafedra qo'shish"}>
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
            <Label>Kollej</Label>
            <Controller
              name="collegeId"
              control={control}
              rules={{ required: "Kollej tanlanishi shart" }}
              render={({ field }) => (
                <SearchableSelect
                  options={colleges}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Kollejni tanlang"
                  searchPlaceholder="Kollej qidirish..."
                />
              )}
            />
            {errors.collegeId && <span className="text-[12px] text-red-500">{errors.collegeId.message}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="department-name">Kafedra nomi</Label>
            <Input
              id="department-name"
              placeholder="Masalan: Kompyuter kafedrasi"
              {...register("name", { required: "Kafedra nomi kiritilishi shart" })}
            />
            {errors.name && <span className="text-[12px] text-red-500">{errors.name.message}</span>}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Bekor qilish
            </Button>
            <Button type="submit" disabled={isCreating || isEditing}>
              {isCreating || isEditing ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}