import { cn } from "@/utils";
import { Award, ChevronRight, FileText, FlaskConical, TrendingUp, Users } from "lucide-react";

type StatsGridProps = {
  stats: {
    researches: number;
    publications: number;
    supervision: number;
    activities: number;
    awards: number;
  };
};

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      <StatsCard
        icon={<FlaskConical className="size-5" />}
        label="Tadqiqotlar"
        value={stats.researches}
        accent="bg-blue-500"
        lightAccent="bg-blue-50"
        iconColor="text-blue-600"
      />
      <StatsCard
        icon={<Users className="size-5" />}
        label="Nazoratlar"
        value={stats.supervision}
        accent="bg-violet-500"
        lightAccent="bg-violet-50"
        iconColor="text-violet-600"
      />
      <StatsCard
        icon={<FileText className="size-5" />}
        label="Nashrlar"
        value={stats.publications}
        accent="bg-emerald-500"
        lightAccent="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <StatsCard
        icon={<TrendingUp className="size-5" />}
        label="Maslahatlar"
        value={stats.activities}
        accent="bg-amber-500"
        lightAccent="bg-amber-50"
        iconColor="text-amber-600"
      />
      <StatsCard
        icon={<Award className="size-5" />}
        label="Mukofotlar"
        value={stats.awards}
        accent="bg-rose-500"
        lightAccent="bg-rose-50"
        iconColor="text-rose-600"
      />
    </div>
  );
}

type StatsCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
  lightAccent: string;
  iconColor: string;
};

function StatsCard({ icon, label, value, accent, lightAccent, iconColor }: StatsCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-300",
        "hover:shadow-lg hover:-translate-y-1 active:scale-95"
      )}
    >
      {/* Tepada ingichka rangli chiziq o'rniga zamonaviyroq dekoratsiya */}
      <div className={cn("absolute top-0 left-0 w-1.5 h-full", accent)} />
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className={cn(
            "flex size-10 items-center justify-center rounded-xl transition-colors duration-300",
            lightAccent,
            iconColor
          )}>
            {icon}
          </div>
          <ChevronRight className="size-4 text-muted-foreground/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-muted-foreground" />
        </div>

        <div className="space-y-1">
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
            {label}
          </p>
        </div>
      </div>

      {/* Orqa fondagi yashirin effekt */}
      <div className={cn(
        "absolute -right-4 -bottom-4 size-16 rounded-full opacity-5 transition-transform duration-500 group-hover:scale-150",
        accent
      )} />
    </div>
  );
}