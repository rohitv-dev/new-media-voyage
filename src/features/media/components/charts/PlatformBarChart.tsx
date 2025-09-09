import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type ChartConfig, ChartContainer } from "@/components/ui/Chart";
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from "recharts";

type Data = {
	platform: string | null;
	count: number;
};

interface PlatformPieChartProps {
	data: Data[];
}

const PLATFORM_COLORS: { [key: string]: string } = {
	netflix: "#E50914",
	prime: "#1399FF",
	hotstar: "#01147C",
	disney: "#01147C",
	"disney+": "#01147C",
	"disney+hotstar": "#01147C",
	youtube: "#FF0000",
	steam: "#66c0f4",
	epic: "#6ca0a7",
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function PlatformBarChart({ data }: PlatformPieChartProps) {
	const chartConfig = {} satisfies ChartConfig;

	const fillColor = (data: Data, index: number, length: number) => {
		if (!data.platform) return "#0088FE";
		const name = data.platform.trim().toLowerCase();
		if (PLATFORM_COLORS[name]) return PLATFORM_COLORS[name];
		return COLORS[index % length];
	};

	// Truncate platform names for mobile
	const processedData = data.map((item) => ({
		...item,
		platform:
			item.platform && item.platform.length > 10
				? `${item.platform.substring(0, 10)}...`
				: item.platform,
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>Platform Count</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<BarChart
						data={processedData}
						margin={{
							right: 20,
							top: 20,
							bottom: 20,
						}}
					>
						<XAxis
							dataKey="platform"
							type="category"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tick={{ fontSize: 12 }}
							interval={0}
						/>
						<YAxis
							allowDecimals={false}
							type="number"
							tickLine={false}
							tickMargin={10}
							axisLine={false}
							tick={{ fontSize: 12 }}
							domain={[0, "dataMax"]}
						/>
						<Tooltip
							wrapperStyle={{ fontSize: "12px" }}
							contentStyle={{ fontSize: "12px" }}
						/>
						<Bar dataKey="count" radius={[4, 4, 0, 0]}>
							{processedData.map((entry, index) => (
								<Cell
									key={entry.platform}
									fill={fillColor(entry, index, processedData.length)}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
