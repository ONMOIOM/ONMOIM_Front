import { useState } from 'react';

export type PriceModalProps = {
  open: boolean;
  onClose: () => void;
  value: number | null;
  onSave: (next: number | null) => void;
  saving?: boolean;
};

export const PriceModal = ({ open, onClose, value, onSave, saving }: PriceModalProps) => {
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
            <div className="font-semibold">$ 참여 가격</div>
            {/* X 클릭 → 닫힘 */}
            <button onClick={onClose}>✕</button>
          </div>

          {/* 참여 가격 */}
          <div className="px-6 pb-6 pt-16">
            <div className="flex justify-center">
                <div className="relative w-[420px]">
                    <input
                    value={input}
                    onChange={(e) => {
                        // 숫자만 허용
                        const onlyNum = e.target.value.replace(/[^\d]/g, "");
                        setInput(onlyNum);
                    }}
                    inputMode="numeric"
                    className="w-full h-[54px] px-5 pr-12 outline-none border border-gray-300 rounded-md"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base text-gray-900">
                        ₩
                    </span>
                </div>
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
