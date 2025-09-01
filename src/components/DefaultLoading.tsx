import { LoaderCircle } from "lucide-react";

export function DefaultLoading() {
	return (
		<div className="flex justify-center items-center w-full">
			<LoaderCircle size={42} className="animate-spin" />
		</div>
	);
}
