import { XIcon } from "lucide-react";
import { useState } from "react";
import { useFieldContext } from "@/hooks/formContext";
import { Button } from "../ui/Button";
import { Calendar } from "../ui/calendar";
import { Label } from "../ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface DatePickerFieldProps {
	label: string;
	withAsterisk?: boolean;
}

export function DatePickerField({ label, withAsterisk }: DatePickerFieldProps) {
	const field = useFieldContext<Date | undefined>();

	const value = field.state.value;

	const [open, setOpen] = useState(false);

	return (
		<div className="flex flex-col gap-3">
			<Label className="px-1 gap-1">
				{label}
				{withAsterisk && <span className="text-destructive">*</span>}
			</Label>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						className="w-full justify-between font-normal"
					>
						{value ? value.toLocaleDateString() : "Select date"}
						{value && (
							<XIcon
								className="ml-auto cursor-pointer"
								onClick={(e) => {
									e.stopPropagation();
									field.handleChange(undefined);
								}}
							/>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto overflow-hidden p-0" align="start">
					<Calendar
						mode="single"
						buttonVariant="secondary"
						selected={value}
						captionLayout="dropdown"
						onSelect={(date) => {
							field.handleChange(date);
							setOpen(false);
						}}
					/>
				</PopoverContent>
			</Popover>
			{!field.state.meta.isValid && (
				<span className="text-destructive text-sm font-medium">
					{field.state.meta.errors.map((e) => e.message).join(", ")}
				</span>
			)}
		</div>
	);
}
