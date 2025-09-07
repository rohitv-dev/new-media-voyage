interface DataColumnProps {
	title: string;
	value?: string | number;
	icon?: React.ReactNode;
	children?: React.ReactNode;
}

export const DataColumn = ({
	title,
	value,
	icon,
	children,
}: DataColumnProps) => {
	// Determine what content to display
	const content = children !== undefined ? children : value;

	return (
		<div className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
			{icon && <div className="mt-0.5 text-primary">{icon}</div>}
			<div className="flex-1">
				<div className="text-sm font-medium text-muted-foreground">{title}</div>
				<div className="font-medium">{content}</div>
			</div>
		</div>
	);
};
