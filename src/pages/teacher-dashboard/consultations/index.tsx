import { Eye, Pencil, Trash2 } from "lucide-react";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { Badge } from "@/ui/badge";
import { useModalActions } from "@/store/modalStore";
import { useDeleteConsultation } from "@/hooks/consultation/useDeleteConsultation";

export type Maslahat = {
  id: number;
  name: string;
  description: string;
  year: string;
  leader: string;
  member: boolean;
  finishedEnum: string;
  fileUrl: string | null;
};

const STYLE_MAP: Record<string, string> = {
  HA: "bg-emerald-50 text-emerald-700 border-emerald-200",
  "YO'Q": "bg-rose-50 text-rose-700 border-rose-200", 
  IN_PROGRESS: "bg-violet-50 text-violet-700 border-violet-200",
  FINISHED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  COMPLETED: "bg-blue-50 text-blue-700 border-blue-200",
};

type MaslahatTabProps = {
  data: Maslahat[];
  isLoading?: boolean;
};

export function MaslahatTab({ data, isLoading }: MaslahatTabProps) {
  const { open } = useModalActions();
  const { mutate: deleteConsultation } = useDeleteConsultation();

  const columns: ColumnDef<Maslahat>[] = [
    {
      accessorKey: "name",
      header: "Maslahat nomi",
      cell: ({ row }) => <span className="font-medium text-[13px]">{row.original.name}</span>,
    },
    {
      accessorKey: "description",
      header: "Tavsif",
      cell: ({ row }) => <TruncatedText text={row.original.description} />,
    },
    {
      accessorKey: "year",
      header: "Yil",
      cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.original.year}</span>,
    },
    {
      accessorKey: "leader",
      header: "Rahbar",
      cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.original.leader}</span>,
    },
    {
      accessorKey: "member",
      header: "A'zoligi",
      cell: ({ row }) => {
        const label = row.original.member ? "HA" : "YO'Q";
        return <Badge className={STYLE_MAP[label]} variant="outline">{label}</Badge>;
      },
    },
    {
      accessorKey: "finishedEnum",
      header: "Holati",
      cell: ({ row }) => (
        <Badge className={STYLE_MAP[row.original.finishedEnum]} variant="outline">
          {row.original.finishedEnum}
        </Badge>
      ),
    },
    {
      accessorKey: "fileUrl",
      header: "PDF",
      cell: ({ row }) => {
        if (!row.original.fileUrl) return <span className="text-[12px] text-muted-foreground">—</span>;
        return (
          <a
            href={row.original.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md"
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
            onClick={() => open({ _type: "maslahat", ...row.original })}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md"
          >
            <Pencil className="size-3" /> Tahrirlash
          </button>
          <ConfirmPopover onConfirm={() => deleteConsultation(row.original.id)}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md"
            >
              <Trash2 className="size-3" /> O'chirish
            </button>
          </ConfirmPopover>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}