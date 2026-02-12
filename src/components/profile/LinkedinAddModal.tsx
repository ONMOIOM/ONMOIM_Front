import { useState } from "react";
import linkedinIconSrc from "../../assets/icons/Linkedin.png";

type LinkedinAddModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: (linkedinId: string) => void;
  initialLinkedinId?: string | null;
};

const LinkedinAddModal = ({
  isOpen,
  onClose,
  onConfirm,
  initialLinkedinId = null,
}: LinkedinAddModalProps) => {
  if (!isOpen) {
    return null;
  }

  const initialLinkedinValue = initialLinkedinId
    ? `@ ${initialLinkedinId}`
    : "@ ";
  const [linkedinValue, setLinkedinValue] = useState(initialLinkedinValue);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-[535px] w-[521px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="링크드인 추가하기"
      >
        <p className="absolute left-[43px] top-[62px] text-h7 text-[#1A1A1A]">
          링크드인 추가하기
        </p>
        <img
          src={linkedinIconSrc}
          alt=""
          className="absolute left-1/2 top-[159px] h-[130px] w-[130px] -translate-x-1/2"
          aria-hidden="true"
        />
        <div className="absolute left-1/2 top-[304px] -translate-x-1/2">
          <div className="h-[58px] w-[321px] rounded-[10px] border border-[#BFBFBF] bg-white">
            <input
              type="text"
              value={linkedinValue}
              onChange={(event) => setLinkedinValue(event.target.value)}
              className="h-full w-full bg-transparent pl-[24px] text-h3 text-gray-400 outline-none"
              aria-label="링크드인 아이디"
            />
          </div>
        </div>
        <div className="absolute left-1/2 top-[430px] flex -translate-x-1/2 items-center gap-[15px]">
          <button
            type="button"
            className="flex h-[61px] w-[210px] items-center justify-center rounded-[10px] border border-[#BFBFBF] bg-white text-h4 text-gray-600"
            onClick={onClose}
          >
            취소
          </button>
          <button
            type="button"
            className="flex h-[61px] w-[210px] items-center justify-center rounded-[10px] bg-[#F24148] text-h5 font-semibold text-white"
            onClick={() => {
              const trimmed = linkedinValue.replace("@", "").trim();
              onConfirm?.(trimmed);
              onClose?.();
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedinAddModal;
