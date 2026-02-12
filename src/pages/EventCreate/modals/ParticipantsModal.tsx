import { useState, useMemo, memo } from "react";
// 에셋
import close from "../../../assets/icons/close.svg";
import participant_icon from "../../../assets/icons/participant_icon.svg";
import { convertImageUrl } from "../../../utils/imageUrlConverter";

export type Participant = {
  id: string;
  name: string;
  status: "going" | "pending" | "declined";
  profileImageUrl?: string;
};

export type ParticipantsModalProps = {
  open: boolean;
  onClose: () => void;
  participants: Participant[];
};

type TabType = "going" | "pending" | "declined";

const ParticipantsModalInner = ({
  open,
  onClose,
  participants,
}: ParticipantsModalProps) => {
  const [selectedTab, setSelectedTab] = useState<TabType>("going");

  // 탭별 개수 계산
  const counts = useMemo(() => {
    return {
      going: participants.filter((p) => p.status === "going").length,
      pending: participants.filter((p) => p.status === "pending").length,
      declined: participants.filter((p) => p.status === "declined").length,
    };
  }, [participants]);

  // 선택된 탭에 따라 필터링된 참여자 목록
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) => p.status === selectedTab);
  }, [participants, selectedTab]);

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

            {/* tabs */}
            <div className="mt-[34px] flex gap-[23px] border-b border-[#BFBFBF]">
              <button
                type="button"
                onClick={() => setSelectedTab("going")}
                className={`pb-[23px] text-[14px] font-medium transition-colors ${
                  selectedTab === "going"
                    ? "text-[#F24148] border-b-2 border-[#F24148]"
                    : "text-[#1A1A1A] hover:text-[#F24148]"
                }`}
              >
                참여 ({counts.going})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("pending")}
                className={`pb-[23px] text-[14px] font-medium transition-colors ${
                  selectedTab === "pending"
                    ? "text-[#F24148] border-b-2 border-[#F24148]"
                    : "text-[#1A1A1A] hover:text-[#F24148]"
                }`}
              >
                고민중 ({counts.pending})
              </button>
              <button
                type="button"
                onClick={() => setSelectedTab("declined")}
                className={`pb-[23px] text-[14px] font-medium transition-colors ${
                  selectedTab === "declined"
                    ? "text-[#F24148] border-b-2 border-[#F24148]"
                    : "text-[#1A1A1A] hover:text-[#F24148]"
                }`}
              >
                못가요 ({counts.declined})
              </button>
            </div>
          </div>

          {/* list - 가로 나열, 프로필 없으면 기본 아이콘 */}
          <div className="px-[28px] pt-[32px]">
            <div className="max-h-[440px] overflow-y-auto overflow-x-visible">
              {filteredParticipants.length > 0 ? (
                <ul className="flex flex-wrap gap-x-[24px] gap-y-[24px]">
                  {filteredParticipants.map((p) => (
                    <li
                      key={p.id}
                      className="flex flex-col items-center gap-[8px] shrink-0"
                    >
                      <div className="h-[52px] w-[52px] flex items-center justify-center shrink-0">
                        <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                          {p.profileImageUrl ? (
                            <img
                              src={convertImageUrl(p.profileImageUrl)}
                              alt={p.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = participant_icon;
                              }}
                            />
                          ) : (
                            <img
                              src={participant_icon}
                              alt="participant_icon"
                              className="w-[44px] h-[44px]"
                            />
                          )}
                        </div>
                      </div>
                      <span className="text-[14px] font-medium text-[#1A1A1A] text-center max-w-[80px] truncate" title={p.name || "이름 없음"}>
                        {p.name || "이름 없음"}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-sm py-8 text-center">
                  {selectedTab === "going" && "참여한 참여자가 없습니다."}
                  {selectedTab === "pending" && "고민중인 참여자가 없습니다."}
                  {selectedTab === "declined" && "못 가는 참여자가 없습니다."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ParticipantsModal = memo(ParticipantsModalInner);
