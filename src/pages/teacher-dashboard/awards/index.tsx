import { useState } from "react";
import { useParams } from "react-router";
import { Award } from "lucide-react";

import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { MukofotlarTab } from "@/pages/teachers/detail/detail-tabs/mukofotlar-tab";
import { MukofotModal } from "@/pages/teachers/detail/detail-modals/mukofot-modal";

import { useModalActions } from "@/store/modalStore";
import { useGetAwardByUser } from "@/hooks/award/useGetAwardByUser";
import { useUser } from "@/hooks/user/useUser";

export default function TeacherAwards() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const { open } = useModalActions();
  const [search, setSearch] = useState("");

  const userId = Number(paramsId || userData?.id);

  const { data: response, isLoading } = useGetAwardByUser(userId);
  const mukofotlar = response?.data?.body ?? [];

  // Qidiruv mantiqi
  const filteredData = mukofotlar.filter((item: any) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel="Mukofotlar"
        count={filteredData.length}
        searchValue={search}
        onSearchChange={setSearch}
        addLabel="Mukofot qo'shish"
        onAdd={() => open({ _type: "mukofot" })}
      />

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="p-3 sm:p-5">
          <MukofotlarTab data={filteredData} isLoading={isLoading} />
        </div>
      </div>

      <MukofotModal />
    </div>
  );
}