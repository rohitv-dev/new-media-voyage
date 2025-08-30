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

interface SelectFieldProps extends ComponentProps<"select"> {
	label: string;
	name: string;
	withAsterisk?: boolean;
	placeholder?: string;
	options: { label: string; value: string }[];
}

export function SelectField({
	label,
	withAsterisk,
	placeholder,
	options,
}: SelectFieldProps) {
	const field = useFieldContext<string>();

	return (
		<div className="grid gap-2">
			<Label className="gap-1">
				{label}
				{withAsterisk && <span className="text-destructive">*</span>}
			</Label>
			<Select
				value={field.state.value}
				onValueChange={(value) => field.handleChange(value)}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent>
					{options.map((option) => (
						<SelectItem key={option.value} value={option.value}>
							{option.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
