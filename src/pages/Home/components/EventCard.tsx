/**
 * EventCard - 피그마 box1_1 프레임 기준 (456×379)
 * 상단: 이미지 영역 (Rectangle 4364) + 우측 상단 ... 메뉴 버튼 (33×33)
 * ... 클릭 시 EventCardMenu(알람 그만받기)가 ... 버튼 바로 아래 노출.
 * 피그마: 카드 오른쪽 끝에서 ... 와 알람 그만받기 버튼까지 간격 동일(24px).
 */

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import EventCardMenu from "./EventCardMenu";
import StopNotificationModal from "./StopNotificationModal";
import { startSession } from "../../../api/analysis";

export interface EventCardProps {
  /** 행사 ID (삭제 시 사용) */
  eventId: number;
  /** 행사 제목 */
  title: string;
  /** 일시 (표시용 문자열, 예: 수요일 10:45 AM) */
  dateTime: string;
  /** 호스트 이름 */
  hostName: string;
  /** 상단 이미지 URL (없으면 연한 회색 플레이스홀더) */
  imageUrl?: string;
  /** 우측 상단 ... 버튼 클릭 시 (선택, 메뉴 토글과 별개) */
  onMenuClick?: () => void;
  /** 행사 삭제 클릭 시 (eventId 전달) */
  onDelete?: (eventId: number) => void;
  /** 본인이 만든 행사인지 여부 */
  isMyEvent?: boolean;
}

/** 피그마 box1_1: 456×379, 상단 이미지 약 60~65% 높이 */
const EventCard = ({
  eventId,
  title,
  dateTime,
  hostName,
  imageUrl,
  onMenuClick: _onMenuClick,
  onDelete,
  isMyEvent = true, // 기본값 true: API 호출 실패 시에도 삭제 가능하도록
}: EventCardProps) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const handleCardClick = async () => {
    // 메인 페이지에서 행사 클릭 시 클릭 수 증가 및 세션 시작
    try {
      const result = await startSession(eventId);
      if (result.success && result.data?.sessionId) {
        // 세션 ID를 localStorage에 저장하여 EventPost에서 사용
        localStorage.setItem(`session_${eventId}`, result.data.sessionId);
        console.log("[Analytics] 행사 클릭 - 세션 시작:", result.data.sessionId);
      }
    } catch (error) {
      console.error("[Analytics] 행사 클릭 - 세션 시작 실패:", error);
      // 에러가 발생해도 페이지 이동은 진행
    }
    navigate(`/event-post/${eventId}`);
  };

  return (
    <article
      ref={cardRef}
      onClick={handleCardClick}
      className="relative flex h-[379px] w-[456px] shrink-0 flex-col overflow-visible rounded-8 bg-gray-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] cursor-pointer hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-shadow"
    >
      {/* 상단 이미지 영역 (Rectangle 4364) - 메뉴가 나오므로 overflow-visible */}
      <div className="relative h-[256px] w-[456px] shrink-0 overflow-visible rounded-t-8 bg-[#E0E0E0]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover rounded-t-8"
          />
        ) : null}

        {/* 우측 상단 ... 버튼 (33×33). 피그마: 카드 오른쪽 끝에서 24px */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((prev) => !prev);
          }}
          className="absolute right-[24px] top-3 flex h-[33px] w-[33px] items-center justify-center rounded-4 text-gray-700 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
          aria-label="행사 메뉴"
          aria-expanded={menuOpen}
        >
          <HiOutlineDotsHorizontal className="text-[20px]" aria-hidden />
        </button>

        {/* 알람 그만받기 메뉴: ... 버튼 바로 아래, 카드 오른쪽 끝에서 동일 24px */}
        {menuOpen && (
          <div className="absolute right-[24px] top-[45px] z-10">
            <EventCardMenu
              onStopNotification={() => {
                setMenuOpen(false);
                setModalOpen(true);
              }}
              onDelete={() => {
                setMenuOpen(false);
                if (window.confirm("이 행사를 삭제하시겠습니까?")) {
                  onDelete?.(eventId);
                }
              }}
              isMyEvent={isMyEvent}
            />
          </div>
        )}
      </div>

      {/* 하단 텍스트 정보 (제목·일시·Hosted by 호스트). 카드 379px 고정이므로 제목은 20px로 넣어 2줄+일시+호스트가 다 보이게 */}
      <div className="flex min-h-[123px] flex-col justify-start gap-[6px] px-4 py-4">
        <h3 className="text-[20px] font-bold leading-normal text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-[20px] font-semibold leading-normal text-gray-600">
          {dateTime}
        </p>
        <p className="text-h2 font-medium leading-normal">
          <span className="text-red-500">Hosted by </span>
          <span className="text-[#525252]">{hostName}</span>
        </p>
      </div>

      <StopNotificationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </article>
  );
};

export default EventCard;
