/**
 * EventCard - 피그마 box1_1 프레임 기준 (456×379)
 * 상단: 이미지 영역 (Rectangle 4364) + 우측 상단 ... 메뉴 버튼 (33×33)
 * 하단: 제목·일시·Hosted by 호스트 (빨간색)
 * Border radius: 디자인 토큰 --radius-8 (8px), 카드 그림자 적용
 */

import { HiOutlineDotsHorizontal } from "react-icons/hi";

export interface EventCardProps {
  /** 행사 제목 */
  title: string;
  /** 일시 (표시용 문자열, 예: 수요일 10:45 AM) */
  dateTime: string;
  /** 호스트 이름 */
  hostName: string;
  /** 상단 이미지 URL (없으면 연한 회색 플레이스홀더) */
  imageUrl?: string;
  /** 우측 상단 ... 버튼 클릭 시 (선택) */
  onMenuClick?: () => void;
}

/** 피그마 box1_1: 456×379, 상단 이미지 약 60~65% 높이 */
const CARD_WIDTH_PX = 456;
const CARD_HEIGHT_PX = 379;
const IMAGE_HEIGHT_PX = 256;
const KEBAB_SIZE_PX = 33;
const IMAGE_PLACEHOLDER_COLOR = "#E0E0E0";

const EventCard = ({
  title,
  dateTime,
  hostName,
  imageUrl,
  onMenuClick,
}: EventCardProps) => {
  return (
    <article
      className="relative flex flex-col overflow-hidden rounded-[var(--radius-8)] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{
        width: `${CARD_WIDTH_PX}px`,
        height: `${CARD_HEIGHT_PX}px`,
      }}
    >
      {/* 상단 이미지 영역 (Rectangle 4364) */}
      <div
        className="relative shrink-0 rounded-t-[var(--radius-8)]"
        style={{
          width: `${CARD_WIDTH_PX}px`,
          height: `${IMAGE_HEIGHT_PX}px`,
          backgroundColor: IMAGE_PLACEHOLDER_COLOR,
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover rounded-t-[var(--radius-8)]"
          />
        ) : null}

        {/* 우측 상단 ... 버튼 (33×33) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMenuClick?.();
          }}
          className="absolute right-3 top-3 flex h-[33px] w-[33px] items-center justify-center rounded-[var(--radius-4)] text-gray-700 transition-colors hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-gray-400/30"
          style={{ width: KEBAB_SIZE_PX, height: KEBAB_SIZE_PX }}
          aria-label="행사 메뉴"
        >
          <HiOutlineDotsHorizontal className="text-[20px]" aria-hidden />
        </button>
      </div>

      {/* 하단 텍스트 정보 (제목·일시·Hosted by 호스트) */}
      <div
        className="flex flex-col justify-center gap-[6px] px-4 py-4"
        style={{
          minHeight: `${CARD_HEIGHT_PX - IMAGE_HEIGHT_PX}px`,
        }}
      >
        <h3 className="text-h4 font-semibold leading-snug text-gray-900 line-clamp-2">
          {title}
        </h3>
        <p className="text-h3 font-normal text-gray-600">{dateTime}</p>
        <p className="text-caption-10pt font-normal text-red-500">
          Hosted by {hostName}
        </p>
      </div>
    </article>
  );
};

export default EventCard;
