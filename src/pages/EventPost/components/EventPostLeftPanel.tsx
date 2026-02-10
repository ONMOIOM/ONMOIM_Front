import { useState, useEffect } from "react";
import { getEvent, getEventParticipation } from "../../../api/eventInfo";
import { getCommentList, createComment, type CommentItem } from "../../../api/comment";
import location_icon from "../../../assets/icons/location_icon.svg";
import price_icon from "../../../assets/icons/price_icon.svg";
import participant_icon from "../../../assets/icons/participant_icon.svg";
import playlist_icon from "../../../assets/icons/Music.svg";
import add_icon from "../../../assets/icons/add.svg";

type Props = {
  eventId: number;
};

const formatDateTime = (startTime: string | null, endTime: string | null): string => {
  if (!startTime || !endTime) return "일시 미정";
  
  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = d.getHours();
    const min = String(d.getMinutes()).padStart(2, "0");
    const ampm = h < 12 ? "오전" : "오후";
    const hh12 = h % 12 === 0 ? 12 : h % 12;
    return `${y}.${m}.${day} ${ampm} ${String(hh12).padStart(2, "0")}:${min}`;
  };

  return `${formatDate(startTime)} ~ ${formatDate(endTime)}`;
};

const formatDate = (iso: string): string => {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
};

export const EventPostLeftPanel = ({ eventId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [participants, setParticipants] = useState<any[]>([]);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [commentContent, setCommentContent] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [showAllParticipants, setShowAllParticipants] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // 행사 상세 정보
        const eventRes = await getEvent(eventId);
        if (!eventRes.success || !eventRes.data) {
          throw new Error(eventRes.message ?? "행사 정보를 불러올 수 없습니다.");
        }
        setEventData(eventRes.data);

        // 참여자 목록
        try {
          const participantsRes = await getEventParticipation(eventId);
          if (participantsRes.success && participantsRes.data) {
            setParticipants(participantsRes.data);
          }
        } catch (e) {
          console.warn("[EventPost] 참여자 목록 조회 실패:", e);
        }

        // 댓글 목록
        try {
          const commentsRes = await getCommentList(eventId);
          if (commentsRes.success && commentsRes.data) {
            setComments(commentsRes.data.commentList || []);
          }
        } catch (e) {
          console.warn("[EventPost] 댓글 목록 조회 실패:", e);
        }
      } catch (e: any) {
        setError(e?.message ?? "데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleSubmitComment = async () => {
    if (!commentContent.trim() || submittingComment) return;

    setSubmittingComment(true);
    try {
      const res = await createComment(eventId, { content: commentContent.trim() });
      if (res.success && res.data) {
        setComments((prev) => [res.data!, ...prev]);
        setCommentContent("");
      }
    } catch (e) {
      console.warn("[EventPost] 댓글 작성 실패:", e);
      alert("댓글 작성에 실패했습니다.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full mt-[192px] pl-[161px] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#F24148]" />
      </div>
    );
  }

  if (error || !eventData) {
    return (
      <div className="w-full mt-[192px] pl-[161px]">
        <p className="text-red-600">{error ?? "행사 정보를 불러올 수 없습니다."}</p>
      </div>
    );
  }

  const currentParticipants = participants.length;
  const totalCapacity = eventData.capacity ?? 0;
  const remainingSpots = totalCapacity - currentParticipants;
  const locationText = eventData.streetAddress
    ? eventData.lotNumberAddress
      ? `${eventData.streetAddress} ${eventData.lotNumberAddress}`
      : eventData.streetAddress
    : "장소 미정";
  const priceText = eventData.price != null ? `${eventData.price.toLocaleString()} ₩` : "가격 미정";
  const capacityText =
    totalCapacity > 0
      ? `${currentParticipants}/${totalCapacity}, 현재 ${remainingSpots}자리가 남았습니다.`
      : "인원 미정";
  const visibleParticipants = showAllParticipants
    ? participants.slice(0, 18)
    : participants.slice(0, 4);

  return (
    <div className="w-full mt-[192px] pl-[161px]">
      <h1 className="text-[32px] font-medium text-[#1A1A1A] font-esamanru">
        {eventData.title || "제목 없음"}
      </h1>
      <div className="mt-[10px] text-h5 text-[#1A1A1A]">
        {formatDateTime(eventData.startTime, eventData.endTime)}
      </div>

      <div className="mt-[52px] space-y-[17px] text-[14px] font-medium text-[#1A1A1A]">
        <div className="flex items-start gap-[8px]">
          <img src={location_icon} alt="location" className="w-[24px] h-[24px]" />
          <span>{locationText}</span>
        </div>
        <div className="flex items-start gap-[8px]">
          <img src={price_icon} alt="price" className="w-[24px] h-[24px]" />
          <span>{priceText}</span>
        </div>
        <div className="flex items-start gap-[8px]">
          <img src={participant_icon} alt="participants" className="w-[24px] h-[24px]" />
          <span>{capacityText}</span>
        </div>
        {eventData.playlistUrl && (
          <div className="flex items-start gap-[8px]">
            <img src={playlist_icon} alt="playlist" className="w-[24px] h-[24px]" />
            <span>{eventData.playlistUrl}</span>
          </div>
        )}
      </div>

      {eventData.introduction && (
        <div className="mt-[48px] w-[645px]">
          <p className="text-[16px] font-medium text-[#1A1A1A] leading-[19px] max-h-[228px] overflow-y-auto break-words custom-scrollbar whitespace-pre-line">
            {eventData.introduction}
          </p>
        </div>
      )}

      <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">참여자</div>

      <div className="mt-[12px] flex items-center">
        <div
          className={[
            "overflow-x-auto custom-scrollbar",
            showAllParticipants ? "w-[592px]" : "w-[232px]",
          ].join(" ")}
        >
          <div className="flex items-center gap-[8px]">
            {visibleParticipants.length > 0 ? (
              visibleParticipants.map((participant) => (
                <div
                  key={participant.userId}
                  className="h-[52px] w-[52px] flex items-center justify-center shrink-0"
                >
                  <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                    {(participant as any).profileImageUrl ? (
                      <img
                        src={(participant as any).profileImageUrl}
                        alt={participant.nickname}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-sm">참여자가 없습니다.</div>
            )}
          </div>
        </div>

        {participants.length > 4 && (
          <button
            type="button"
            onClick={() => setShowAllParticipants((prev) => !prev)}
            className="ml-[12px] h-[44px] w-[118px] rounded-[20px] border border-[#919191] bg-[#F7F7F8] flex items-center justify-center gap-1"
          >
            <img src={add_icon} alt="add" className="h-[24px] w-[24px]" />
            <span className="text-[14px] font-medium text-[#1A1A1A]">
              모두보기
            </span>
          </button>
        )}
      </div>

      <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">댓글</div>

      <div className="mt-[12px] w-[644px]">
        <div className="h-[2px] w-full bg-[#F24148]" />
        <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />

        <div className="mt-[32px] h-[800px] overflow-y-auto custom-scrollbar">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <div
                key={comment.commentId}
                className="min-h-[145px] w-[644px] border-b border-[#BFBFBF]"
              >
                <div className="pl-[44px] pt-[32px]">
                  <div className="flex items-center">
                    <div className="h-[52px] w-[52px] flex items-center justify-center">
                      <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                        {comment.profileImageUrl ? (
                          <img
                            src={comment.profileImageUrl}
                            alt={comment.nickname}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="ml-[8px]">
                      <div className="text-h4 font-semibold text-[#1A1A1A]">
                        {comment.nickname}
                      </div>
                      <div className="text-[10px] font-medium text-[#1A1A1A]">
                        {formatDate(comment.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-[10px] text-h3 text-[#1A1A1A] whitespace-pre-line">
                    {comment.content}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-center py-8">댓글이 없습니다.</div>
          )}
        </div>

        <div className="mt-[32px] h-[2px] w-full bg-[#F24148]" />
        <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />
      </div>

      <div className="mt-[32px] w-[644px]">
        <div className="flex items-start gap-[12px]">
          <div className="h-[52px] w-[52px] flex items-center justify-center">
            <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9]" />
          </div>
          <div className="flex-1">
            <textarea
              placeholder="댓글을 작성해주세요."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              className="w-full h-[120px] rounded-[10px] border border-[#BFBFBF] bg-[#F7F7F8] px-[18px] py-[14px] text-[16px] font-medium text-[#1A1A1A] placeholder:text-[#919191] outline-none resize-none"
            />
            <div className="mt-[12px] flex justify-end">
              <button
                type="button"
                onClick={handleSubmitComment}
                disabled={!commentContent.trim() || submittingComment}
                className="h-[44px] w-[118px] rounded-[20px] bg-[#F24148] text-white text-[16px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submittingComment ? "등록 중..." : "등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
