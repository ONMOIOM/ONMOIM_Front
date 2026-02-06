import arrowLeftIcon from "../../../assets/icons/arrow_left.svg";
import arrowRightIcon from "../../../assets/icons/arrow_right.svg";

const BUTTON_CLASS =
  "flex h-[26px] w-[26px] shrink-0 items-center justify-center transition-opacity hover:opacity-80 hover:cursor-pointer";

const ParticipantSectionArrows = () => {
  return (
    <span className="mt-1 flex">
      <button
        type="button"
        className={`ml-5 ${BUTTON_CLASS}`}
        aria-label="이전"
      >
        <img
          src={arrowLeftIcon}
          alt=""
          width={26}
          height={26}
          className="h-[26px] w-[26px]"
        />
      </button>
      <button
        type="button"
        className={`ml-[10px] ${BUTTON_CLASS}`}
        aria-label="다음"
      >
        <img
          src={arrowRightIcon}
          alt=""
          width={26}
          height={26}
          className="h-[26px] w-[26px]"
        />
      </button>
    </span>
  );
};

export default ParticipantSectionArrows;
