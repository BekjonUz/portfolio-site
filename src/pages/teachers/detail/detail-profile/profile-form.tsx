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
  const { register, control, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues,
    values: defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h1 className="text-[15px] sm:text-[16px] font-semibold text-foreground">
            Profil ma'lumotlari
          </h1>
          <p className="text-[11px] sm:text-[12px] text-muted-foreground mt-0.5">
            Ma'lumotlarni ko'ring va tahrirlang
          </p>
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
          <div className="border-b px-2 sm:px-4 bg-muted/30">
            <TabsList className="bg-transparent h-auto p-0 rounded-none gap-2 justify-start min-w-max">
              {[
                { value: "main", label: "Asosiy ma'lumotlar", icon: <User className="size-3.5" /> },
                { value: "extra", label: "Qo'shimcha", icon: <FileText className="size-3.5" /> },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "rounded-none border-b-2 border-transparent px-3 sm:px-4 py-3 text-[12px] sm:text-[13px] font-medium gap-1.5 transition-all",
                    "data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent shadow-none"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="main" className="p-4 sm:p-6 mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div className="col-span-1 sm:col-span-2 space-y-1.5">
                <Label htmlFor="fullName" className="text-[13px] font-semibold">
                  To'liq ism
                </Label>
                <Input
                  id="fullName"
                  className="rounded-xl h-10"
                  placeholder="Ism Familiya"
                  {...register("fullName")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[13px] font-semibold">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="rounded-xl h-10"
                  placeholder="email@example.com"
                  {...register("email")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-[13px] font-semibold">
                  Telefon
                </Label>
                <Input
                  id="phone"
                  className="rounded-xl h-10"
                  placeholder="+998 90 000 00 00"
                  {...register("phone")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-[13px] font-semibold">
                  Yosh
                </Label>
                <Input
                  id="age"
                  type="number"
                  className="rounded-xl h-10"
                  placeholder="30"
                  {...register("age")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specialty" className="text-[13px] font-semibold">
                  Mutaxassisligi
                </Label>
                <Input
                  id="specialty"
                  className="rounded-xl h-10"
                  placeholder="Mutaxassislik"
                  {...register("specialty")}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold">Lavozim</Label>
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

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold">Kafedra</Label>
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

              <div className="col-span-1 sm:col-span-2">
                <Separator className="my-1" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="orcId" className="text-[13px] font-semibold text-blue-600">
                  ORC ID
                </Label>
                <Input
                  id="orcId"
                  className="rounded-xl h-10 border-blue-100 focus-visible:ring-blue-200"
                  placeholder="0000-0000-0000-0000"
                  {...register("orcId")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="scopusId" className="text-[13px] font-semibold text-emerald-600">
                  Scopus ID
                </Label>
                <Input
                  id="scopusId"
                  className="rounded-xl h-10 border-emerald-100 focus-visible:ring-emerald-200"
                  placeholder="Scopus ID"
                  {...register("scopusId")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="scienceId" className="text-[13px] font-semibold text-amber-600">
                  Science ID
                </Label>
                <Input
                  id="scienceId"
                  className="rounded-xl h-10 border-amber-100 focus-visible:ring-amber-200"
                  placeholder="Science ID"
                  {...register("scienceId")}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="researcherId" className="text-[13px] font-semibold text-rose-600">
                  Researcher ID
                </Label>
                <Input
                  id="researcherId"
                  className="rounded-xl h-10 border-rose-100 focus-visible:ring-rose-200"
                  placeholder="Researcher ID"
                  {...register("researcherId")}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="extra" className="p-4 sm:p-6 mt-0 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="bio" className="text-[13px] font-semibold">
                Biografiya
              </Label>
              <Textarea
                id="bio"
                maxLength={250}
                className="min-h-[110px] rounded-xl resize-none text-[13px]"
                placeholder="O'zingiz haqingizda yozing..."
                {...register("bio")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="additionalInfo" className="text-[13px] font-semibold">
                Qo'shimcha ma'lumot
              </Label>
              <Textarea
                id="additionalInfo"
                maxLength={250}
                className="min-h-[90px] rounded-xl resize-none text-[13px]"
                placeholder="Qo'shimcha ma'lumotlar..."
                {...register("additionalInfo")}
              />
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold">Profil rasmi</Label>
                <Controller
                  name="image"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      type="image"
                      value={field.value ?? defaultValues.image ?? null}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-[13px] font-semibold">Rezyume (PDF)</Label>
                <Controller
                  name="resume"
                  control={control}
                  render={({ field }) => (
                    <FileInput
                      type="document"
                      accept=".pdf"
                      value={field.value ?? defaultValues.resume ?? null}
                      onChange={field.onChange}
                    />
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