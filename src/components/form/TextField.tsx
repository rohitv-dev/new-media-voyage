import { useFieldContext } from "@/hooks/formContext";
import { cn } from "@/lib/utils";
import type { ComponentProps } from "react";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";

interface TextFieldProps extends ComponentProps<"input"> {
	label: string;
	withAsterisk?: boolean;
}

export function TextField({ label, withAsterisk, ...props }: TextFieldProps) {
	const field = useFieldContext<string>();

	return (
		<div className="grid gap-2">
			<Label className={cn(["gap-1", props.disabled && "text-muted"])}>
				{label}
				{withAsterisk && (
					<span className="text-destructive text-center font-bold">*</span>
				)}
			</Label>
			<Input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onChange={(e) => field.handleChange(e.target.value)}
				onBlur={field.handleBlur}
				{...props}
			/>
			{!field.state.meta.isValid && (
				<span className="text-destructive text-sm font-medium">
					{field.state.meta.errors.map((e) => e.message).join(", ")}
				</span>
			)}
		</div>
	);
}
