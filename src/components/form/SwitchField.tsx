import { useFieldContext } from "@/hooks/formContext";
import { Label } from "../ui/Label";
import { Switch } from "../ui/Switch";

interface SwitchFieldProps {
	label: string;
}

export function SwitchField({ label }: SwitchFieldProps) {
	const field = useFieldContext<boolean | undefined>();

	return (
		<div className="flex gap-1 items-center">
			<Label>{label}</Label>
			<Switch
				checked={field.state.value}
				onCheckedChange={(val) => field.handleChange(val)}
			/>
		</div>
	);
}
