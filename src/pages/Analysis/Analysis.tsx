import { useEffect, useMemo, useState } from "react";
import { getMyHostedEvents, getEvent } from "../../api/eventInfo";
import { getEventAnalysis, type StatisticsData } from "../../api/analysis";
import type { EventInfoDetailData } from "../../api/eventInfo";
import AnalysisSidebar from "./components/AnalysisSidebar";
import StatCard from "./components/StatCard";
import cursorIcon from "../../assets/icons/Cursor_perspective_matte.svg";
import userIcon from "../../assets/icons/User_perspective_matte.svg";
import finishIcon from "../../assets/icons/Padlock_perspective_matte.svg";
import clockIcon from "../../assets/icons/Clock_perspective_matte.svg";
import AnalysisChart from "./components/AnalysisChart";
import type { ChartDataPoint } from "./components/AnalysisChart";

/** 날짜(문자열 또는 Date) → YYYY-MM-DD (통계 매칭용) */
function toDateKey(dateStrOrDate: string | Date): string {
  const d =
    typeof dateStrOrDate === "string" ? new Date(dateStrOrDate) : dateStrOrDate;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function totalClicks(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.clickCount, 0);
}

function totalParticipants(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.participantCount, 0);
}

function avgSessionFormatted(stats: StatisticsData[]): string {
  if (stats.length === 0) return "0:00";
  let totalSec = 0;
  for (const d of stats) {
    totalSec += d.avgSession.minutes * 60 + d.avgSession.seconds;
  }
  const avgSec = Math.round(totalSec / stats.length);
  const m = Math.floor(avgSec / 60);
  const s = avgSec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** 날짜 문자열을 "26/02/12" 형식으로 변환 */
function formatDateForChart(dateString: string): string {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(-2); // 마지막 2자리만
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  } catch {
    return dateString; // 파싱 실패 시 원본 반환
  }
}

/** 행사 생성일(createdAt) 기준 7일차트 데이터. 각 날짜에 stats 매칭(없으면 0) */
function buildSevenDayChartData(
  createdAt: string | null,
  stats: StatisticsData[],
): ChartDataPoint[] {
  const startDate = createdAt ? new Date(createdAt) : new Date();
  const start = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    startDate.getDate(),
    0,
    0,
    0,
    0,
  );
  const statsByDate = new Map<string, StatisticsData>();
  for (const s of stats) {
    statsByDate.set(toDateKey(s.date), s);
  }
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = toDateKey(d);
    const stat = statsByDate.get(key);
    const sessionSec = stat
      ? stat.avgSession.minutes * 60 + stat.avgSession.seconds
      : 0;
    return {
      name: formatDateForChart(d.toISOString()),
      click: stat?.clickCount ?? 0,
      participation: stat?.participantCount ?? 0,
      done: 0, // 그래프에는 완료를 0으로만 표시 (상단 지표만 사용)
      time: sessionSec,
    };
  });
}

const Analysis = () => {
  const [events, setEvents] = useState<EventInfoDetailData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [selectedEventCreatedAt, setSelectedEventCreatedAt] = useState<
    string | null
  >(null);
  const [stats, setStats] = useState<StatisticsData[]>([]);

  useEffect(() => {
    getMyHostedEvents()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
          setSelectedEventId((prev) => prev ?? res.data![0].eventId);
        } else {
          setEvents([]);
          setSelectedEventId(null);
        }
      })
      .catch(() => {
        setEvents([]);
        setSelectedEventId(null);
      });
  }, []);

  useEffect(() => {
    if (selectedEventId == null) {
      setStats([]);
      setSelectedEventCreatedAt(null);
      return;
    }
    setSelectedEventCreatedAt(null);
    getEvent(selectedEventId).then((res) => {
      if (res.success && res.data?.createdAt) {
        setSelectedEventCreatedAt(res.data.createdAt);
      }
    });
    getEventAnalysis(selectedEventId)
      .then((res) => {
        if (res.success && res.data?.stats) {
          setStats(res.data.stats);
        } else {
          setStats([]);
        }
      })
      .catch(() => {
        setStats([]);
      });
  }, [selectedEventId]);

  const chartData = useMemo(
    () => buildSevenDayChartData(selectedEventCreatedAt, stats),
    [selectedEventCreatedAt, stats],
  );
  const clickTotal = useMemo(() => totalClicks(stats), [stats]);
  const participantTotal = useMemo(() => totalParticipants(stats), [stats]);
  const sessionFormatted = useMemo(() => avgSessionFormatted(stats), [stats]);

  const displayEvents = events;

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    const event = displayEvents.find((e) => e.eventId === eventId);
    console.log("[분석] 선택한 행사:", event?.title ?? "(제목 없음)", "| eventId:", eventId);
  };

  return (
    <div className="flex gap-6 pl-[107px] pt-[154px]">
      <AnalysisSidebar
        events={displayEvents}
        selectedEventId={selectedEventId}
        onSelectEvent={handleSelectEvent}
      />
      <div className="flex flex-col">
        <div className="flex gap-[26px]">
          <StatCard
            icon={<img src={cursorIcon} alt="" className="h-[100px] w-[90px]" />}
            label="링크 클릭수"
            value={String(clickTotal)}
          />
          <StatCard
            icon={<img src={userIcon} alt="" className="h-[100px] w-[90px]" />}
            label="참여"
            value={String(participantTotal)}
          />
          <StatCard
            icon={<img src={finishIcon} alt="" className="h-[100px] w-[90px]" />}
            label="완료"
            value="0%"
          />
          <StatCard
            icon={<img src={clockIcon} alt="" className="h-[100px] w-[90px]" />}
            label="평균 세션시간"
            value={sessionFormatted}
          />
        </div>
        <div className="mt-[34px] mb-[70px]">
          <AnalysisChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
