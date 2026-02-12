import type { FC } from "react";

/**
 * 알람 모달 - 안 읽음 탭 빈 상태 (X 이미지) Y축·크기·여백
 */
export const ALARM_EMPTY_STATE = {
  iconTopY: 125,
  iconSize: 180,
  iconMarginX: 162,
} as const;

/**
 * 알람 모달 - 읽음 탭 카드 스타일 상수
 */
export const ALARM_READ_CARD = {
  width: 436,
  height: 101,
  borderRadius: 20,
  background: "#FFF",
  boxShadow: "4px 4px 15px 3px rgba(0, 0, 0, 0.10)",
} as const;

/**
 * 읽음 상태 표시 아이콘 (isRead) SVG
 */
export const IsReadSvg: FC = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 15 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <circle cx="7.5" cy="7.5" r="7" fill="white" stroke="#F24148" />
  </svg>
);
