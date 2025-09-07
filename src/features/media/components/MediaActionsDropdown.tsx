import { Button } from "@/components/ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import type { Media } from "@/lib/db/schemas/media";
import { useNavigate } from "@tanstack/react-router";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface MediaActionsDropdownProps {
	media: Media;
}

export function MediaActionsDropdown({ media }: MediaActionsDropdownProps) {
	const [open, setOpen] = useState(false);
	const navigate = useNavigate();

	const handleViewMedia = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen(false);
		navigate({
			to: "/media/view/$id",
			params: { id: String(media.id) },
		});
	};

	const handleUpdateMedia = (e: React.MouseEvent) => {
		e.stopPropagation();
		setOpen(false);
		navigate({
			to: "/media/update/$id",
			params: { id: String(media.id) },
		});
	};

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="h-8 w-8 p-0">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="h-4 w-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={handleViewMedia}>
					View Media
				</DropdownMenuItem>
				<DropdownMenuItem onClick={handleUpdateMedia}>
					Update Media
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
