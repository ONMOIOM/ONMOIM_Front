import RSVPCard from "./RSVPSelector";
import { useEventDraftStore } from "../store/useEventDraftStore";

export const RightFormPanel = () => {
  const coverImageUrl = useEventDraftStore((s) => s.data.coverImageUrl);
  const setCoverImageUrl = useEventDraftStore((s) => s.setCoverImageUrl);

  return (
    <div className="w-full">
      {/* 이미지 업로드 영역 */}
      <div className="relative w-full h-[360px] rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
        {coverImageUrl ? (
          <>
            <img
              src={coverImageUrl}
              alt="cover"
              className="absolute inset-0 w-full h-full object-cover rounded-xl"
            />
            <button
              type="button"
              onClick={() => {
                // TODO: 실제 업로드 모달
                setCoverImageUrl("");
              }}
              className="absolute top-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs text-white"
            >
              ✎ 수정
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-2xl">🖼️</span>
            <span className="text-sm">이미지를 추가하세요</span>
          </div>
        )}
      </div>

      {/* 회신 선택지 */}
      <div className="mt-6 rounded-xl bg-white p-4">
        <div className="mb-3 text-sm font-semibold text-gray-900">
          회신 선택지
        </div>
        <RSVPCard />
      </div>
    </div>
  );
};
