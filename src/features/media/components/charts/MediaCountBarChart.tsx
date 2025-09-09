import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type ChartConfig, ChartContainer } from "@/components/ui/Chart";
import { useNavigate } from "@tanstack/react-router";
import { Bar, BarChart, Tooltip, XAxis, YAxis } from "recharts";

interface MediaCountBarChart {
	data: {
		total: number;
		completed: number;
		inProgress: number;
		dropped: number;
		planned: number;
	};
}

export function MediaCountBarChart({ data }: MediaCountBarChart) {
	const navigate = useNavigate();

	const chartData = [
		{
			name: "Total",
			count: data.total,
			fill: "var(--color-total)",
		},
		{
			name: "Completed",
			count: data.completed,
			fill: "var(--color-completed)",
		},
		{
			name: "In Progress",
			count: data.inProgress,
			fill: "var(--color-inProgress)",
		},
		{
			name: "Planned",
			count: data.planned,
			fill: "var(--color-planned)",
		},
		{
			name: "Dropped",
			count: data.dropped,
			fill: "var(--color-dropped)",
		},
	];

	const chartConfig = {
		total: {
			label: "Total",
			color: "#6366f1", // Indigo
		},
		completed: {
			label: "Completed",
			color: "#10b981", // Emerald
		},
		inProgress: {
			label: "In Progress",
			color: "#f59e0b", // Amber
		},
		planned: {
			label: "Planned",
			color: "#3b82f6", // Blue
		},
		dropped: {
			label: "Dropped",
			color: "#ef4444", // Red
		},
	} satisfies ChartConfig;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Media Count</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<BarChart
						data={chartData}
						layout="vertical"
						margin={{
							left: 30,
						}}
					>
						<XAxis
							type="number"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							domain={[0, "dataMax"]}
						/>
						<YAxis
							type="category"
							dataKey="name"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<Tooltip
							wrapperStyle={{ fontSize: "12px" }}
							contentStyle={{ fontSize: "12px" }}
						/>
						<Bar
							dataKey="count"
							fill="var(--color-total)"
							radius={[4, 4, 0, 0]}
							onClick={(data) => {
								const { name } = data;

								if (name === "Total")
									navigate({
										to: "/media",
									});
								else
									navigate({
										to: "/media",
										search: {
											status: name,
										},
									});
							}}
						/>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
