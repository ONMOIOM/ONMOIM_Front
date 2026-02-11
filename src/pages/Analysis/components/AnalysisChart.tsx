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

/** 범례 아이콘 색 (디자인 토큰), 순서: 링크 클릭수, 참여, 완료, 평균 세션시간 */
const LEGEND_COLORS = [
  "var(--color-gray-300)",
  "var(--color-link-guide)",
  "var(--color-link-correct)",
  "var(--color-red-500)",
] as const;

/** 막대 차트 시리즈 설정 (유지보수·가독성용) */
const BAR_SERIES_CONFIG = [
  {
    dataKey: "click",
    name: "링크 클릭수",
    fill: "var(--color-gray-300)",
    yAxisId: "left",
  },
  {
    dataKey: "participation",
    name: "참여",
    fill: "var(--color-link-guide)",
    yAxisId: "left",
  },
  {
    dataKey: "done",
    name: "완료",
    fill: "var(--color-link-correct)",
    yAxisId: "left",
  },
  {
    dataKey: "time",
    name: "평균 세션시간",
    fill: "var(--color-red-500)",
    yAxisId: "left",
  },
] as const;

const CHART_MARGIN = { top: 20, right: 30, left: 20, bottom: 20 };
const BAR_SIZE = 24;
const BAR_RADIUS: [number, number, number, number] = [12, 12, 0, 0];

/** 툴팁: 같은 이름(평균 세션시간 막대+선)이 두 번 뜨지 않도록 이름 기준으로 한 번만 표시 */
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const seen = new Set<string>();
  const unique = payload.filter((entry) => {
    if (seen.has(entry.name)) return false;
    seen.add(entry.name);
    return true;
  });
  const formatValue = (name: string, value: number) => {
    if (name === "평균 세션시간") {
      const m = Math.floor(value / 60);
      const s = Math.floor(value % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    }
    return String(value);
  };

  return (
    <div className="rounded border border-gray-300 bg-white px-3 py-2 shadow-sm">
      <p className="mb-2 font-medium text-gray-900">{label}</p>
      {unique.map((entry, i) => (
        <p
          key={i}
          className="text-sm text-gray-600"
          style={{ color: entry.color }}
        >
          {entry.name} : {formatValue(entry.name, entry.value)}
        </p>
      ))}
    </div>
  );
}

/** 커스텀 범례: 8.511px 둥근 모서리 + 디자인 토큰 색 (Recharts 기본은 path라 rx 적용 불가) */
function CustomLegendContent({
  payload,
}: {
  payload?: Array<{ value?: string; color?: string }>;
}) {
  if (!payload?.length) return null;
  /* 범례 4개만 표시 (평균 세션시간은 막대+선 둘 다 있으므로 payload는 5개 → 앞 4개만) */
  const displayPayload = payload.slice(0, 4);
  return (
    <div className="flex flex-wrap items-center gap-6 pl-[88px] pb-10">
      {displayPayload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className="h-[22.979px] w-10 shrink-0"
            style={{
              borderRadius: 8.511,
              backgroundColor: LEGEND_COLORS[i] ?? entry.color,
            }}
          />
          <span className="text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

/** API 통계(stats)를 차트 포맷으로 변환한 한 점 (Analysis 페이지에서 사용) */
export type ChartDataPoint = {
  name: string;
  click: number;
  participation: number;
  done: number;
  time: number;
};

/** time = 평균 세션시간(초). 예: 90 → 1:30 */
const DEFAULT_CHART_DATA: ChartDataPoint[] = [
  { name: "1", click: 40, participation: 60, done: 45, time: 90 },
  { name: "2", click: 40, participation: 60, done: 45, time: 60 },
  { name: "3", click: 40, participation: 60, done: 45, time: 120 },
  { name: "4", click: 40, participation: 60, done: 45, time: 100 },
  { name: "5", click: 40, participation: 60, done: 45, time: 45 },
  { name: "6", click: 40, participation: 60, done: 45, time: 75 },
  { name: "7", click: 40, participation: 60, done: 45, time: 110 },
];

type AnalysisChartProps = {
  data?: ChartDataPoint[];
};

const AnalysisChart = ({ data = DEFAULT_CHART_DATA }: AnalysisChartProps) => {
  // 데이터가 비어있을 때 기본 축 구조를 보여주기 위한 더미 데이터
  const displayData =
    data.length > 0
      ? data
      : Array.from({ length: 7 }, (_, i) => ({
          name: String(i + 1),
          click: 0,
          participation: 0,
          done: 0,
          time: 0,
        }));

  return (
    <div className="analysis-chart h-[502px] w-[1386px] min-h-[400px] min-w-[600px] shrink-0 rounded-[20px] border border-gray-300 bg-gray-0 p-8 shadow-sm">
      <ResponsiveContainer
        width="100%"
        height="100%"
        minWidth={600}
        minHeight={400}
      >
        <ComposedChart data={displayData} margin={CHART_MARGIN}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={true}
            tick={{ fill: "#9CA3AF" }}
          />

          <YAxis
            yAxisId="left"
            tickLine={false}
            axisLine={true}
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickLine={false}
            axisLine={true}
            domain={[0, 100]}
            tick={{ fill: "#9CA3AF" }}
            tickFormatter={(v) => {
              const sec = Number(v);
              const m = Math.floor(sec / 60);
              const s = Math.floor(sec % 60);
              return `${m}:${s.toString().padStart(2, "0")}`;
            }}
          />

          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "transparent" }}
          />
          <Legend
            verticalAlign="top"
            align="left"
            content={<CustomLegendContent />}
          />

          {BAR_SERIES_CONFIG.map((config) => (
            <Bar
              key={config.dataKey}
              yAxisId={config.yAxisId}
              dataKey={config.dataKey}
              name={config.name}
              fill={config.fill}
              barSize={BAR_SIZE}
              radius={BAR_RADIUS}
            />
          ))}

          <Line
            yAxisId="right"
            type="monotone"
            dataKey="time"
            name="평균 세션시간"
            stroke="var(--color-red-500)"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AnalysisChart;
