/**
 * 알람 모달 - NavBar 벨 버튼 클릭 시 노출
 */
import { useEffect, useState } from "react";
import AlarmEmptyState from "./AlarmEmptyState";
import AlarmCard from "./AlarmCard";

export interface AlarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 모달 상단 위치(px). 알람 버튼 아래 등 */
  top: number;
  /** 뷰포트 오른쪽으로부터 거리(px). 기본 46 */
  right?: number;
}

const MODAL_WIDTH = 516;
const HEADER_HEIGHT = 160;
/** 모달 전체 높이(px). 이 값만 바꾸면 스크롤 영역이 그만큼 늘어나고, 해당 영역에서 스크롤됨 */
const MODAL_HEIGHT = 700;
/** 스크롤 영역 높이 = 모달 높이 - 헤더 (고정 상수로 따로 두지 않음) */
const SCROLL_CONTENT_HEIGHT = MODAL_HEIGHT - HEADER_HEIGHT;

type Tab = "unread" | "read";

const AlarmModal = ({ isOpen, onClose, top, right = 46 }: AlarmModalProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("unread");
  const unreadCount = 0;
  const readItems: {
    id: string;
    title: string;
    description?: string;
    date?: string;
  }[] = [];

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" aria-hidden onClick={onClose} />
      <div
        className="fixed z-50 flex flex-col overflow-hidden rounded-[20px] bg-white shadow-lg"
        style={{
          width: MODAL_WIDTH,
          height: MODAL_HEIGHT,
          top,
          right,
        }}
        role="dialog"
        aria-label="알람"
      >
        <header
          className="flex shrink-0 flex-col border-b border-gray-200 bg-white"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex flex-1 items-center justify-between pl-[48px] pr-[48px] py-4">
            <h2 className="text-h6 font-semibold text-gray-900">알람</h2>
            <button
              type="button"
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              모두 읽음 처리
            </button>
          </div>
          <div className="flex justify-between pl-[85px] pr-[116px] pb-[20px] pt-0">
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-[24px] font-semibold leading-normal transition-colors ${
                activeTab === "unread"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab("unread")}
            >
              안 읽음 ({unreadCount})
            </button>
            <button
              type="button"
              className={`rounded-lg px-4 py-2 text-[24px] font-semibold leading-normal transition-colors ${
                activeTab === "read"
                  ? "text-red-500"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              onClick={() => setActiveTab("read")}
            >
              읽음
            </button>
          </div>
        </header>
        <div
          className="custom-scrollbar min-h-0 shrink-0 overflow-y-scroll overflow-x-hidden px-6 pb-6 pt-[30px]"
          style={{
            backgroundColor: "#EFEEEE",
            height: SCROLL_CONTENT_HEIGHT,
            maxHeight: SCROLL_CONTENT_HEIGHT,
            borderRadius: "0 0 20px 20px",
          }}
        >
          {activeTab === "unread" && (
            <>
              {unreadCount === 0 ? (
                <AlarmEmptyState />
              ) : (
                <div className="flex flex-col gap-3">
                  {/* TODO: unread list when API exists */}
                </div>
              )}
            </>
          )}
          {activeTab === "read" && (
            <>
              {readItems.length === 0 ? (
                <div className="flex flex-col items-center gap-3">
                  <AlarmCard
                    title="읽은 알람이 없습니다"
                    description="확인한 알람이 여기에 표시됩니다."
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {readItems.map((item) => (
                    <AlarmCard
                      key={item.id}
                      title={item.title}
                      description={item.description}
                      date={item.date}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AlarmModal;
