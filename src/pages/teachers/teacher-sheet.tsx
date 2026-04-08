import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTeacherSheetActions, useTeacherSheetEditData, useTeacherSheetIsOpen } from "@/store/teacherSheet";
import { useCreateTeacher } from "@/hooks/teacher/useCreateTeacher";
import { useEditTeacher } from "@/hooks/teacher/useEditTeacher";
import { useGetTeacherById } from "@/hooks/teacher/useGetTeacherById";
import { useCollage } from "@/hooks/collage/useCollage";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";
import type { Teacher } from "@/features/teacher/teacher.type";

type TeacherFormValues = {
  fullName: string;
  phone: string;
  collegeId: string;
  departmentId: string;
  lavozimId: string;
  gender: string;
  image: File | null;
  file: File | null;
  password: string;
  confirmPassword: string;
};

function formatPhone(digits: string): string {
  const d = digits.slice(0, 9);
  if (d.length === 0) return "+998";
  let result = "+998 (";
  result += d.slice(0, Math.min(2, d.length));
  if (d.length < 2) return result;
  result += ") ";
  result += d.slice(2, Math.min(5, d.length));
  if (d.length <= 5) return result;
  result += "-";
  result += d.slice(5, Math.min(7, d.length));
  if (d.length <= 7) return result;
  result += "-";
  result += d.slice(7, 9);
  return result;
}

function extractDigits(formatted: string): string {
  const all = formatted.replace(/\D/g, "");
  return all.startsWith("998") ? all.slice(3) : all;
}

export function TeacherSheet() {
  const isOpen = useTeacherSheetIsOpen();
  const editData = useTeacherSheetEditData() as Teacher | null;
  const { close } = useTeacherSheetActions();
  const isEdit = editData !== null;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { mutate: createTeacher, isPending: isCreating } = useCreateTeacher();
  const { mutate: editTeacher, isPending: isEditing } = useEditTeacher();
  const isSubmitting = isCreating || isEditing;

  const { data: teacherDetail } = useGetTeacherById(editData?.id ?? 0);

  const { data: collageResponse } = useCollage();
  const { data: departmentResponse } = useDepartment();
  const { data: lavozimResponse } = useLavozim();

  const collegeOptions = useMemo(
    () => (collageResponse?.data ?? []).map((c) => ({ value: String(c.id), label: c.name })),
    [collageResponse],
  );

  const departmentOptions = useMemo(
    () =>
      (departmentResponse?.data ?? []).map((d) => ({
        value: String(d.id),
        label: d.name,
        collegeId: String(d.collegeId),
      })),
    [departmentResponse],
  );

  const lavozimOptions = useMemo(
    () => (lavozimResponse?.data ?? []).map((l) => ({ value: String(l.id), label: l.name })),
    [lavozimResponse],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TeacherFormValues>({
    defaultValues: {
      fullName: "",
      phone: "+998",
      collegeId: "",
      departmentId: "",
      lavozimId: "",
      gender: "true",
      image: null,
      file: null,
      password: "",
      confirmPassword: "",
    },
  });

  const watchedCollegeId = watch("collegeId");
  const watchedPassword = watch("password");

  const availableDepartments = useMemo(
    () =>
      watchedCollegeId
        ? departmentOptions.filter((d) => d.collegeId === watchedCollegeId)
        : departmentOptions,
    [watchedCollegeId, departmentOptions],
  );

  useEffect(() => {
    if (editData && teacherDetail?.data && departmentOptions.length > 0 && lavozimOptions.length > 0) {
      const d = teacherDetail.data;

      const foundDepartment = departmentOptions.find((dep) => dep.label === d.departmentName);
      const foundLavozim = lavozimOptions.find((lav) => lav.label === d.lavozimName);

      reset({
        fullName: d.fullName,
        phone: d.phone ?? "+998",
        gender: d.gender ? "true" : "false",
        collegeId: foundDepartment?.collegeId ?? "",
        departmentId: foundDepartment?.value ?? "",
        lavozimId: foundLavozim?.value ?? "",
        image: null,
        file: null,
        password: "",
        confirmPassword: "",
      });
    }
  }, [editData, teacherDetail, departmentOptions, lavozimOptions, reset]);

  const handleCollegeChange = (value: string) => {
    setValue("collegeId", value);
    setValue("departmentId", "");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = extractDigits(e.target.value);
    setValue("phone", formatPhone(digits), { shouldValidate: true });
  };

  const handlePhoneKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    currentValue: string,
  ) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const digits = extractDigits(currentValue);
      setValue(
        "phone",
        digits.length > 0 ? formatPhone(digits.slice(0, -1)) : "+998",
        { shouldValidate: true },
      );
    }
  };

  const handleClose = () => {
    reset();
    setShowPassword(false);
    setShowConfirm(false);
    close();
  };

  const onSubmit = (values: TeacherFormValues) => {
    const phoneNumber = values.phone.replace(/\D/g, "");
    const gender = values.gender === "true";

    if (isEdit) {
      editTeacher(
        {
          id: editData.id,
          fullName: values.fullName,
          phoneNumber,
          lavozmId: Number(values.lavozimId),
          gender,
          password: values.password,
          departmentId: Number(values.departmentId),
          image: values.image ?? undefined,
          imgUrl: editData.imageUrl,
          file: values.file ?? undefined,
          fileUrl: editData.fileUrl,
        },
        { onSuccess: handleClose },
      );
    } else {
      createTeacher(
        {
          fullName: values.fullName,
          phoneNumber,
          lavozmId: Number(values.lavozimId),
          gender,
          password: values.password,
          departmentId: Number(values.departmentId),
          image: values.image!,
          file: values.file!,
        },
        { onSuccess: handleClose },
      );
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && handleClose()}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0">
        <SheetHeader className="px-6 py-4 border-b">
          <SheetTitle className="text-[16px]">
            {isEdit ? "O'qituvchini tahrirlash" : "O'qituvchi qo'shish"}
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <form
            id="teacher-form"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 px-6 py-5"
          >
            <div className="flex flex-col gap-2">
              <Label>
                Rasm{" "}
                <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
              </Label>
              <Controller
                name="image"
                control={control}
                render={({ field }) => (
                  <FileInput type="image" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>
                CV (PDF){" "}
                <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
              </Label>
              <Controller
                name="file"
                control={control}
                render={({ field }) => (
                  <FileInput type="document" value={field.value} onChange={field.onChange} />
                )}
              />
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label htmlFor="fullName">To'liq F.I.Sh.</Label>
              <Input
                id="fullName"
                placeholder="Masalan: Aliyev Bobur Hamidovich"
                {...register("fullName", {
                  required: "To'liq ism kiritilishi shart",
                  minLength: { value: 5, message: "Kamida 5 ta belgi kiriting" },
                })}
              />
              {errors.fullName && (
                <span className="text-[12px] text-red-500">{errors.fullName.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="phone">Telefon raqam</Label>
              <Controller
                name="phone"
                control={control}
                rules={{
                  validate: (val) =>
                    val.replace(/\D/g, "").length === 12 || "To'liq telefon raqam kiriting",
                }}
                render={({ field }) => (
                  <Input
                    id="phone"
                    inputMode="numeric"
                    placeholder="+998 (90) 000-00-00"
                    value={field.value}
                    onChange={handlePhoneChange}
                    onKeyDown={(e) => handlePhoneKeyDown(e, field.value)}
                  />
                )}
              />
              {errors.phone && (
                <span className="text-[12px] text-red-500">{errors.phone.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Jinsi</Label>
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Jins tanlanishi shart" }}
                render={({ field }) => (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("true")}
                      className={`flex-1 py-2 rounded-md text-[13px] font-medium border transition-colors ${
                        field.value === "true"
                          ? "bg-blue-50 border-blue-400 text-blue-700"
                          : "border-input text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Erkak
                    </button>
                    <button
                      type="button"
                      onClick={() => field.onChange("false")}
                      className={`flex-1 py-2 rounded-md text-[13px] font-medium border transition-colors ${
                        field.value === "false"
                          ? "bg-pink-50 border-pink-400 text-pink-700"
                          : "border-input text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Ayol
                    </button>
                  </div>
                )}
              />
              {errors.gender && (
                <span className="text-[12px] text-red-500">{errors.gender.message}</span>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label>Fakultet</Label>
              <Controller
                name="collegeId"
                control={control}
                rules={{ required: "Fakultet tanlanishi shart" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={collegeOptions}
                    value={field.value}
                    onChange={handleCollegeChange}
                    placeholder="Fakultetni tanlang"
                    searchPlaceholder="Fakultet qidirish..."
                  />
                )}
              />
              {errors.collegeId && (
                <span className="text-[12px] text-red-500">{errors.collegeId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Kafedra</Label>
              <Controller
                name="departmentId"
                control={control}
                rules={{ required: "Kafedra tanlanishi shart" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={availableDepartments}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={
                      watchedCollegeId ? "Kafedrани tanlang" : "Avval fakultetni tanlang"
                    }
                    searchPlaceholder="Kafedra qidirish..."
                  />
                )}
              />
              {errors.departmentId && (
                <span className="text-[12px] text-red-500">{errors.departmentId.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Lavozim</Label>
              <Controller
                name="lavozimId"
                control={control}
                rules={{ required: "Lavozim tanlanishi shart" }}
                render={({ field }) => (
                  <SearchableSelect
                    options={lavozimOptions}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Lavozimni tanlang"
                    searchPlaceholder="Lavozim qidirish..."
                  />
                )}
              />
              {errors.lavozimId && (
                <span className="text-[12px] text-red-500">{errors.lavozimId.message}</span>
              )}
            </div>

            <Separator />

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">
                Parol{" "}
                {isEdit && (
                  <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Kamida 8 ta belgi"
                  className="pr-10"
                  {...register("password", {
                    required: isEdit ? false : "Parol kiritilishi shart",
                    minLength: {
                      value: 8,
                      message: "Parol kamida 8 ta belgidan iborat bo'lishi kerak",
                    },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[12px] text-red-500">{errors.password.message}</span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">
                Parolni tasdiqlash{" "}
                {isEdit && (
                  <span className="text-muted-foreground font-normal">(ixtiyoriy)</span>
                )}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Parolni qayta kiriting"
                  className="pr-10"
                  {...register("confirmPassword", {
                    required: isEdit ? false : "Parolni tasdiqlash shart",
                    validate: (val) =>
                      !watchedPassword || val === watchedPassword || "Parollar mos kelmadi",
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[12px] text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
          </form>
        </ScrollArea>

        <div className="border-t px-6 py-4 flex items-center justify-end gap-2 shrink-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Bekor qilish
          </Button>
          <Button type="submit" form="teacher-form" disabled={isSubmitting}>
            {isSubmitting ? "Yuklanmoqda..." : isEdit ? "Saqlash" : "Qo'shish"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}