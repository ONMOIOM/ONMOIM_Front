/**
 * 분석 페이지 좌측 사이드바 (행사 목록, API에서 제목 표시)
 */

import type { EventInfoDetailData } from "../../../api/eventInfo";

type AnalysisSidebarProps = {
  events: EventInfoDetailData[];
  selectedEventId: number | null;
  onSelectEvent: (eventId: number) => void;
};

const AnalysisSidebar = ({
  events,
  selectedEventId,
  onSelectEvent,
}: AnalysisSidebarProps) => {
  return (
    <aside
      className="h-[720px] w-[285px] shrink-0 rounded-[20px] border border-gray-300 bg-gray-0"
      aria-label="사이드바"
    >
      <p className="pt-[39px] pl-[43px] text-h6 text-gray-900">행사</p>
      <ul
        className="mt-[32px] list-none pl-[11px] pr-[12px]"
        aria-label="행사 목록"
      >
        {events.map((event) => (
          <li key={event.eventId}>
            <button
              type="button"
              onClick={() => onSelectEvent(event.eventId)}
              className={`flex h-[54px] w-full pl-5 pt-3 text-h4 ${
                selectedEventId === event.eventId
                  ? "bg-red-50 text-red-500"
                  : "bg-transparent text-gray-900 hover:bg-gray-100"
              }`}
              aria-pressed={selectedEventId === event.eventId}
              aria-label={`${event.title ?? "행사"} 선택`}
            >
              {event.title ?? "제목 없음"}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AnalysisSidebar;
