import { type LocationType } from "../types/types";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  value: LocationType;
  onSave: (v: LocationType) => void;
};

export const LocationModal = ({ open, onClose, value, onSave }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay 클릭 → 닫힘 */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* modal box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="pointer-events-auto w-[720px] h-[300px] bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">📍 행사 위치</div>
            {/* X 클릭 → 닫힘 */}
            <button onClick={onClose}>✕</button>
          </div>

          {/* 도로명 */}
          <div className="mb-5">
            <div className="font-semibold mb-2">도로명</div>
            <input
            value={value.streetAddress}
            onChange={(e) => onSave({ ...value, streetAddress: e.target.value})}
            className="w-full h-10 border border-gray-300 rounded-md px-4 outline-none"
            placeholder="ex) 제주 서귀포시 왕십리로 123"
            />
          </div>

          {/* 지번 */}
          <div className="mb-6">
            <div className="font-semibold mb-2">지번</div>
            <input 
            value={value.lotNumber}
            onChange={(e) => onSave({ ...value, lotNumber: e.target.value})}
            className="w-full h-10 border border-gray-300 rounded-md px-4 outline-none"
            placeholder="ex) 제주 서귀포시.."
            />
          </div>

          {/* 저장 버튼 → 닫힘 */}
          <div className="mt-6 flex justify-center">
            <button
              className="h-10 w-[220px] border border-gray-300 rounded-md bg-gray-100"
              onClick={onClose}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
