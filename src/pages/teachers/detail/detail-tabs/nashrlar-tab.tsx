import { ConfirmPopover } from "@/components/confirm-popover/confirm-popover";
import { DataTable } from "@/components/data-table/data-table";
import type { ColumnDef } from "@/components/data-table/data-table";
import { TruncatedText } from "@/components/tooltip/truncated-text";
import { useModalActions } from "@/store/modalStore";
import { Badge } from "@/ui/badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { PublicationItem } from "@/features/publication/publication.type";
import { useDeletePublication } from "@/hooks/publication/useDeletePublication";

const TYPE_STYLES: Record<string, string> = {
  ARTICLE: "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50",
  BOOK: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  PROCEEDING: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-50",
  OTHERS: "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-50",
};

const TYPE_LABELS: Record<string, string> = {
  ARTICLE: "Maqola",
  BOOK: "Kitob",
  PROCEEDING: "Konferensiya",
  OTHERS: "Boshqa",
};

const AUTHOR_LABELS: Record<string, string> = {
  COAUTHOR: "Hammuallif",
  FIRST_AUTHOR: "Birinchi muallif",
  BOTH_AUTHOR: "Ikki muallif",
};

const DEGREE_LABELS: Record<string, string> = {
  INTERNATIONAL: "Xalqaro",
  NATIONAL: "Mahalliy",
};

type NashrlarTabProps = {
  data: PublicationItem[];
  isLoading?: boolean;
};

export function NashrlarTab({ data, isLoading }: NashrlarTabProps) {
  const { open } = useModalActions();
  const { mutate: deletePublication } = useDeletePublication();

  const columns: ColumnDef<PublicationItem>[] = [
    {
      accessorKey: "name",
      header: "Nashr nomi",
      cell: ({ row }) => <span className="font-medium text-[13px]">{row.getValue("name")}</span>,
    },
    {
      accessorKey: "description",
      header: "Tavsif",
      cell: ({ row }) => <TruncatedText text={row.getValue("description")} />,
    },
    {
      accessorKey: "year",
      header: "Yil",
      cell: ({ row }) => (
        <span className="text-[13px] text-muted-foreground">{row.getValue("year")}</span>
      ),
    },
    {
      accessorKey: "type",
      header: "Nashr turi",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <Badge className={TYPE_STYLES[type] ?? TYPE_STYLES.OTHERS} variant="outline">
            {TYPE_LABELS[type] ?? type}
          </Badge>
        );
      },
    },
    {
      accessorKey: "degree",
      header: "Daraja",
      cell: ({ row }) => {
        const degree = row.getValue("degree") as string;
        return (
          <Badge
            className={
              degree === "INTERNATIONAL"
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50"
                : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50"
            }
            variant="outline"
          >
            {DEGREE_LABELS[degree] ?? degree}
          </Badge>
        );
      },
    },
    {
      accessorKey: "author",
      header: "Mualliflik",
      cell: ({ row }) => {
        const author = row.getValue("author") as string;
        return (
          <Badge className="bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-50" variant="outline">
            {AUTHOR_LABELS[author] ?? author}
          </Badge>
        );
      },
    },
    {
      accessorKey: "popular",
      header: "Popularlik",
      cell: ({ row }) => {
        const popular = row.getValue("popular") as boolean;
        return (
          <Badge
            className={
              popular
                ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-50"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-50"
            }
            variant="outline"
          >
            {popular ? "Popular" : "Oddiy"}
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
            <Eye className="size-3" />
            Ko'rish
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
            onClick={() => open({ _type: "publication", ...row.original })}
            className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
          >
            <Pencil className="size-3" />
            Tahrirlash
          </button>
          <ConfirmPopover onConfirm={() => deletePublication(row.original.id)}>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-[12px] font-semibold px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Trash2 className="size-3" />
              O'chirish
            </button>
          </ConfirmPopover>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} isLoading={isLoading} />;
}