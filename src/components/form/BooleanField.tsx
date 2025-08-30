import { useFieldContext } from "@/hooks/formContext";
import type { ComponentProps } from "react";
import { Label } from "../ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "../ui/Select";

interface BooleanFieldProps extends ComponentProps<"select"> {
	label: string;
	name: string;
	withAsterisk?: boolean;
	placeholder?: string;
}

export function BooleanField({
	label,
	withAsterisk,
	placeholder,
}: BooleanFieldProps) {
	const field = useFieldContext<boolean | undefined>();

	return (
		<div className="grid gap-2">
			<Label className="gap-1">
				{label}
				{withAsterisk && <span className="text-destructive">*</span>}
			</Label>
			<Select>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{["Yes", "No"].map((option) => (
						<SelectItem
							key={option}
							value={option}
							onSelect={() => {
								field.handleChange(option === "Yes");
							}}
						>
							{option}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
