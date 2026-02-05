import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "1", click: 40, participation: 60, done: 45, time: 75 },
  { name: "2", click: 40, participation: 60, done: 45, time: 55 },
  { name: "3", click: 40, participation: 60, done: 45, time: 92 },
  { name: "4", click: 40, participation: 60, done: 45, time: 85 },
  { name: "5", click: 40, participation: 60, done: 45, time: 48 },
  { name: "6", click: 40, participation: 60, done: 45, time: 65 },
  { name: "7", click: 40, participation: 60, done: 45, time: 95 },
];

const AnalysisChart = () => {
  return (
    <div className="h-[502px] w-[1386px] shrink-0 rounded-[20px] border border-gray-300 bg-gray-0 p-8 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#9CA3AF" }}
          />

          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={false}
            domain={[0, 25]}
            tickFormatter={(value) => `${value}%`}
          />

          <Tooltip cursor={{ fill: "transparent" }} />

          <Legend
            verticalAlign="top"
            align="left"
            iconType="circle"
            wrapperStyle={{ paddingBottom: "40px" }}
          />

          <Bar
            yAxisId="left"
            dataKey="click"
            name="링크 클릭수"
            fill="#BFBFBF"
            barSize={24}
            radius={[12, 12, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="participation"
            name="참여"
            fill="#7D9FFF"
            barSize={24}
            radius={[12, 12, 0, 0]}
          />
          <Bar
            yAxisId="left"
            dataKey="done"
            name="완료"
            fill="#52B788"
            barSize={24}
            radius={[12, 12, 0, 0]}
          />

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="time"
            name="평균 세션시간"
            stroke="#FF7070"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;
