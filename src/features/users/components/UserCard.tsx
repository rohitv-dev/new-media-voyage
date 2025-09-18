import { UserIcon } from "lucide-react";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import { formatDate } from "@/utils/functions/dateFunctions";

interface UserCardProps {
	name: string;
	email: string;
	createdAt: Date;
}

export function UserCard({ name, email, createdAt }: UserCardProps) {
	return (
		<Card className="text-center">
			<CardHeader>
				<CardTitle>
					<div>
						<UserIcon className="mx-auto" size={40} />
						<div className="mt-2 font-bold text-xl">{name}</div>
					</div>
				</CardTitle>
				<CardDescription>
					<div>{email}</div>
					<div>Member since {formatDate(createdAt)}</div>
				</CardDescription>
			</CardHeader>
		</Card>
	);
}
