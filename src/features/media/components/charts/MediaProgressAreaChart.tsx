import { Area, AreaChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type ChartConfig, ChartContainer } from "@/components/ui/Chart";

type Data = {
	period: string;
	count: number;
};

type ProcessedData = {
	period: string;
	addedCount: number;
	completedCount: number;
};

interface MediaProgressAreaChartProps {
	addedData: Data[];
	completedData: Data[];
}

function processData(addedData: Data[], completedData: Data[]) {
	const map: { [key: string]: ProcessedData } = {};

	for (const data of addedData) {
		if (map[data.period]) {
			map[data.period].addedCount = data.count;
		} else {
			map[data.period] = {
				period: data.period,
				addedCount: data.count,
				completedCount: 0,
			};
		}
	}

	for (const data of completedData) {
		if (map[data.period]) {
			map[data.period].completedCount = data.count;
		} else {
			map[data.period] = {
				period: data.period,
				addedCount: 0,
				completedCount: data.count,
			};
		}
	}

	return Object.values(map).sort((a, b) => {
		if (a.period < b.period) return -1;
		if (a.period > b.period) return 1;
		return 0;
	});
}

export function MediaProgressAreaChart({
	addedData,
	completedData,
}: MediaProgressAreaChartProps) {
	const data = processData(addedData, completedData);

	const chartConfig = {
		added: {
			label: "Added",
			color: "#3b82f6", // blue-500
		},
		completed: {
			label: "Completed",
			color: "#10b981", // emerald-500
		},
	} satisfies ChartConfig;

	// Format period for mobile (show only month/year)
	const formattedData = data.map((item) => ({
		...item,
		period: item.period.length > 7 ? item.period.substring(2, 7) : item.period,
	}));

	// Only show every nth label if there are too many data points
	const interval =
		formattedData.length > 12 ? Math.floor(formattedData.length / 6) : 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Media Progress Over Time</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[300px] w-full">
					<AreaChart
						data={formattedData}
						margin={{
							left: 20,
							right: 30,
							top: 20,
							bottom: 20,
						}}
					>
						<CartesianGrid
							strokeDasharray="3 3"
							vertical={false}
							strokeOpacity={0.2}
						/>
						<XAxis
							dataKey="period"
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tick={{ fontSize: 12 }}
							interval={interval}
						/>
						<YAxis
							tickLine={false}
							axisLine={false}
							tickMargin={8}
							tick={{ fontSize: 12 }}
							width={30}
						/>
						<Legend />
						<Area
							type="monotone"
							dataKey="addedCount"
							stroke="var(--color-added)"
							strokeWidth={2}
							fill="var(--color-added)"
							fillOpacity={0.2}
							name="Added"
						/>
						<Area
							type="monotone"
							dataKey="completedCount"
							stroke="var(--color-completed)"
							strokeWidth={2}
							fill="var(--color-completed)"
							fillOpacity={0.2}
							name="Completed"
						/>
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
