/**
 * 분석 페이지 통계 카드.
 */
import { type ReactNode } from "react";

type StatCardProps = {
  icon?: ReactNode;
  label?: string;
  value?: string;
};

const StatCard = ({ icon, label, value }: StatCardProps) => {
  return (
    <article
      className="flex h-[184px] w-[327px] shrink-0 flex-row items-stretch rounded-[20px] border border-gray-300
       bg-gray-0 pl-[44px] pt-[42px] pb-[42px] pr-6 shadow-[4px_4px_4px_4px_rgba(0,0,0,0.12)]"
    >
      {icon != null && (
        <div className="flex shrink-0 items-center justify-center" aria-hidden>
          {icon}
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col justify-center pl-[27px]">
        {label != null && (
          <div className="text-h3 font-normal text-[#1A1A1A]">{label}</div>
        )}
        {value != null && (
          <div className="mt-1 text-h6 font-bold text-gray-900">{value}</div>
        )}
      </div>
    </article>
  );
};

export default StatCard;
