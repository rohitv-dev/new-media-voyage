import { DataTable } from "@/components/dataTable/DataTable";
import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Rating } from "@/components/ui/Rating";
import type { Media } from "@/lib/db/schemas/media";
import { formatDate } from "@/utils/functions/dateFunctions";
import { useNavigate } from "@tanstack/react-router";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";

interface MediaTableProps {
	data: Media[];
	hideActions?: boolean;
}

export function MediaTable({ data, hideActions = false }: MediaTableProps) {
	const columnHelper = createColumnHelper<Media>();
	const navigate = useNavigate();

	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const columns: ColumnDef<Media, any>[] = useMemo(
		() => [
			columnHelper.accessor("title", { header: "Title" }),
			columnHelper.accessor("type", { header: "Type" }),
			columnHelper.accessor("status", { header: "Status" }),
			columnHelper.accessor("genre", { header: "Genre" }),
			columnHelper.accessor("platform", { header: "Platform" }),
			columnHelper.accessor("createdAt", {
				header: "Added On",
				cell: (info) => formatDate(info.getValue()),
			}),
			columnHelper.accessor("rating", {
				header: "Rating",
				cell: (info) => <Rating readOnly rating={info.getValue()} />,
			}),
			columnHelper.display({
				id: "Actions",
				header: () => "",
				cell: ({
					row: {
						original: { id },
					},
				}) => {
					if (hideActions) return null;

					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" className="h-8 w-8 p-0">
									<span className="sr-only">Open menu</span>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Actions</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>View Media</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => {
										navigate({
											to: "/media/update/$id",
											params: { id: String(id) },
										});
									}}
								>
									Update Media
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					);
				},
			}),
		],
		[columnHelper, navigate, hideActions],
	);

	return <DataTable columns={columns} data={data} />;
}
