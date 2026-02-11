import { useState } from "react";
import { deleteComment } from "../../../api/comment";
import type { CommentItem } from "../../../api/comment";
import { convertImageUrl } from "../../../utils/imageUrlConverter";
import participant_icon from "../../../assets/icons/participant_icon.svg";
import close from "../../../assets/icons/close.svg";

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

type Props = {
  comment: CommentItem;
  isOwnComment: boolean;
  onDeleted: (commentId: number) => void;
};

export function CommentRow({ comment, isOwnComment, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting || !isOwnComment) return;
    if (!window.confirm("이 댓글을 삭제할까요?")) return;
    setDeleting(true);
    try {
      const res = await deleteComment(comment.commentId);
      if (res.success) {
        onDeleted(comment.commentId);
      } else {
        alert(res.message ?? "댓글 삭제에 실패했습니다.");
      }
    } catch (e) {
      console.warn("[CommentRow] 댓글 삭제 실패:", e);
      alert("댓글 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-[145px] w-[644px] border-b border-[#BFBFBF]">
      <div className="pl-[44px] pt-[32px] pr-[44px]">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center min-w-0">
            <div className="h-[52px] w-[52px] flex items-center justify-center shrink-0">
              <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                {comment.profileImageUrl && comment.profileImageUrl.trim() ? (
                  <img
                    src={convertImageUrl(comment.profileImageUrl)}
                    alt={comment.nickname}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = participant_icon;
                    }}
                  />
                ) : (
                  <img
                    src={participant_icon}
                    alt="participant_icon"
                    className="w-[44px] h-[44px]"
                  />
                )}
              </div>
            </div>
            <div className="ml-[8px] min-w-0">
              <div className="text-h4 font-semibold text-[#1A1A1A]">
                {comment.nickname}
              </div>
              <div className="text-[10px] font-medium text-[#1A1A1A]">
                {formatDate(comment.createdAt)}
              </div>
            </div>
          </div>
          {isOwnComment && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="h-[32px] w-[32px] flex items-center justify-center shrink-0 rounded-[8px] hover:bg-[#F5F5F5] text-[#919191] hover:text-[#F24148] disabled:opacity-50"
              aria-label="댓글 삭제"
            >
              <img src={close} alt="" className="w-[18px] h-[18px]" />
            </button>
          )}
        </div>

        <div className="mt-[10px] text-h3 text-[#1A1A1A] whitespace-pre-line">
          {comment.content}
        </div>
      </div>
    </div>
  );
}
