// Hooks
import { useUser } from "@/hooks/user/useUser"; // O'zingiz ko'rsatgan hook
import { useUpdateTeacherProfile } from "@/hooks/teacher/useUpdateTeacherProfile";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import { useMemo } from "react";
import { useUserInfo } from "@/store/userStore";
import { Skeleton } from "@/ui/skeleton";
import { ProfileSidebar } from "@/pages/teachers/detail/detail-profile/profile-sidebar";
import { ProfileForm } from "@/pages/teachers/detail/detail-profile/profile-form";
import { ProfileFormData } from "@/pages/teachers/detail/detail-profile/profile-edit";

export default function TeacherProfile() {
  // 1. URL'dan emas, Store'dan foydalanuvchi ID-sini olamiz
  const userInfo = useUserInfo();
  const teacherId = userInfo?.id;

  // 2. Ma'lumotlarni yuklash (Siz ko'rsatgan /user endpointi)
  const { data: userData, isLoading: isUserLoading } = useUser();
  const { mutate: updateProfile, isPending } = useUpdateTeacherProfile();
  
  const { data: departmentResponse, isLoading: isDepLoading } = useDepartment();
  const { data: lavozimResponse, isLoading: isPosLoading } = useLavozim();

  const isLoading = isUserLoading || isDepLoading || isPosLoading;

  // 3. Select opsiyalari (o'zgarishsiz)
  const positionsOptions = useMemo(() => 
    (lavozimResponse?.data ?? []).map((l) => ({ value: String(l.id), label: l.name })), 
    [lavozimResponse]
  );

  const departmentsOptions = useMemo(() => 
    (departmentResponse?.data ?? []).map((d) => ({ value: String(d.id), label: d.name })), 
    [departmentResponse]
  );

  // 4. Formaga ma'lumotlarni tayyorlash
  const profileValues: ProfileFormData | null = useMemo(() => {
    if (!userData) return null;

    return {
      fullName: userData.fullName ?? "",
      email: userInfo?.email ?? "", // useUser'da email bo'lmasa, store'dan olamiz
      phone: userData.phone ?? "",
      // Agar backend'dan kafedra/lavozim ID bo'lib kelsa, to'g'ridan-to'g'ri bering
      // Agar nom bo'lib kelsa, find orqali ID sini aniqlaymiz
      department: departmentsOptions.find(d => d.label === userInfo?.departmentName)?.value ?? "",
      position: positionsOptions.find(l => l.label === userInfo?.role)?.value ?? "",
      image: userData.imageUrl ?? null,
      // ... qolgan fieldlar
      bio: userInfo?.biography ?? "",
      specialty: userInfo?.profession ?? "",
    };
  }, [userData, userInfo, departmentsOptions, positionsOptions]);

  const handleProfileSubmit = (formData: ProfileFormData) => {
    if (!teacherId) return;
    updateProfile({
      id: teacherId,
      ...formData,
      // qolgan map mantiqlari
    });
  };

  if (isLoading) return <Skeleton className="h-[500px] w-full rounded-2xl" />;
  if (!profileValues) return <div className="p-10 text-center">Ma'lumot topilmadi.</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <ProfileSidebar profile={profileValues} />
      <div className="w-full lg:flex-1">
        <ProfileForm
          defaultValues={profileValues} 
          onSubmit={handleProfileSubmit}
          isPending={isPending}
          positionsOptions={positionsOptions}
          departmentsOptions={departmentsOptions}
        />
      </div>
    </div>
  );
}