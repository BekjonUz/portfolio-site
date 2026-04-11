import { useParams } from "react-router";
import { useGetResearchByUser } from "@/hooks/research/useGetResearchByUser";
import { useGetNazoratByUser } from "@/hooks/nazorat/useGetNazoratByUser";
import { useGetPublicationByUser } from "@/hooks/publication/useGetPublicationByUser";
import { useGetAwardByUser } from "@/hooks/award/useGetAwardByUser";
import { useGetConsultationByUser } from "@/hooks/consultation/useGetConsultationByUser";
import {
  Award,
  BookText,
  FlaskConical,
  Plus,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { ResearchesTab } from "./detail-tabs/researches-tab";
import { PublicationsTab } from "./detail-tabs/publications-tab";
import { NashrlarTab } from "./detail-tabs/nashrlar-tab";
import { MaslahatTab } from "./detail-tabs/maslahat-tab";
import { MukofotlarTab } from "./detail-tabs/mukofotlar-tab";

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground">
        {icon}
      </div>
      <div className="text-center">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-[12px] text-muted-foreground mt-1">{description}</p>
      </div>
      <Button size="sm" variant="outline" className="gap-1.5">
        <Plus className="size-3.5" /> Qo'shish
      </Button>
    </div>
  );
}

export function ActivityTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (v: string) => void;
}) {
  const { id } = useParams();
  const userId = Number(id);

  const { data: resData, isLoading: resLoading } = useGetResearchByUser(userId);
  const { data: nazData, isLoading: nazLoading } = useGetNazoratByUser(userId);
  const { data: pubData, isLoading: pubLoading } =
    useGetPublicationByUser(userId);
  const { data: conData, isLoading: conLoading } =
    useGetConsultationByUser(userId);
  const { data: awrData, isLoading: awrLoading } = useGetAwardByUser(userId);

  const researches = resData?.data?.body ?? [];
  const nazoratlar = nazData?.data?.body ?? [];
  const nashrlar = pubData?.data?.body ?? [];
  const awards = awrData?.data?.body ?? [];

  // Maslahatlarni Tab formati uchun map qilish
  const maslahatlar =
    conData?.data?.body?.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      year: String(item.year),
      head: item.leader,
      subscribe: item.member ? "HA" : "YO'Q",
      status: item.finishedEnum === "COMPLETED" ? "TUGALLANGAN" : "JARAYONDA",
      pdfName: item.fileUrl ?? null,
    })) ?? [];

  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full rounded-xl border bg-card overflow-hidden"
    >
      <div className="border-b overflow-x-auto">
        <TabsList className="bg-transparent h-auto p-0 justify-start">
          <TabsTrigger
            value="researches"
            className="data-[state=active]:border-primary border-b-2 rounded-none px-4 py-2.5 text-[13px] gap-2"
          >
            <FlaskConical className="size-3.5" /> Tadqiqotlar
          </TabsTrigger>
          <TabsTrigger
            value="supervision"
            className="data-[state=active]:border-primary border-b-2 rounded-none px-4 py-2.5 text-[13px] gap-2"
          >
            <BookText className="size-3.5" /> Nazoratlar
          </TabsTrigger>
          <TabsTrigger
            value="publications"
            className="data-[state=active]:border-primary border-b-2 rounded-none px-4 py-2.5 text-[13px] gap-2"
          >
            <Users className="size-3.5" /> Nashrlar
          </TabsTrigger>
          <TabsTrigger
            value="activities"
            className="data-[state=active]:border-primary border-b-2 rounded-none px-4 py-2.5 text-[13px] gap-2"
          >
            <TrendingUp className="size-3.5" /> Maslahat
          </TabsTrigger>
          <TabsTrigger
            value="awards"
            className="data-[state=active]:border-primary border-b-2 rounded-none px-4 py-2.5 text-[13px] gap-2"
          >
            <Star className="size-3.5" /> Mukofotlar
          </TabsTrigger>
        </TabsList>
      </div>

      <div className="px-5 py-4">
        <TabsContent value="researches">
          {researches.length === 0 && !resLoading ? (
            <EmptyState
              icon={<FlaskConical className="size-7" />}
              title="Tadqiqotlar yo'q"
              description="..."
            />
          ) : (
            <ResearchesTab data={researches} isLoading={resLoading} />
          )}
        </TabsContent>
        <TabsContent value="supervision">
          {nazoratlar.length === 0 && !nazLoading ? (
            <EmptyState
              icon={<BookText className="size-7" />}
              title="Nazoratlar yo'q"
              description="..."
            />
          ) : (
            <PublicationsTab data={nazoratlar} isLoading={nazLoading} />
          )}
        </TabsContent>
        <TabsContent value="publications">
          {nashrlar.length === 0 && !pubLoading ? (
            <EmptyState
              icon={<Users className="size-7" />}
              title="Nashrlar yo'q"
              description="..."
            />
          ) : (
            <NashrlarTab data={nashrlar} isLoading={pubLoading} />
          )}
        </TabsContent>
        <TabsContent value="activities">
          {maslahatlar.length === 0 && !conLoading ? (
            <EmptyState
              icon={<TrendingUp className="size-7" />}
              title="Maslahatlar yo'q"
              description="..."
            />
          ) : (
            <MaslahatTab data={maslahatlar} isLoading={conLoading} />
          )}
        </TabsContent>
        <TabsContent value="awards">
          {awards.length === 0 && !awrLoading ? (
            <EmptyState
              icon={<Award className="size-7" />}
              title="Mukofotlar yo'q"
              description="..."
            />
          ) : (
            <MukofotlarTab data={awards} isLoading={awrLoading} />
          )}
        </TabsContent>
      </div>
    </Tabs>
  );
}
