import { useEffect, useState } from "react";
import { type LocationType } from "../types/types";
// 에셋
import location_icon from '../../../assets/icons/location_icon.svg';
import close from '../../../assets/icons/close.svg';

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  value: LocationType;
  onSave: (v: LocationType) => void;
  saving?: boolean;
};

export const LocationModal = ({
  open,
  onClose,
  value,
  onSave,
  saving = false,
}: ModalProps) => {
  const [draft, setDraft] = useState<LocationType>(value);

  // 모달 열릴 때 value → draft 복사
  useEffect(() => {
    if (!open) return;
    setDraft(value);
  }, [open, value]);

  if (!open) return null;

  const handleConfirm = () => {
    if (saving) return;
    onSave(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* center */}
      <div className="absolute inset-0 flex mt-[273px] ml-[265px] h-[570px] pointer-events-none">
        <div className="pointer-events-auto w-[520px] rounded-[20px] bg-[#FFFFFF]">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-[41px] pt-[62px] pl-[46px]">
            <div className="flex items-center gap-[11px]">
              <img src={location_icon} alt='location_icon' className="h-[31px] w-[31px]"/>
              <span className="text-base font-bold text-[32px] text-[#1A1A1A]">행사 위치</span>
            </div>

            <button
              onClick={onClose}
              className="pr-[43px] text-[#1A1A1A] hover:text-[#1A1A1A]"
            >
              <img src={close} alt='close_icon' className='w-[39px] h-[39px]'/>
            </button>
          </div>

          {/* 도로명 */}
          <div className="pl-[46px] pr-[43px] mb-[20px]">
            <div className="font-semibold text-[24px] mb-[20px]">도로명</div>
            <input
              value={draft.streetAddress}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  streetAddress: e.target.value,
                }))
              }
              className="w-[435px] h-[58px] border border-[#BFBFBF] rounded-[20px] bg-[#FFFFFF] px-[24px] text-[20px] font-semibold text-[#595959] outline-none"
              placeholder="ex) 제주 서귀포시 왕십리로 123"
            />
          </div>

          {/* 지번 */}
          <div className="pl-[46px] pr-[43px]">
            <div className="font-semibold text-[24px] mb-[20px]">지번</div>
            <input
              value={draft.lotNumber ?? ""}
              onChange={(e) =>
                setDraft((prev) => ({
                  ...prev,
                  lotNumber: e.target.value === "" ? null : e.target.value,
                }))
              }
              className="w-[435px] h-[58px] border border-gray-300 border-[#BFBFBF] rounded-[20px] bg-[#FFFFFF] px-[24px] text-[16px] font-medium text-[#595959] outline-none"
              placeholder="ex) 제주 서귀포시..."
            />
          </div>

          {/* 확인 버튼 */}
          <div className="flex justify-center mt-[47px] mb-[44px]">
            <button
              onClick={handleConfirm}
              disabled={saving}
              className={[
                "h-[71px] w-[435px] rounded-[10px]",
                "bg-[#F7F7F8] text-[20px] font-semibold text-[#595959]"
              ].join(" ")}
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
