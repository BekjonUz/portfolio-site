import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Plus, Search } from "lucide-react";

type TableToolbarProps = {
  count?: number;
  countLabel?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAdd?: () => void;
  addLabel?: string;
  showSearch?: boolean;
};

export function TableToolbar({
  count,
  countLabel,
  searchValue = "",
  onSearchChange,
  onAdd,
  addLabel = "Qo'shish",
  showSearch = true,
}: TableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-3">
        {countLabel && (
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {countLabel}:
          </h2>
        )}
        <span className="flex h-6 items-center justify-center rounded-full bg-blue-600 px-2.5 text-[13px] font-bold text-white shadow-sm shadow-blue-100">
          {count ?? 0}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {showSearch && onSearchChange && (
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
            <Input
              placeholder="Qidirish..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 h-10 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}

        {onAdd && (
          <Button 
            onClick={onAdd} 
            className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100 gap-2 px-5 transition-all active:scale-95 shrink-0"
          >
            <Plus className="size-4" />
            {addLabel}
          </Button>
        )}
      </div>
    </div>
  );
}