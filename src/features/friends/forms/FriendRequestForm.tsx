import { useMutation } from "@tanstack/react-query";
import { CheckIcon, LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { cn } from "@/lib/utils";
import { sendFriendReqMutOptions } from "../queries/friendQueries";

interface FriendRequestFormProps {
	onSuccess: () => void;
}

export function FriendRequestForm({ onSuccess }: FriendRequestFormProps) {
	const [text, setText] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const mutation = useMutation(
		sendFriendReqMutOptions({
			onSuccess: () => {
				setTimeout(() => onSuccess(), 2000);
			},
		}),
	);

	const handleSubmit = async () => {
		if (text === "") {
			setErrorMessage("Enter an email or username");
			return;
		}

		setLoading(true);

		try {
			await mutation.mutateAsync({
				friendData: text,
			});
		} catch (err) {
			if (err instanceof Error) {
				setErrorMessage(err.message);
			}
		}

		setLoading(false);
	};

	return (
		<div className="grid">
			<div className="grid gap-4 mt-4">
				<Label>Email/Username</Label>
				<Input
					disabled={loading}
					value={text}
					onChange={(e) => setText(e.target.value)}
					placeholder="Email/Username"
				/>
				{errorMessage && (
					<div className="text-destructive text-sm font-bold">
						{errorMessage}
					</div>
				)}
			</div>
			<Button
				className={cn(["mt-4", mutation.isSuccess && "bg-green-600"])}
				onClick={handleSubmit}
				disabled={loading}
			>
				{loading && <LoaderCircleIcon className="animate-spin" />}
				{mutation.isSuccess && <CheckIcon />}
				{mutation.isSuccess ? "Friend Request Sent" : "Send Friend Request"}
			</Button>
		</div>
	);
}
