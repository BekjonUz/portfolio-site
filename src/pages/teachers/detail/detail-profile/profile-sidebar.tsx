import { UserRound } from "lucide-react";
import { Card } from "@/ui/card";
import { Separator } from "@/ui/separator";
import type { ProfileFormData } from "./profile-edit";
import { useProfileCompletion } from "@/hooks/user/useProfileCompletion";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-medium">{value}</span>
    </div>
  );
}

type ProfileSidebarProps = {
  profile: ProfileFormData;
  userId?: number;
};

export function ProfileSidebar({ profile, userId }: ProfileSidebarProps) {
  const preview = typeof profile.image === "string"
    ? profile.image
    : profile.image
      ? URL.createObjectURL(profile.image)
      : null;

  const { data: completionResponse } = useProfileCompletion(userId ?? 0);
  const completion = completionResponse?.data ?? 0;

  const { data: departmentResponse } = useDepartment();
  const { data: lavozimResponse } = useLavozim();

  const departmentName = (departmentResponse?.data ?? []).find(
    (d) => String(d.id) === String(profile.department)
  )?.name ?? profile.department ?? "";

  const lavozimName = (lavozimResponse?.data ?? []).find(
    (l) => String(l.id) === String(profile.position)
  )?.name ?? profile.position ?? "";

  const getCompletionColor = (percent: number) => {
    if (percent >= 80) return { bar: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (percent >= 50) return { bar: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { bar: "bg-rose-500", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const colors = getCompletionColor(completion);

  return (
    <div className="w-full lg:w-72 lg:shrink-0">
      <Card className="py-0 overflow-hidden gap-0">
        <div className="w-full aspect-[4/3] sm:aspect-[16/7] lg:aspect-square bg-muted flex items-center justify-center overflow-hidden">
          {preview ? (
            <img src={preview} alt="teacher" className="w-full h-full object-cover" />
          ) : (
            <UserRound className="size-16 sm:size-20 lg:size-24 text-muted-foreground" />
          )}
        </div>

        <div className="px-4 py-4 flex flex-col gap-3">
          <h2 className="font-semibold text-[14px] leading-snug">{profile.fullName}</h2>

          <div className={`rounded-xl border px-3 py-2.5 flex flex-col gap-2 ${colors.bg} ${colors.border}`}>
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-medium text-muted-foreground">Profil to'liqligi</span>
              <span className={`text-[13px] font-bold ${colors.text}`}>{completion}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/70 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
                style={{ width: `${completion}%` }}
              />
            </div>
            <p className={`text-[11px] ${colors.text}`}>
              {completion >= 80
                ? "Profil deyarli to'liq!"
                : completion >= 50
                  ? "Profilni to'ldirishda davom eting"
                  : "Profilni to'ldiring"}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
            {lavozimName && <InfoRow label="Lavozimi" value={lavozimName} />}
            {departmentName && <InfoRow label="Kafedrasi" value={departmentName} />}
            {profile.phone && <InfoRow label="Telefon" value={profile.phone} />}
            {profile.specialty && <InfoRow label="Mutaxassisligi" value={profile.specialty} />}
            {profile.email && <InfoRow label="Email" value={profile.email} />}
            {profile.age && <InfoRow label="Yoshi" value={`${profile.age} yosh`} />}
          </div>

          {(profile.orcId || profile.scopusId || profile.scienceId || profile.researcherId) && <Separator />}

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-x-4 gap-y-2">
            {profile.orcId && <InfoRow label="ORC ID" value={profile.orcId} />}
            {profile.scopusId && <InfoRow label="Scopus ID" value={profile.scopusId} />}
            {profile.scienceId && <InfoRow label="Science ID" value={profile.scienceId} />}
            {profile.researcherId && <InfoRow label="Researcher ID" value={profile.researcherId} />}
          </div>

          {profile.bio && (
            <div className="flex flex-col gap-0.5 pt-1">
              <span className="text-[11px] text-muted-foreground">Biografiya</span>
              <p className="text-[12px] leading-relaxed text-muted-foreground">{profile.bio}</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}