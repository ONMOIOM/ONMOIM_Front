import Calendar from "../../assets/icons/Calendar.png";

type Props = {
  onConfirm: () => void;
};

export default function CodeExpiredPage({ onConfirm }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 카드 */}
      <div className="relative bg-[#F7F7F8] w-[372px] h-[511px] rounded-[40px] flex flex-col items-center text-center">
        {/* 아이콘 */}
      <div className="mt-[95px] mb-[12px]">
        <img
          src={Calendar}
          alt="calendar_icon"
          className="w-[119px] h-[119px]"
        />
      </div>

      {/* 타이틀 */}
      <h1 className="text-[32px] font-bold text-[#1A1A1A]">오래된 코드</h1>

      {/* 설명 */}
      <p className="mt-[12px] text-[12px] font-medium text-[#595959]">
        전송해드린 인증 번호 유효시간이 만료되었습니다.
        <br />
        다시 인증을 진행해주세요!
      </p>

      {/* 버튼 */}
      <button
        type="button"
        className="
          mt-[28px]
          w-full
          h-[64px]
          rounded-[10px]
          bg-[#F24148]
          text-[#FFFFFF]
          text-[16px]
          font-medium
        "
        onClick={onConfirm}
      >
        <span className="w-[83px]">이해했습니다</span>
      </button>
      </div>
    </div>
  );
}
