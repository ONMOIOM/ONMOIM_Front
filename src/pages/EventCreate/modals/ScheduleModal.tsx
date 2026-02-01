export type ModalProps = {
  open: boolean;
  onClose: () => void;
};

export const ScheduleModal = ({ open, onClose }: ModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay 클릭 → 닫힘 */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* modal box */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[720px] h-[300px] bg-white rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <div className="font-semibold">행사 위치</div>
            {/* X 클릭 → 닫힘 */}
            <button onClick={onClose}>✕</button>
          </div>

          {/* 내용은 나중에 */}
          <div className="text-sm text-gray-500">
            Location modal content
          </div>

          {/* 저장 버튼 → 닫힘 */}
          <div className="mt-6 flex justify-center">
            <button
              className="px-6 py-2 border rounded"
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
