/**
 * EventCardMenu - 행사 카드 ... 클릭 시 노출되는 메뉴
 * 피그마: "알람 그만받기" 버튼 177×58, radius 20px, border 1px #595959
 * 아이콘: Soundoff.svg 25×25
 */

import { HiOutlineTrash } from "react-icons/hi";
import soundoffIcon from "../../../assets/icons/Soundoff.svg";

export interface EventCardMenuProps {
  /** 알람 그만받기 클릭 시 (메뉴 닫기 등) */
  onStopNotification?: () => void;
  /** 행사 삭제하기 클릭 시 */
  onDelete?: () => void;
}

const menuButtonClass =
  "box-border flex h-[58px] w-[177px] items-center justify-center gap-2 rounded-[20px] border border-gray-600 bg-gray-0 transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-gray-600/30 focus:ring-offset-2";

/** 디자인: 177×58, border-radius 20px, border-gray-600, bg-gray-0. 아이콘 25×25 */
const EventCardMenu = ({ onStopNotification, onDelete }: EventCardMenuProps) => {
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onStopNotification?.();
        }}
        className={menuButtonClass}
        aria-label="알람 그만받기"
      >
        <img
          src={soundoffIcon}
          alt=""
          className="h-[25px] w-[25px] shrink-0"
          width={25}
          height={25}
          aria-hidden
        />
        <span className="text-base font-normal text-gray-900">알람 그만받기</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDelete?.();
        }}
        className={menuButtonClass}
        aria-label="행사 삭제하기"
      >
        <HiOutlineTrash className="h-[25px] w-[25px] shrink-0 text-gray-900" aria-hidden />
        <span className="text-base font-normal text-gray-900">행사 삭제하기</span>
      </button>
    </div>
  );
};

export default EventCardMenu;
