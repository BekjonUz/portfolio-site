import { useState } from "react";
import { useParams } from "react-router";
import { BookText, Users } from "lucide-react";

import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { PublicationModal } from "@/pages/teachers/detail/detail-modals/publication-modal";
import { NashrModal } from "@/pages/teachers/detail/detail-modals/nashr-modal";
import { PublicationsTab } from "@/pages/teachers/detail/detail-tabs/publications-tab";
import { NashrlarTab } from "@/pages/teachers/detail/detail-tabs/nashrlar-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";

import { useModalActions } from "@/store/modalStore";
import { useUser } from "@/hooks/user/useUser";
import { useGetNazoratByUser } from "@/hooks/nazorat/useGetNazoratByUser";
import { useGetPublicationByUser } from "@/hooks/publication/useGetPublicationByUser";
import { cn } from "@/utils";

export default function TeacherPublications() {
  const { id: paramsId } = useParams();
  const { data: userData } = useUser();
  const { open } = useModalActions();
  
  const [activeTab, setActiveTab] = useState("nazoratlar");

  const userId = Number(paramsId || userData?.id);

  const { data: nazResponse, isLoading: nazLoading } = useGetNazoratByUser(userId);
  const { data: pubResponse, isLoading: pubLoading } = useGetPublicationByUser(userId);

  const nazoratlar = nazResponse?.data?.body ?? [];
  const nashrlar = pubResponse?.data?.body ?? [];

  const tabConfigs: Record<string, any> = {
    nazoratlar: {
      count: nazoratlar.length,
      addLabel: "Nazorat qo'shish",
      modalType: "nazorat",
      countLabel: "Nazoratlar",
    },
    nashrlar: {
      count: nashrlar.length,
      addLabel: "Nashr qo'shish",
      modalType: "publication",
      countLabel: "Nashrlar",
    },
  };

  const current = tabConfigs[activeTab];

  return (
    <div className="flex flex-col gap-4">
      <TableToolbar
        countLabel={current.countLabel}
        count={current.count}
        searchValue=""
        onSearchChange={() => {}}
        showSearch={false}
        addLabel={current.addLabel}
        onAdd={() => open({ _type: current.modalType })}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full rounded-xl border bg-card overflow-hidden"
      >
        <div className="border-b overflow-x-auto">
          <TabsList className="bg-transparent h-auto p-0 rounded-none gap-0 w-max sm:w-full justify-start">
            {[
              { value: "nazoratlar", label: "Nazoratlar", icon: <BookText className="size-3.5" /> },
              { value: "nashrlar", label: "Nashrlar", icon: <Users className="size-3.5" /> },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className={cn(
                  "rounded-none border-0 border-b-2 border-transparent px-3 sm:px-4 py-2.5 text-[12px] sm:text-[13px] gap-1.5 h-auto whitespace-nowrap",
                  "data-[state=active]:border-primary data-[state=active]:bg-transparent",
                  "data-[state=active]:text-primary data-[state=active]:shadow-none",
                )}
              >
                {tab.icon}
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <div className="px-3 sm:px-5">
          <TabsContent value="nazoratlar" className="m-0">
            <div className="py-4">
              <PublicationsTab data={nazoratlar} isLoading={nazLoading} />
            </div>
          </TabsContent>
          <TabsContent value="nashrlar" className="m-0">
            <div className="py-4">
              <NashrlarTab data={nashrlar} isLoading={pubLoading} />
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <PublicationModal />
      <NashrModal />
    </div>
  );
}