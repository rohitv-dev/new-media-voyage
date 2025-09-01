import { useFieldContext } from "@/hooks/formContext";
import { Rating } from "../ui/Rating";

interface RatingFieldProps {
	size?: number;
}

export function RatingField({ size = 16 }: RatingFieldProps) {
	const field = useFieldContext<number>();

	return (
		<Rating
			size={size}
			rating={field.state.value}
			onChange={(val) => field.handleChange(val)}
		/>
	);
}
