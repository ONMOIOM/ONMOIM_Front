/**
 * 알람 모달 - 읽음 탭 카드 한 개
 */
import { ALARM_READ_CARD, IsReadSvg } from "../../constants/alarmCard";

export interface AlarmCardProps {
  title: string;
  description?: string;
  date?: string;
}

const AlarmCard = ({ title, description, date }: AlarmCardProps) => {
  return (
    <div
      className="flex items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-3"
      style={{
        width: ALARM_READ_CARD.width,
        minHeight: ALARM_READ_CARD.height,
        boxShadow: ALARM_READ_CARD.boxShadow,
      }}
    >
      <div className="min-w-0 flex-1">
        <p className="text-h2 font-medium text-gray-900 truncate">{title}</p>
        {description && (
          <p className="mt-0.5 text-body2 text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
        {date && <p className="mt-1 text-caption text-gray-400">{date}</p>}
      </div>
      <div className="shrink-0">
        <IsReadSvg />
      </div>
    </div>
  );
};

export default AlarmCard;
