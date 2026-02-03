import { HiOutlineBookOpen } from "react-icons/hi";

/**
 * 분석하기 버튼 (Figma 스펙)
 * - 크기: 179 x 58
 * - 배경: #FFFFFF
 * - 테두리: 1px solid #F24148 (red-500)
 * - 텍스트·아이콘: #F24148
 * - 모양: pill (border-radius 29px)
 */
const AnalyzeButton = () => {
  return (
    <button
      type="button"
      className="flex h-[3.625rem] w-[11.1875rem] items-center justify-center gap-2 rounded-[1.8125rem] border border-red-500 bg-white text-red-500"
    >
      <HiOutlineBookOpen className="h-6 w-6 shrink-0" aria-hidden />
      <span className="text-base font-normal">분석하기</span>
    </button>
  );
};

export default AnalyzeButton;
