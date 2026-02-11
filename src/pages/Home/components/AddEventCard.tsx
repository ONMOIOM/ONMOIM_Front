/**
 * + 카드 (피그마: 228×379, Rectangle 4390)
 * 카드 전체 클릭 시 이벤트 생성 페이지로 이동. 호버 시 배경/테두리 색 변경.
 */

import { useNavigate } from "react-router-dom";
import plusIcon from "../../../assets/icons/Plus.svg";
import { useEventDraftStore } from "../../EventCreate/store/useEventDraftStore";

const AddEventCard = () => {
  const navigate = useNavigate();
  const reset = useEventDraftStore((s) => s.reset);

  const handleClick = () => {
    reset();
    navigate("/event-create");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex h-[379px] w-[228px] shrink-0 cursor-pointer items-center justify-center rounded-[20px] border-2 border-dashed border-[#595959] bg-[#F7F7F7] transition-colors hover:border-red-400 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:ring-offset-2"
      aria-label="이벤트 생성하기"
    >
      <img
        src={plusIcon}
        alt=""
        className="h-[47px] w-[47px] select-none"
        width={47}
        height={47}
        draggable={false}
      />
    </button>
  );
};

export default AddEventCard;
