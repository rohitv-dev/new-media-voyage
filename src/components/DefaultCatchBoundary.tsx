import {
	type ErrorComponentProps,
	Link,
	rootRouteId,
	useMatch,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "./ui/Button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/Card";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
	const router = useRouter();
	const isRoot = useMatch({
		strict: false,
		select: (state) => state.id === rootRouteId,
	});

	console.error(error);

	return (
		<Card>
			<CardHeader className="text-center">
				<CardTitle className="text-xl">
					<div className="mt-2">Error</div>
				</CardTitle>
				<CardDescription className="text-lg text-foreground">
					{error.message}
				</CardDescription>
			</CardHeader>
			<CardFooter>
				<div className="flex flex-wrap items-center gap-2 mx-auto mt-4">
					<Button
						type="button"
						onClick={() => {
							router.invalidate();
						}}
					>
						Try Again
					</Button>
					{isRoot ? (
						<Button asChild variant="secondary">
							<Link to="/">Home</Link>
						</Button>
					) : (
						<Button asChild variant="secondary">
							<Link
								to="/"
								onClick={(e) => {
									e.preventDefault();
									window.history.back();
								}}
							>
								Go Back
							</Link>
						</Button>
					)}
				</div>
			</CardFooter>
		</Card>
	);
}
