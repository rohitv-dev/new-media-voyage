import { useNavigate } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/Button";

export function Navbar() {
	const navigate = useNavigate();

	return (
		<nav className="w-full px-4 py-2 border-b shadow-sm">
			<div className="container mx-auto flex items-center justify-between">
				<span className="text-xl font-bold">Media Voyage</span>

				<div className="flex items-center space-x-2">
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
				</div>
			</div>
		</nav>
	);
}
