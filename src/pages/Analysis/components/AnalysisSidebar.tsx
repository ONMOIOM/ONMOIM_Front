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
        {events.map((event) => {
          const title = event.title ?? "제목 없음";
          
          return (
            <li key={event.eventId}>
              <button
                type="button"
                onClick={() => onSelectEvent(event.eventId)}
                className={`flex h-[54px] w-full items-center pl-5 pr-3 text-h4 text-left overflow-hidden ${
                  selectedEventId === event.eventId
                    ? "bg-red-50 text-red-500"
                    : "bg-transparent text-gray-900 hover:bg-gray-100"
                }`}
                aria-pressed={selectedEventId === event.eventId}
                aria-label={`${title} 선택`}
                title={title} // 전체 제목을 툴팁으로 표시
              >
                <span className="truncate block w-full">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default AnalysisSidebar;
