import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { useDeleteNazorat } from "@/hooks/nazorat/useDeleteNazorat";
import { useModalActions } from "@/store/modalStore";
import { Badge } from "@/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Nazorat } from "@/features/nazorat/nazorat.type";

type PublicationsTabProps = {
  data: Nazorat[];
  isLoading?: boolean;
  page?: number;
  totalPage?: number;
  onPageChange?: (page: number) => void;
};

export function PublicationsTab({ data, isLoading, page, totalPage, onPageChange }: PublicationsTabProps) {
  const { open } = useModalActions();
  const { mutate: deleteNazorat } = useDeleteNazorat();

  const columns: ColumnDef<Nazorat>[] = [
    {
      accessorKey: "name",
      header: "Nazorat nomi",
      cell: ({ row }) => <span className="font-medium text-[13px]">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Tavsif",
      cell: ({ row }) => (
        <TruncatedText
          text={row.getValue("description")}
          maxLength={50}
          tooltipClassName="text-[#000] text-center bg-white shadow"
        />
      ),
    },
    {
      accessorKey: "year",
      header: "Yil",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">{row.getValue("year")}</span>
      ),
    },
    {
      accessorKey: "finished",
      header: "Holati",
      cell: ({ row }) => {
        const finished = row.getValue("finished") as boolean;
        return (
          <Badge
            className={
              finished
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }
            variant="outline"
          >
            {finished ? "TUGALLANGAN" : "JARAYONDA"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "memberEnum",
      header: "A'zolik turi",
      cell: ({ row }) => {
        const type = row.getValue("memberEnum") as Nazorat["memberEnum"];
        return (
          <Badge
            className={
              type === "XALQARO"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "bg-violet-50 text-violet-700 border-violet-200"
            }
            variant="outline"
          >
            {type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "fileUrl",
      header: "PDF",
      cell: ({ row }) => {
        const fileUrl = row.getValue("fileUrl") as string | null;
        if (!fileUrl) return <span className="text-[12px] text-muted-foreground">—</span>;
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Eye className="size-3" /> Ko'rish
          </a>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Amallar</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => open({ _type: "nazorat", ...row.original })}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="size-3" /> Tahrirlash
          </button>

          <ConfirmPopover onConfirm={() => deleteNazorat(row.original.id)}>
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

  return (
    <DataTable
      columns={columns}
      data={data}
      isLoading={isLoading}
      page={page}
      totalPage={totalPage}
      onPageChange={onPageChange}
    />
  );
}