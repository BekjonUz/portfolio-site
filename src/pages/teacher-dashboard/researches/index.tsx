import { useSearchParams } from "react-router";
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { useModalActions } from "@/store/modalStore";
import { ResearchModal } from "@/pages/teachers/detail/detail-modals/research-modal";
import { ResearchesTab } from "@/pages/teachers/detail/detail-tabs/researches-tab";
import { useGetResearchByUser } from "@/hooks/research/useGetResearchByUser";
import { useUser } from "@/hooks/user/useUser";

export default function TeacherResearches() {
  const { data: userData, isLoading: isUserLoading } = useUser();
  const { open } = useModalActions();
  const [searchParams, setSearchParams] = useSearchParams();

  // Endi userData ichida id bor (chunki hookni to'g'riladik)
  const userId = userData?.id; 
  
  const page = Number(searchParams.get("page") ?? 0);
  const search = searchParams.get("search") ?? "";

  const { data: response, isLoading: isDataLoading } = useGetResearchByUser(
    userId ? Number(userId) : 0, 
    page,
    10,
    search || undefined
  );

  const researches = response?.data?.body ?? [];
  const totalElements = response?.data?.totalElements ?? 0;
  const totalPage = response?.data?.totalPage ?? 0;

  const setPage = (newPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(newPage));
      return next;
    });
  };

  const onSearchChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("search", value);
      } else {
        next.delete("search");
      }
      next.set("page", "0");
      return next;
    });
  };

  if (isUserLoading) return <div className="p-10 text-center">Yuklanmoqda...</div>;
  
  // Agar yuklanib bo'lgan bo'lsa-yu ID yo'q bo'lsa, demak backend xatosi yoki login muddati o'tgan
  if (!userId) return <div className="p-10 text-center text-red-500">Foydalanuvchi ID topilmadi.</div>;

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Tadqiqotlar"
        count={totalElements}
        searchValue={search}
        onSearchChange={onSearchChange}
        addLabel="Tadqiqot qo'shish"
        onAdd={() => open({ _type: "research" })}
      />

      <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
        <div className="p-0 sm:p-2">
          <ResearchesTab
            data={researches}
            isLoading={isDataLoading}
            page={page}
            totalPage={totalPage}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ResearchModal />
    </div>
  );
}