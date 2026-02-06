// 에셋
import close from "../../../assets/icons/close.svg";
import participant_icon from "../../../assets/icons/participant_icon.svg";

export type Participant = {
  id: string;
  name: string;
  status: "going" | "pending" | "declined";
};

export type ParticipantsModalProps = {
  open: boolean;
  onClose: () => void;
  participants: Participant[];
};

export const ParticipantsModal = ({
  open,
  onClose,
  participants,
}: ParticipantsModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="close overlay"
      />

      {/* modal */}
      <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
        <div className="pointer-events-auto w-[680px] h-[791px] rounded-[20px] bg-white">
          {/* header */}
          <div className="px-[28px] pt-[24px]">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[32px] font-bold text-[#1A1A1A]">
                  모두 보기
                </div>
                <div className="text-[20px] font-semibold text-[#1A1A1A]">
                  {participants.length}명의 참여자
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-[32px] h-[32px] flex items-center justify-center"
              >
                <img src={close} alt="close_icon" className="w-[39px] h-[39px]"/>
              </button>
            </div>

            {/* tabs (모양만) */}
            <div className="mt-[34px] flex gap-[23px] border-b border-[#BFBFBF]">
              <div className="pb-[23px] text-[14px] font-medium text-[#F24148] border-b-2 border-[#F24148]">
                참여 (12)
              </div>
              <div className="pb-[23px] text-[14px] font-medium text-[#1A1A1A]">
                고민중 (0)
              </div>
              <div className="pb-[23px] text-[14px] font-medium text-[#1A1A1A]">
                못가요 (1)
              </div>
            </div>
          </div>

          {/* list */}
          <div className="px-[28px] pt-[32px]">
            <div className="max-h-[440px] overflow-y-auto">
              <ul className="space-y-[20px]">
                {participants.map((p) => (
                  <li key={p.id} className="flex items-center gap-[12px]">
                    <img src={participant_icon} alt="participant_icon" className="w-[52px] h-[52px]"/>  

                    {/* name */}
                    <div className="text-[20px] font-semibold text-[#1A1A1A] truncate">
                      {p.name}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
