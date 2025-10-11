import { useSearch } from "@tanstack/react-router";
import { DownloadIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { exportMediaData } from "../services/mediaService";

export function ExportMediaButton() {
	const search = useSearch({ from: "/media" });

	const [exportLoading, setExportLoading] = useState(false);

	const exportMedia = async () => {
		setExportLoading(true);
		const data = await exportMediaData({ data: search });

		const link = document.createElement("a");
		link.href = data.url;
		link.download = "";

		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		setExportLoading(false);
	};

	return (
		<Button onClick={exportMedia} className="h-8" disabled={exportLoading}>
			{exportLoading ? (
				<LoaderCircleIcon className="size-4 animate-spin" />
			) : (
				<DownloadIcon className="size-4" />
			)}{" "}
			Export
		</Button>
	);
}
