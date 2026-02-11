import { useEffect, useMemo, useState } from "react";
import { getMyHostedEvents } from "../../api/eventInfo";
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

function totalClicks(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.clickCount, 0);
}

function totalParticipants(stats: StatisticsData[]): number {
  return stats.reduce((s, d) => s + d.participantCount, 0);
}

function avgCompletion(stats: StatisticsData[]): number {
  if (stats.length === 0) return 0;
  const sum = stats.reduce((s, d) => s + d.participationRate, 0);
  const avg = sum / stats.length;
  const result = avg > 1 ? avg : avg * 100;
  return Math.min(Math.round(result * 100) / 100, 100);
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

/** stats[] → 차트 데이터. x축(name) = 날짜 형식(26/02/12). time = 평균 세션시간(초) */
function statsToChartData(stats: StatisticsData[]): ChartDataPoint[] {
  return stats.map((d) => {
    const sessionSec = d.avgSession.minutes * 60 + d.avgSession.seconds;
    return {
      name: formatDateForChart(d.date),
      click: d.clickCount,
      participation: d.participantCount,
      done: d.participationRate,
      time: sessionSec,
    };
  });
}

const Analysis = () => {
  const [events, setEvents] = useState<EventInfoDetailData[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
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
      return;
    }
    // 실제 백엔드 API에서 데이터 가져오기
    getEventAnalysis(selectedEventId)
      .then((res) => {
        if (res.success && res.data?.stats && res.data.stats.length > 0) {
          // 디버깅: participationRate 값 확인
          console.log("[Analysis] participationRate 값들:", res.data.stats.map(s => ({ date: s.date, participationRate: s.participationRate })));
          setStats(res.data.stats);
        } else {
          setStats([]);
        }
      })
      .catch((error) => {
        console.warn("[Analysis] 통계 데이터 조회 실패:", error);
        setStats([]);
      });
  }, [selectedEventId]);

  const chartData = useMemo(() => statsToChartData(stats), [stats]);
  const clickTotal = useMemo(() => totalClicks(stats), [stats]);
  const participantTotal = useMemo(() => totalParticipants(stats), [stats]);
  const completionPercent = useMemo(() => avgCompletion(stats), [stats]);
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
