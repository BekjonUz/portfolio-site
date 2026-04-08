import { FileText, Save, User } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Separator } from "@/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Textarea } from "@/ui/textarea";
import { cn } from "@/utils";
import type { ProfileFormData } from "./profile-edit";

type ProfileFormProps = {
  defaultValues: ProfileFormData;
  positionsOptions: { value: string; label: string }[];
  departmentsOptions: { value: string; label: string }[];
  onSubmit: (data: ProfileFormData) => void;
  isPending?: boolean;
};

export function ProfileForm({
  defaultValues,
  positionsOptions,
  departmentsOptions,
  onSubmit,
  isPending,
}: ProfileFormProps) {
  const { register, control, handleSubmit } = useForm<ProfileFormData>({
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-[15px] sm:text-[16px] font-semibold text-foreground">Profil ma'lumotlari</h1>
          <p className="text-[11px] sm:text-[12px] text-muted-foreground mt-0.5">Ma'lumotlarni ko'ring va tahrirlang</p>
        </div>
        <Button 
          type="submit" 
          size="sm" 
          className="gap-1.5 shrink-0 rounded-xl bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-100" 
          disabled={isPending}
        >
          <Save className="size-4" />
          {isPending ? "Saqlanmoqda..." : "Saqlash"}
        </Button>
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <Tabs defaultValue="main">
          <div className="border-b px-2 sm:px-4 bg-gray-50/50">
            <TabsList className="bg-transparent h-auto p-0 rounded-none gap-2 justify-start min-w-max">
              {[
                { value: "main", label: "Asosiy ma'lumotlar", icon: <User className="size-4" /> },
                { value: "extra", label: "Qo'shimcha ma'lumotlar", icon: <FileText className="size-4" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-4 py-3 text-[13px] font-medium gap-2 transition-all",
                    "data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="main" className="p-5 mt-0 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-1 sm:col-span-2 space-y-2">
                <Label htmlFor="fullName" className="text-sm font-semibold">To'liq ism</Label>
                <Input id="fullName" className="rounded-xl" {...register("fullName")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email</Label>
                <Input id="email" type="email" className="rounded-xl" {...register("email")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-semibold">Yosh</Label>
                <Input id="age" type="number" className="rounded-xl" {...register("age")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-semibold">Telefon raqami</Label>
                <Input id="phone" className="rounded-xl" {...register("phone")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty" className="text-sm font-semibold">Mutaxassisligi</Label>
                <Input id="specialty" className="rounded-xl" {...register("specialty")} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Lavozim</Label>
                <Controller
                  name="position"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={positionsOptions}
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Tanlang"
                    />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Kafedra</Label>
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <SearchableSelect
                      options={departmentsOptions}
                      value={String(field.value)}
                      onChange={field.onChange}
                      placeholder="Tanlang"
                    />
                  )}
                />
              </div>

              <div className="col-span-1 sm:col-span-2 py-2">
                <Separator />
              </div>

              <div className="space-y-2">
                <Label htmlFor="orcId" className="text-sm font-semibold text-blue-600">ORC ID</Label>
                <Input id="orcId" className="rounded-xl border-blue-100" {...register("orcId")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scopusId" className="text-sm font-semibold text-emerald-600">Scopus ID</Label>
                <Input id="scopusId" className="rounded-xl border-emerald-100" {...register("scopusId")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="scienceId" className="text-sm font-semibold text-amber-600">Science ID</Label>
                <Input id="scienceId" className="rounded-xl border-amber-100" {...register("scienceId")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="researcherId" className="text-sm font-semibold text-rose-600">Researcher ID</Label>
                <Input id="researcherId" className="rounded-xl border-rose-100" {...register("researcherId")} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extra" className="p-5 mt-0 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-semibold">Biografiya</Label>
              <Textarea id="bio" maxLength={250} className="min-h-[120px] rounded-xl resize-none" aria-setsize={255} {...register("bio")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="text-sm font-semibold">Qo'shimcha ma'lumot</Label>
              <Textarea id="additionalInfo" maxLength={250} className="min-h-[100px] rounded-xl resize-none" {...register("additionalInfo")} />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Profil rasmi</Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <FileInput type="image" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold">Rezyume (PDF)</Label>
                <Controller
                  name="resume"
                  control={control}
                  render={({ field }) => (
                    <FileInput type="document" accept=".pdf" value={field.value} onChange={field.onChange} />
                  )}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}