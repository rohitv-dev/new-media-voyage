import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { type ChartConfig, ChartContainer } from "@/components/ui/Chart";
import { useNavigate } from "@tanstack/react-router";
import { Bar, BarChart, Cell, Tooltip, XAxis, YAxis } from "recharts";

interface MediaTypeCountProps {
	data: {
		type: string;
		count: number;
	}[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export function MediaTypeBarChart({ data }: MediaTypeCountProps) {
	const navigate = useNavigate();
	const chartConfig = {} satisfies ChartConfig;

	const fillColor = (
		data: MediaTypeCountProps["data"][0],
		index: number,
		length: number,
	) => {
		if (data.type?.trim().toLowerCase() === "movie") return "#FF0000";
		if (data.type?.trim().toLowerCase() === "show") return "#0000FF";
		if (data.type?.trim().toLowerCase() === "game") return "#32CD32";
		if (data.type?.trim().toLowerCase() === "book") return "#8B4513";
		return COLORS[index % length];
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Media Type Count</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="min-h-[200px] w-full">
					<BarChart
						data={data}
						margin={{
							right: 20,
							top: 20,
							bottom: 20,
						}}
					>
						<XAxis
							dataKey="type"
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
						<Bar
							dataKey="count"
							radius={[4, 4, 0, 0]}
							onClick={(data) => {
								const { type } = data;

								navigate({
									to: "/media",
									search: {
										type,
									},
								});
							}}
						>
							{data.map((entry, index) => (
								<Cell
									key={entry.type}
									fill={fillColor(entry, index, data.length)}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
