import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { useModalActions } from "@/store/modalStore";
import { Badge } from "@/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { AwardItem } from "@/features/award/award.type";
import { useDeleteAward } from "@/hooks/award/useDeleteAward";

export type Mukofot = AwardItem;

const AWARD_LABELS: Record<string, string> = {
  Trening_Va_Amaliyot: "Trening va Amaliyot",
  Tahririyat_Kengashiga_Azolik: "Tahririyat Kengashiga A'zolik",
  Maxsus_Kengash_Azoligi: "Maxsus Kengash A'zoligi",
  Patent_Dgu: "Patent DGU",
  Davlat_Mukofoti: "Davlat Mukofoti",
};

const MEMBER_STYLES: Record<string, string> = {
  MILLIY: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  XALQARO: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
};

type MukofotlarTabProps = {
  data: Mukofot[];
  isLoading?: boolean;
};

export function MukofotlarTab({ data, isLoading }: MukofotlarTabProps) {
  const { open } = useModalActions();
  const { mutate: deleteAward } = useDeleteAward();

  const columns: ColumnDef<Mukofot>[] = [
    {
      accessorKey: "name",
      header: "Mukofot nomi",
      cell: ({ row }) => (
        <span className="font-medium text-[13px]">{row.original.name}</span>
      ),
    },
    {
      accessorKey: "description",
      header: "Tavsif",
      cell: ({ row }) => <TruncatedText text={row.original.description} />,
    },
    {
      accessorKey: "year",
      header: "Yil",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">{row.original.year}</span>
      ),
    },
    {
      accessorKey: "awardEnum",
      header: "Tur",
      cell: ({ row }) => (
        <Badge className="bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50" variant="outline">
          {AWARD_LABELS[row.original.awardEnum] ?? row.original.awardEnum}
        </Badge>
      ),
    },
    {
      accessorKey: "memberEnum",
      header: "Daraja",
      cell: ({ row }) => (
        <Badge className={MEMBER_STYLES[row.original.memberEnum]} variant="outline">
          {row.original.memberEnum}
        </Badge>
      ),
    },
    {
      accessorKey: "fileUrl",
      header: "PDF",
      cell: ({ row }) => {
        const fileUrl = row.original.fileUrl;
        if (!fileUrl) return <span className="text-[12px] text-muted-foreground">—</span>;
        return (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors"
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
        <div
          className="flex items-center justify-center gap-2"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => open({ _type: "mukofot", ...row.original })}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="size-3" /> Tahrirlash
          </button>
          <ConfirmPopover onConfirm={() => deleteAward(row.original.id)}>
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

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}