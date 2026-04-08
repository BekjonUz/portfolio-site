import { FileInput } from "@/components/file-input/file-input";
import { SearchableSelect } from "@/components/searchable-select/searchable-select";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { ScrollArea } from "@/ui/scroll-area";
import { Separator } from "@/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet";
import { Textarea } from "@/ui/textarea";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCollage } from "@/hooks/collage/useCollage";
import { useDepartment } from "@/hooks/department/useDepartment";
import { useLavozim } from "@/hooks/lavozim/useLavozim";

export type ProfileFormData = {
	fullName: string;
	email: string;
	age: string;
	phone: string;
	department: string;
	position: string;
	bio: string;
	additionalInfo: string;
	specialty: string;
	orcId: string;
	scopusId: string;
	scienceId: string;
	researcherId: string;
	image: string | null;
	resume: File | null;
};

type ProfileEditSheetProps = {
	open: boolean;
	onClose: () => void;
	defaultValues: ProfileFormData;
	onSave: (data: ProfileFormData) => void;
};

export function ProfileEditSheet({ open, onClose, defaultValues, onSave }: ProfileEditSheetProps) {
	const { register, handleSubmit, reset, control } = useForm<ProfileFormData>({
		defaultValues,
	});

	const { data: collageResponse } = useCollage();
	const { data: departmentResponse } = useDepartment();
	const { data: lavozimResponse } = useLavozim();

	const positionsOptions = useMemo(
		() => (lavozimResponse?.data ?? []).map((l) => ({ value: String(l.id), label: l.name })),
		[lavozimResponse],
	);

	const departmentsOptions = useMemo(
		() => (departmentResponse?.data ?? []).map((d) => ({ value: String(d.id), label: d.name })),
		[departmentResponse],
	);

	useEffect(() => {
		if (open) reset(defaultValues);
	}, [open, reset, defaultValues]);

	const onSubmit = (data: ProfileFormData) => {
		onSave(data);
		onClose();
	};

	return (
		<Sheet open={open} onOpenChange={(v) => !v && onClose()}>
			<SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col gap-0">
				<SheetHeader className="px-6 py-4 border-b">
					<SheetTitle>Profilni tahrirlash</SheetTitle>
				</SheetHeader>

				<ScrollArea className="flex-1">
					<form id="profile-edit-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 px-6 py-5">
						{/* Rasm */}
						<div className="flex flex-col gap-2">
							<Label>Rasmi</Label>
							<Controller
								name="image"
								control={control}
								render={({ field }) => <FileInput type="image" value={field.value} onChange={field.onChange} />}
							/>
						</div>

						<Separator />

						{/* To'liq ism */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="fullName">To'liq ism</Label>
							<Input id="fullName" placeholder="Masalan: Aliyev Bobur Hamidovich" {...register("fullName")} />
						</div>

						{/* Email */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input id="email" type="email" placeholder="example@ttu.uz" {...register("email")} />
						</div>

						{/* Yosh */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="age">Yosh</Label>
							<Input id="age" type="number" placeholder="45" {...register("age")} />
						</div>

						{/* Telefon */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="phone">Telefon raqami</Label>
							<Input id="phone" placeholder="+998 (90) 000-00-00" {...register("phone")} />
						</div>

						<Separator />

						{/* Kafedra */}
						<div className="flex flex-col gap-2">
							<Label>Kafedra</Label>
							<Controller
								name="department"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={departmentsOptions}
										value={field.value}
										onChange={field.onChange}
										placeholder="Kafedrani tanlang"
										searchPlaceholder="Kafedra qidirish..."
									/>
								)}
							/>
						</div>

						{/* Lavozim */}
						<div className="flex flex-col gap-2">
							<Label>Lavozim</Label>
							<Controller
								name="position"
								control={control}
								render={({ field }) => (
									<SearchableSelect
										options={positionsOptions}
										value={field.value}
										onChange={field.onChange}
										placeholder="Lavozimni tanlang"
										searchPlaceholder="Lavozim qidirish..."
									/>
								)}
							/>
						</div>

						{/* Mutaxassisligi */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="specialty">Mutaxassisligi</Label>
							<Input id="specialty" placeholder="Masalan: Jarrohlik, Nevrologiya..." {...register("specialty")} />
						</div>

						<Separator />

						{/* Ilmiy ID'lar */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="orcId">ORC ID</Label>
							<Input id="orcId" placeholder="0000-0000-0000-0000" {...register("orcId")} />
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="scopusId">Scopus ID</Label>
							<Input id="scopusId" placeholder="Masalan: 57210000000" {...register("scopusId")} />
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="scienceId">Science ID</Label>
							<Input id="scienceId" placeholder="Masalan: A-1234-2020" {...register("scienceId")} />
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="researcherId">Researcher ID</Label>
							<Input id="researcherId" placeholder="Masalan: A-1234-2020" {...register("researcherId")} />
						</div>

						<Separator />

						{/* Biografiya */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="bio">Biografiya</Label>
							<Textarea
								id="bio"
								placeholder="Qisqacha biografiya..."
								className="min-h-[100px] resize-none"
								{...register("bio")}
								maxLength={250}
							/>
						</div>

						{/* Qo'shimcha ma'lumot */}
						<div className="flex flex-col gap-2">
							<Label htmlFor="additionalInfo">Qo'shimcha ma'lumot</Label>
							<Textarea
								id="additionalInfo"
								placeholder="Ilmiy yutuqlar, tajriba..."
								className="min-h-[80px] resize-none"
								{...register("additionalInfo")}
								maxLength={250}
							/>
						</div>

						<Separator />

						{/* Resume */}
						<div className="flex flex-col gap-2">
							<Label>Fayllar (PDF/DOCX)</Label>
							<Controller
								name="resume"
								control={control}
								render={({ field }) => (
									<FileInput type="document" accept=".pdf,.doc,.docx" value={field.value} onChange={field.onChange} />
								)}
							/>
						</div>
					</form>
				</ScrollArea>

				<div className="border-t px-6 py-4 flex items-center justify-end gap-2 shrink-0">
					<Button type="button" variant="outline" onClick={onClose}>
						Bekor qilish
					</Button>
					<Button type="submit" form="profile-edit-form">
						Saqlash
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}