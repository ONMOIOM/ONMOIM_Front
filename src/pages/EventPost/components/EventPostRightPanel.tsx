import ReplyOptions from "./ReplyOptions";
import add_photo_icon from "../../../assets/icons/add_photo_icon.svg";

type Props = {
  eventId: number;
  isMyEvent: boolean;
};

export const EventPostRightPanel = ({ eventId, isMyEvent }: Props) => {
  const coverImageUrl = "";
  const hasImage =
    typeof coverImageUrl === "string" &&
    coverImageUrl.trim() !== "" &&
    coverImageUrl !== "null" &&
    coverImageUrl !== "undefined";

  return (
    <div className="w-full mt-[192px]">
      <div
        className={[
          "relative w-full h-[540px] rounded-[10px]",
          "flex items-center justify-center",
          "border-[2px] border-dashed border-[#525252] bg-[#F7F7F7]",
        ].join(" ")}
      >
        {hasImage ? (
          <img
            src={coverImageUrl}
            alt="cover"
            className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <img
              src={add_photo_icon}
              alt="add_photo_icon"
              className="w-[67.5px] h-[67.5px]"
            />
          </div>
        )}
      </div>

      {!isMyEvent && (
        <div className="mt-[39px]">
          <div className="mb-[16px] text-[24px] font-semibold text-[#1A1A1A]">
            회신 선택지
          </div>
          <ReplyOptions eventId={eventId} />
        </div>
      )}
    </div>
  );
};
