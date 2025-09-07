import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { HomeIcon, MenuIcon, PlusIcon, UserRoundIcon } from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/DropdownMenu";

export function Navbar() {
	const navigate = useNavigate();
	const { user } = useRouteContext({ strict: false });
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Show skeleton when user data is loading
	if (!user) {
		return (
			<nav className="w-full px-4 py-2 border-b shadow-sm">
				<div className="container mx-auto flex items-center justify-between">
					<div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />

					{/* Desktop Navigation */}
					<div className="hidden md:flex items-center space-x-2">
						<div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
					</div>

					{/* Mobile Navigation */}
					<div className="md:hidden flex items-center">
						<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
						<div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse ml-2" />
					</div>
				</div>
			</nav>
		);
	}

	return (
		<nav className="w-full px-4 py-2 border-b shadow-sm rounded-bl-xl rounded-br-xl">
			<div className="container mx-auto flex items-center justify-between">
				{/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
				<span
					className="text-xl font-bold cursor-pointer"
					onClick={() => {
						navigate({ to: "/media" });
					}}
				>
					Media Voyage
				</span>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center space-x-2">
					<Button variant="outline" onClick={() => navigate({ to: "/media" })}>
						Home
					</Button>
					<Button
						onClick={() => {
							navigate({ to: "/media/add" });
						}}
					>
						Add
					</Button>
					<ThemeToggle />
					<Button
						variant="outline"
						onClick={() => navigate({ to: "/profile" })}
					>
						<UserRoundIcon className="mr-2 h-4 w-4" />
						{user.name}
					</Button>
				</div>

				{/* Mobile Navigation */}
				<div className="md:hidden flex items-center">
					<ThemeToggle />
					<DropdownMenu open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" size="icon" className="ml-2">
								<MenuIcon className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-48">
							<DropdownMenuItem
								onClick={() => {
									navigate({ to: "/media" });
									setMobileMenuOpen(false);
								}}
							>
								<HomeIcon className="mr-2 h-4 w-4" />
								Home
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									navigate({ to: "/media/add" });
									setMobileMenuOpen(false);
								}}
							>
								<PlusIcon className="mr-2 h-4 w-4" />
								Add Media
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									navigate({ to: "/profile" });
									setMobileMenuOpen(false);
								}}
							>
								<UserRoundIcon className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</nav>
	);
}
