/**
 * 분석 페이지 좌측 사이드바
 */

import { useState } from "react";

/** 행사 리스트 (목데이터임 API 연동 필요) */
const MOCK_EVENT_NAMES = [
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
  "제주도 감귤 줍기",
];

const AnalysisSidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

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
        {MOCK_EVENT_NAMES.map((name, index) => (
          <li key={index}>
            <button
              type="button"
              onClick={() => setSelectedIndex(index)}
              className={`flex h-[54px] w-full pl-5 pt-3 text-h4 ${
                selectedIndex === index
                  ? "bg-red-50 text-red-500"
                  : "bg-transparent text-gray-900 hover:bg-gray-100"
              }`}
              aria-pressed={selectedIndex === index}
              aria-label={`${name} 선택`}
            >
              {name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default AnalysisSidebar;
