import { useEffect, useMemo, useState } from "react";
import { getEventList } from "../../api/eventInfo";
import { getEventAnalysis, type StatisticsData } from "../../api/analysis";
import { MOCK_EVENT_ANALYSIS, MOCK_EVENT_LIST } from "../../openapi/mockAnalysis";
import type { EventInfoData } from "../../api/eventInfo";
import AnalysisSidebar from "./components/AnalysisSidebar";
import StatCard from "./components/StatCard";
import cursorIcon from "../../assets/icons/Cursor_perspective_matte.svg";
import userIcon from "../../assets/icons/User_perspective_matte.svg";
import finishIcon from "../../assets/icons/Padlock_perspective_matte.svg";
import clockIcon from "../../assets/icons/Clock_perspective_matte.svg";
import AnalysisChart from "./components/AnalysisChart";
import type { ChartDataPoint } from "./components/AnalysisChart";

function totalClicks(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.clickCount, 0);
}

function totalParticipants(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.participantCount, 0);
}

function avgCompletion(stats: StatisticsData[]): number {
  if (stats.length === 0) return 0;
  const sum = stats.reduce((s, d) => s + d.participationRate, 0);
  return Math.round((sum / stats.length) * 100) / 100;
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

/** stats[] → 차트 데이터. x축(name) = 통계 순서(1번째~7번째 기간). time = 평균 세션시간(초) */
function statsToChartData(stats: StatisticsData[]): ChartDataPoint[] {
  return stats.map((d, i) => {
    const sessionSec = d.avgSession.minutes * 60 + d.avgSession.seconds;
    return {
      name: String(i + 1),
      click: d.clickCount,
      participation: d.participantCount,
      done: d.participationRate,
      time: sessionSec,
    };
  });
}

const Analysis = () => {
  const [events, setEvents] = useState<EventInfoData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [stats, setStats] = useState<StatisticsData[]>([]);

  useEffect(() => {
    getEventList()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setEvents(res.data);
          setSelectedEventId((prev) => prev ?? res.data![0].eventId);
        } else {
          setEvents(MOCK_EVENT_LIST);
          setSelectedEventId(MOCK_EVENT_LIST[0]?.eventId ?? null);
        }
      })
      .catch(() => {
        setEvents(MOCK_EVENT_LIST);
        setSelectedEventId(MOCK_EVENT_LIST[0]?.eventId ?? null);
      });
  }, []);

  useEffect(() => {
    if (selectedEventId == null) {
      setStats([]);
      return;
    }
    const mockByEvent = MOCK_EVENT_ANALYSIS.find((e) => e.eventId === selectedEventId);
    getEventAnalysis(selectedEventId)
      .then((res) => {
        if (res.success && res.data?.stats && res.data.stats.length > 0) {
          setStats(mockByEvent?.stats ?? res.data.stats);
        } else {
          setStats(mockByEvent?.stats ?? []);
        }
      })
      .catch(() => {
        setStats(mockByEvent?.stats ?? []);
      });
  }, [selectedEventId]);

  const chartData = useMemo(() => statsToChartData(stats), [stats]);
  const clickTotal = useMemo(() => totalClicks(stats), [stats]);
  const participantTotal = useMemo(() => totalParticipants(stats), [stats]);
  const completionPercent = useMemo(() => avgCompletion(stats), [stats]);
  const sessionFormatted = useMemo(() => avgSessionFormatted(stats), [stats]);

  const displayEvents = events.length > 0 ? events : MOCK_EVENT_LIST;

  const handleSelectEvent = (eventId: number) => {
    setSelectedEventId(eventId);
    const event = displayEvents.find((e) => e.eventId === eventId);
    const mockData = MOCK_EVENT_ANALYSIS.find((e) => e.eventId === eventId);
    console.log("[분석] 선택한 행사:", event?.title ?? "(제목 없음)", "| eventId:", eventId);
    console.log("[분석] 해당 행사 목데이터(stats):", mockData?.stats ?? "없음");
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
            value={stats.length ? `${completionPercent}%` : "0%"}
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
