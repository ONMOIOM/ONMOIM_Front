import { ActionPanelProps } from "../types/types"
import { useEventDraftStore } from "../store/useEventDraftStore";

export const ActionPanel = ({
    onPreview,
}: ActionPanelProps) => {
    const publish = useEventDraftStore((s) => s.publish);
    const publishStatus = useEventDraftStore((s) => s.publishStatus);
    const publishError = useEventDraftStore((s) => s.publishError);
    
    return (
       <div className="w-full bg-white">
      <div className="mx-auto max-w-[1280px] px-8 pb-10">
        <div className="mt-10 flex justify-end gap-3">
          <button
            type="button"
            className="h-10 w-[120px] rounded-md bg-gray-100 text-sm text-gray-600"
            onClick={onPreview}
          >
            미리보기
          </button>

          <button
            type="button"
            className="h-10 w-[120px] rounded-md bg-red-500 text-sm text-white disabled:opacity-50"
            onClick={async () => {
              try {
                await publish();
                // TODO: 성공 시 행사 상세 페이지로 이동
              } catch {
                // 에러는 publishError로 노출
              }
            }}
            disabled={publishStatus === "saving"}
          >
            {publishStatus === "saving" ? "저장 중..." : "저장"}
          </button>
        </div>

        {/* 원하면 에러 메시지 위치도 스샷처럼 하단 근처에 */}
        {publishStatus === "error" && publishError && (
          <div className="mt-2 text-right text-sm text-red-500">
            {publishError}
          </div>
        )}
      </div>
    </div>
    )
}