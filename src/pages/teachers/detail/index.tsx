import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/ui/skeleton";

// UI Components
import { TableToolbar } from "@/components/table-toolbar/table-toolbar";
import { ActivityTabs } from "./activity-tabs";
import { StatsGrid } from "./stats-grid";
import { ProfileSidebar } from "./detail-profile/profile-sidebar";
import { ProfileForm } from "./detail-profile/profile-form";
import type { ProfileFormData } from "./detail-profile/profile-edit";

// Modals
import { ResearchModal } from "./detail-modals/research-modal";
import { PublicationModal } from "./detail-modals/publication-modal";
import { NashrModal } from "./detail-modals/nashr-modal";
import { MaslahatModal } from "./detail-modals/maslahat-modal";
import { MukofotModal } from "./detail-modals/mukofot-modal";

// Hooks & Store
import { useModalActions } from "@/store/modalStore";
import { useGetTeacherById } from "@/hooks/teacher/useGetTeacherById";
import { useUpdateTeacherProfile } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";

// Faolliklar uchun hooklar
import { useGetResearchByUser } from "@/hooks/research/useGetResearchByUser";
import { useGetNazoratByUser } from "@/hooks/nazorat/useGetNazoratByUser";
import { useGetPublicationByUser } from "@/hooks/publication/useGetPublicationByUser";
import { useGetConsultationByUser } from "@/hooks/consultation/useGetConsultationByUser";
import { useGetAwardByUser } from "@/hooks/award/useGetAwardByUser";

const TAB_CONFIG: Record<
  string,
  { label: string; addLabel: string; modalType: string }
> = {
  researches: {
    label: "Tadqiqotlar",
    addLabel: "Tadqiqot qo'shish",
    modalType: "research",
  },
  publications: {
    label: "Nashrlar",
    addLabel: "Nashr qo'shish",
    modalType: "publication",
  },
  supervision: {
    label: "Nazoratlar",
    addLabel: "Nazorat qo'shish",
    modalType: "nazorat",
  },
  activities: {
    label: "Maslahatlar",
    addLabel: "Maslahat qo'shish",
    modalType: "maslahat",
  },
  awards: {
    label: "Mukofotlar",
    addLabel: "Mukofot qo'shish",
    modalType: "mukofot",
  },
};

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { open } = useModalActions();
  const teacherId = Number(id);

  const [activeTab, setActiveTab] = useState("researches");

  // API Ma'lumotlari
  const { data: response, isLoading } = useGetTeacherById(teacherId);
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateTeacherProfile();
  const { data: departmentResponse } = useDepartment();
  const { data: lavozimResponse } = useLavozim();

  // Faolliklar ma'lumotlarini olish
  const { data: res } = useGetResearchByUser(teacherId);
  const { data: naz } = useGetNazoratByUser(teacherId);
  const { data: pub } = useGetPublicationByUser(teacherId);
  const { data: con } = useGetConsultationByUser(teacherId);
  const { data: award } = useGetAwardByUser(teacherId);

  // Statistikani yig'ish
  const stats = useMemo(
    () => ({
      researches: res?.data?.totalElements ?? 0,
      publications: pub?.data?.totalElements ?? 0,
      supervision: naz?.data?.totalElements ?? 0,
      activities: con?.data?.totalElements ?? 0,
      awards: award?.data?.totalElements ?? 0,
    }),
    [res, pub, naz, con, award],
  );

  // Select opsiyalari
  const positionsOptions = useMemo(
    () =>
      (lavozimResponse?.data ?? []).map((l) => ({
        value: String(l.id),
        label: l.name,
      })),
    [lavozimResponse],
  );

  const departmentsOptions = useMemo(
    () =>
      (departmentResponse?.data ?? []).map((d) => ({
        value: String(d.id),
        label: d.name,
      })),
    [departmentResponse],
  );

  if (isLoading) return <Skeleton className="h-screen w-full" />;

  const teacher = response?.data;
  if (!teacher)
    return (
      <div className="p-10 text-center text-muted-foreground">
        O'qituvchi topilmadi.
      </div>
    );

  const profileValues: ProfileFormData = {
    fullName: teacher.fullName ?? "",
    email: teacher.email ?? "",
    age: teacher.age ?? "",
    phone: teacher.phone ?? "",
    department:
      departmentsOptions.find((d) => d.label === teacher.departmentName)
        ?.value ?? "",
    position:
      positionsOptions.find((l) => l.label === teacher.lavozimName)?.value ??
      "",
    bio: teacher.biography ?? "",
    additionalInfo: teacher.input ?? "",
    specialty: teacher.profession ?? "",
    orcId: teacher.orcId ?? "",
    scopusId: teacher.scopusId ?? "",
    scienceId: teacher.scienceId ?? "",
    researcherId: teacher.researcherId ?? "",
    image: teacher.imageUrl ?? null,
    resume: teacher.fileUrl ?? null,
  };

  const handleProfileSubmit = (formData: ProfileFormData) => {
    updateProfile({
      id: teacherId,
      fullName: formData.fullName,
      email: formData.email,
      age: Number(formData.age),
      phoneNumber: formData.phone,
      departmentId: Number(formData.department),
      lavozmId: Number(formData.position),
      gender: teacher.gender, // MUHIM: TypeScript xatosini yo'qotish uchun gender yuborildi
      biography: formData.bio,
      input: formData.additionalInfo,
      profession: formData.specialty,
      orcId: formData.orcId,
      scopusId: formData.scopusId,
      scienceId: formData.scienceId,
      researcherId: formData.researcherId,
      image: formData.image instanceof File ? formData.image : undefined,
      imageUrl: typeof formData.image === "string" ? formData.image : undefined,
      file: formData.resume instanceof File ? formData.resume : undefined,
      fileUrl:
        typeof formData.resume === "string" ? formData.resume : undefined,
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <nav className="flex items-center gap-2 text-[13px] text-muted-foreground">
        <button
          className="hover:text-foreground transition-colors"
          onClick={() => navigate("/teachers")}
        >
          O'qituvchilar
        </button>
        <ChevronRight className="size-3.5" />
        <span className="text-foreground font-medium">{teacher.fullName}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        <ProfileSidebar profile={profileValues} userId={teacherId} />
        <div className="w-full lg:flex-1">
          <ProfileForm
            key={teacherId}
            defaultValues={profileValues}
            positionsOptions={positionsOptions}
            departmentsOptions={departmentsOptions}
            onSubmit={handleProfileSubmit}
            isPending={isUpdatingProfile}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <TableToolbar
          countLabel={TAB_CONFIG[activeTab].label}
          count={stats[activeTab as keyof typeof stats] || 0}
          showSearch={false}
          addLabel={TAB_CONFIG[activeTab].addLabel}
          onAdd={() => open({ _type: TAB_CONFIG[activeTab].modalType })}
        />

        <ActivityTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="mt-4">
          <StatsGrid
            stats={stats}
            subStats={{
              international: 0,
              articles: 0,
              books: 0,
              supervised: 0,
              conferences: 0,
            }}
          />
        </div>
      </div>

      <ResearchModal />
      <PublicationModal />
      <NashrModal />
      <MaslahatModal />
      <MukofotModal />
    </div>
  );
}
