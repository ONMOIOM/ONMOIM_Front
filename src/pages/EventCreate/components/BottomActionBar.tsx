import { ActionPanelProps } from "../types/types"
import { useEventDraftStore } from "../store/useEventDraftStore";

type Action = {
  label: string;
  onClick: () => void | Promise<void>;
  disabled?: boolean;
};

type Props = {
  left: Action;   // 왼쪽 버튼 (생성: 미리보기 / 미리보기: 수정)
  right?: Action; // 오른쪽 버튼 (기본: 저장=publish). 필요 없으면 숨길 수도 있음
};

export const BottomActionBar = ({ left, right }: Props) => {
    const publish = useEventDraftStore((s) => s.publish);
    const publishStatus = useEventDraftStore((s) => s.publishStatus);
    const publishError = useEventDraftStore((s) => s.publishError);
    const initStatus = useEventDraftStore((s) => s.initStatus);
    const eventId = useEventDraftStore((s) => s.eventId);

    // ✅ 초안 준비 안 됐으면 저장(발행) 못하게
    const isReady = initStatus === "ready" && !!eventId;

    // ✅ right를 안 넘기면 "기본 저장(=publish)" 버튼으로 동작
    const rightAction: Action = right ?? {
      label: publishStatus === "saving" ? "저장 중..." : "저장",
      onClick: async () => {
        await publish();
      },
      disabled: publishStatus === "saving" || !isReady,
    };

    return (
        <div className="flex gap-[17px]">
          {/* 왼쪽 버튼 */}
          <button
            type="button"
            className="h-[82px] w-[210px] rounded-[10px] bg-[#F7F7F8] text-[24px] font-semibold text-[#525252] border border-[#BFBFBF]"
            onClick={left.onClick}
            disabled={left.disabled}
          >
            {left.label}
          </button>

          {/* 오른쪽 버튼 */}
          <button
            type="button"
            className="h-[82px] w-[210px] rounded-[10px] bg-[#F24148] text-[#FFFFFF] text-[24px] font-semibold disabled:opacity-50 border border-[#F24148]"
            onClick={rightAction.onClick}
            disabled={rightAction.disabled}
          >
            {rightAction.label}
          </button>

          {/* publish 에러 메시지 */}
          {publishStatus === "error" && publishError && (
            <div className="mt-2 text-right text-sm text-red-500">
              {publishError}
            </div>
          )}
        </div>
    )
}