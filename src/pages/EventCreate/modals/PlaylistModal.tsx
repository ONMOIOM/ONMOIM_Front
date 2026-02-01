export type PlaylistModalProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onSave: (next: string) => void;
};

export const PlaylistModal = ({ open, onClose, value, onSave }: PlaylistModalProps) => {
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
            <div className="font-semibold">♫ 플레이리스트</div>
            {/* X 클릭 → 닫힘 */}
            <button onClick={onClose}>✕</button>
          </div>

          {/* 플리 링크 */}
          <div className="px-6 pb-6 pt-16">
            <div className="mx-auto w-[560px]">
                <label className="block mb-2">Link</label>
                <input
                value={value}
                onChange={(e) => onSave(e.target.value)}
                className="w-full h-[44px] px-4 border border-gray-300 rounded-md outline-none"
                placeholder="ex) http://open.spotify.com/playlist/yourplaylist"
                />
            </div>
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
