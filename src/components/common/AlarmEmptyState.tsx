/**
 * 알람 모달 - 빈 상태 (안 읽음 탭 등)
 */
import { ALARM_EMPTY_STATE } from "../../constants/alarmCard";
import errorIcon from "../../assets/icons/Error_perspective_matte.svg";

const AlarmEmptyState = () => {
  const { iconTopY, iconSize } = ALARM_EMPTY_STATE;
  return (
    <div
      className="flex flex-col items-center w-full"
      style={{ paddingTop: iconTopY }}
    >
      <img
        src={errorIcon}
        alt=""
        aria-hidden
        width={iconSize}
        height={iconSize}
        className="shrink-0"
      />
      <p className="mt-[32px] w-full min-w-0 max-w-[380px] px-4 text-center text-[20px] font-semibold leading-normal text-gray-900">
        아직 도착한 연락이 없습니다.
        <br />
        행사에 참여한 후 다시 확인해보세요
      </p>
    </div>
  );
};

export default AlarmEmptyState;
