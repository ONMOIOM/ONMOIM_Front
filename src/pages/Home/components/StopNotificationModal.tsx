/**
 * 알람 그만받기 확인 모달
 * EventCard 메뉴에서 "알람 그만받기" 클릭 시 노출
 */
import { useEffect } from "react";
import bellImage from "../../../assets/images/Bell_perspective_matte.png";

export interface StopNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StopNotificationModal = ({
  isOpen,
  onClose,
}: StopNotificationModalProps) => {
  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-label="알람 그만받기"
    >
      <div
        className="fixed inset-0 bg-black/40"
        aria-hidden
        onClick={onClose}
      />
      <div className="relative flex w-[433px] h-[540px] flex-col items-center rounded-[40px] bg-white pt-[77px]">
        <div className="flex flex-1 flex-col items-center gap-0">
          <img
            src={bellImage}
            alt=""
            className="h-[120px] w-[120px] shrink-0 rounded-full object-cover"
            aria-hidden
          />
          <p className="mt-[7px] text-h6 text-gray-900">알람 그만받기</p>
          <div className="mx-10 mt-4 text-center">
            <p className="text-h1 font-medium text-gray-600">
              댓글, 사진 업로드 등 이벤트 활동에 대한 알람을 받지 않습니다.
              <br />
              다만, 주최측으로부터 연락은 계속 알려드릴 예정입니다.
            </p>
          </div>
        </div>
        <div className="mt-auto flex shrink-0 flex-col gap-5 mx-[30px] pb-[51px]">
          <button
            type="button"
            className="flex h-[64px] w-[372px] shrink-0 items-center justify-center gap-2.5 rounded-[12px] bg-red-500 px-[165px] py-[17px] text-h2 font-medium leading-normal text-white whitespace-nowrap transition-colors hover:bg-red-600"
            onClick={onClose}
          >
            알람 그만받기
          </button>
          <button
            type="button"
            className="flex h-[64px] w-[372px] shrink-0 items-center justify-center rounded-[12px] border border-gray-300 bg-white px-[165px] py-[17px] text-h2 font-medium leading-normal text-gray-300 whitespace-nowrap transition-colors hover:border-gray-400 hover:bg-gray-50 hover:text-gray-400"
            onClick={onClose}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopNotificationModal;
