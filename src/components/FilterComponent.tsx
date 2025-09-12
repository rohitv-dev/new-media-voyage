import { useNavigate } from "@tanstack/react-router";
import { FilterIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/Input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { Label } from "./ui/Label";

interface FilterComponentProps extends React.ComponentProps<"div"> {
	statusOptions: { label: string; value: string }[];
	typeOptions: { label: string; value: string }[];
	initialFilters?: {
		status: string;
		type: string;
		title: string;
	};
}

export function FilterComponent({
	statusOptions,
	typeOptions,
	initialFilters,
	...rest
}: FilterComponentProps) {
	const navigate = useNavigate();
	const [status, setStatus] = useState(initialFilters?.status || "");
	const [type, setType] = useState(initialFilters?.type || "");
	const [title, setTitle] = useState(initialFilters?.title || "");
	const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

	const applyFilters = () => {
		navigate({
			to: "/media",
			search: {
				status,
				type,
				title,
			},
		});
	};

	const clearFilters = () => {
		setStatus("");
		setType("");
		setTitle("");

		navigate({
			to: "/media",
		});
	};

	const areFiltersActive = status || type || title;

	return (
		<div {...rest}>
			{/* Desktop filters - always visible on larger screens */}
			<div className="hidden md:flex flex-row gap-4 items-end flex-wrap">
				<Select value={status} onValueChange={setStatus}>
					<SelectTrigger className="w-[180px]" size="sm">
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						{statusOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={type} onValueChange={setType}>
					<SelectTrigger className="w-[180px]" size="sm">
						<SelectValue placeholder="Select type" />
					</SelectTrigger>
					<SelectContent>
						{typeOptions.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Input
					type="text"
					placeholder="Search title..."
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-[180px] h-8"
				/>

				<Button onClick={applyFilters} className="h-8">
					Apply Filters
				</Button>

				{areFiltersActive && (
					<Button
						onClick={clearFilters}
						variant="outline"
						className="h-8 flex items-center gap-2"
					>
						<XIcon className="size-4" />
						Clear
					</Button>
				)}
			</div>

			{/* Mobile filters - in a dialog */}
			<div className="md:hidden flex justify-between items-center">
				<Dialog
					open={isMobileFiltersOpen}
					onOpenChange={setIsMobileFiltersOpen}
				>
					<DialogTrigger asChild>
						<Button variant="outline" className="flex items-center gap-2">
							<FilterIcon className="size-4" />
							Filters
							{areFiltersActive && (
								<span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
									1
								</span>
							)}
						</Button>
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Filters</DialogTitle>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							<div className="flex flex-col gap-2">
								<Label>Status</Label>
								<Select value={status} onValueChange={setStatus}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select status" />
									</SelectTrigger>
									<SelectContent>
										{statusOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Type</Label>
								<Select value={type} onValueChange={setType}>
									<SelectTrigger className="w-full">
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{typeOptions.map((option) => (
											<SelectItem key={option.value} value={option.value}>
												{option.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							<div className="flex flex-col gap-2">
								<Label>Title</Label>
								<Input
									type="text"
									placeholder="Search title..."
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
						</div>
						<div className="flex flex-col gap-2">
							<Button
								onClick={() => {
									applyFilters();
									setIsMobileFiltersOpen(false);
								}}
							>
								Apply Filters
							</Button>
							{areFiltersActive && (
								<Button
									onClick={() => {
										clearFilters();
										setIsMobileFiltersOpen(false);
									}}
									variant="outline"
								>
									Clear All Filters
								</Button>
							)}
						</div>
					</DialogContent>
				</Dialog>

				{areFiltersActive && (
					<Button
						onClick={clearFilters}
						variant="ghost"
						size="sm"
						className="flex items-center gap-1"
					>
						<XIcon className="size-4" />
						Clear
					</Button>
				)}
			</div>
		</div>
	);
}
