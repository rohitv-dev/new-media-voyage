import { LoaderCircle } from "lucide-react";

export function DefaultLoading() {
	return (
		<div className="fixed inset-0 flex justify-center items-center h-screen w-screen">
			<LoaderCircle size={42} className="animate-spin text-primary" />
		</div>
	);
}
