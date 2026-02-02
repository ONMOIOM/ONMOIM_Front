import { useState } from 'react';

export type CapacityModalProps = {
  open: boolean;
  onClose: () => void;
  value: number | null;
  onSave: (next: number | null) => void;
};

export const SeatsModal = ({ open, onClose, value, onSave }: CapacityModalProps) => {
    const [input, setInput] = useState("");
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
            <div className="font-semibold">🌴 남은 자리</div>
            {/* X 클릭 → 닫힘 */}
            <button onClick={onClose}>✕</button>
          </div>

          {/* 인원 수 설정 */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <div className="font-semibold">인원 수 설정</div>

            <div className="relative">
                <input
                value={input}
                onChange={(e) => {
                    // 숫자만 허용
                    const onlyNum = e.target.value.replace(/[^\d]/g, "");
                    setInput(onlyNum);
                }}
                className="w-[160px] h-10 border border-gray-300 rounded-md outline-none px-4"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">명</span>
            </div>
          </div>

          {/* 저장 버튼 → 닫힘 */}
          <div className="mt-6 flex justify-center">
            <button
              className="h-10 w-[220px] border border-gray-300 rounded-md bg-gray-100"
              onClick={() => {
                const next = input.trim() === "" ? null : Number(input);
                onSave(next);
                onClose();
              }}
            >
              저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
