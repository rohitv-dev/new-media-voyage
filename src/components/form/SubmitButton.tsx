import { useFormContext } from "@/hooks/formContext";
import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/Button";

export function SubmitButton({ text }: { text: string }) {
	const form = useFormContext();

	return (
		<form.Subscribe selector={(state) => state.isSubmitting}>
			{(isSubmitting) => (
				<Button
					type="submit"
					className="mt-2 w-full cursor-pointer"
					size="lg"
					disabled={isSubmitting}
				>
					{isSubmitting && <LoaderCircle className="animate-spin h-5 w-5" />}
					{text}
				</Button>
			)}
		</form.Subscribe>
	);
}
