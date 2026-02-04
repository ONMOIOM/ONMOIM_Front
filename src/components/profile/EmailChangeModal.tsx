import closeIconSrc from "../../assets/icons/close.png";
import shieldIconSrc from "../../assets/icons/Shield_perspective_matte.png";

type EmailChangeModalProps = {
  isOpen: boolean;
  email: string;
  onClose?: () => void;
};

const EmailChangeModal = ({ isOpen, email, onClose }: EmailChangeModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />
      <div
        className="absolute left-1/2 top-1/2 h-[535px] w-[521px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-white"
        role="dialog"
        aria-modal="true"
        aria-label="이메일 변경"
      >
        <p className="absolute left-[43px] top-[62px] text-h7 text-[#1A1A1A]">
          이메일 변경
        </p>
        <img
          src={shieldIconSrc}
          alt=""
          className="absolute left-1/2 top-[149px] h-[119px] w-[119px] -translate-x-1/2"
          aria-hidden="true"
        />
        <p className="absolute left-1/2 top-[280px] -translate-x-1/2 text-h6 text-[#1A1A1A]">
          {email}
        </p>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute right-[43px] top-[62px] h-[39px] w-[39px]"
            aria-label="닫기"
          >
            <img src={closeIconSrc} alt="" className="h-full w-full" />
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailChangeModal;
