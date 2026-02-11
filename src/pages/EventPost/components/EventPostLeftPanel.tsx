import {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import { getEvent, getEventParticipation } from "../../../api/eventInfo";
import {
  getCommentList,
  createComment,
  type CommentItem,
} from "../../../api/comment";
import { patchEvent } from "../../../api/event_updated";
import { buildPatchBody } from "../utils/buildPatchBody";
import { ScheduleModal } from "../../EventCreate/modals/ScheduleModal";
import { LocationModal } from "../../EventCreate/modals/LocationModal";
import { SeatsModal } from "../../EventCreate/modals/CapacityModal";
import { PriceModal } from "../../EventCreate/modals/PriceModal";
import { PlaylistModal } from "../../EventCreate/modals/PlaylistModal";
import { ParticipantsModal } from "../../EventCreate/modals/ParticipantsModal";
import location_icon from "../../../assets/icons/location_icon.svg";
import price_icon from "../../../assets/icons/price_icon.svg";
import participant_icon from "../../../assets/icons/participant_icon.svg";
import playlist_icon from "../../../assets/icons/Music.svg";
import add_icon from "../../../assets/icons/add.svg";
import { convertImageUrl } from "../../../utils/imageUrlConverter";
import useProfile from "../../../hooks/useProfile";

type ModalKey = "schedule" | "location" | "seats" | "price" | "playlist" | null;

type Props = {
  eventId: number;
  isMyEvent: boolean;
};

export type EventPostLeftPanelRef = {
  save: () => Promise<void>;
};

const formatDateTime = (
  startTime: string | null,
  endTime: string | null,
): string => {
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

/** 데이터에서 날짜/위치 등 추출 (flat 또는 nested 지원) */
const getStartTime = (d: any) => d?.startTime ?? d?.schedule?.startDate ?? null;
const getEndTime = (d: any) => d?.endTime ?? d?.schedule?.endDate ?? null;
const getStreetAddress = (d: any) =>
  d?.streetAddress ?? d?.location?.streetAddress ?? null;
const getLotNumber = (d: any) =>
  d?.lotNumberAddress ?? d?.location?.lotNumber ?? null;

export const EventPostLeftPanel = forwardRef<EventPostLeftPanelRef, Props>(
  function EventPostLeftPanel({ eventId, isMyEvent }, ref) {
    const { profile } = useProfile();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [eventData, setEventData] = useState<any>(null);
    const [participants, setParticipants] = useState<any[]>([]);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [commentContent, setCommentContent] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [showAllParticipants, setShowAllParticipants] = useState(false);
    const [showParticipantsModal, setShowParticipantsModal] = useState(false);
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [openModal, setOpenModal] = useState<ModalKey>(null);
    const saveInProgress = useRef(false);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const eventRes = await getEvent(eventId);
        if (!eventRes.success || !eventRes.data) {
          throw new Error(
            eventRes.message ?? "행사 정보를 불러올 수 없습니다.",
          );
        }
        setEventData(eventRes.data);
        let participantsData: any[] = [];
        try {
          const participantsRes = await getEventParticipation(eventId);
          if (participantsRes.success && participantsRes.data) {
            participantsData = participantsRes.data;
            setParticipants(participantsData);
          }
        } catch (e) {
          console.warn("[EventPost] 참여자 목록 조회 실패:", e);
        }
        try {
          const commentsRes = await getCommentList(eventId);
          if (commentsRes.success && commentsRes.data) {
            const commentList = commentsRes.data.commentList || [];
            // 참여자 목록과 매칭하여 프로필 이미지 보완
            const commentsWithProfileImages = commentList.map((comment) => {
              // 백엔드 응답의 profileImageUrl이 유효하면 그대로 사용
              if (comment.profileImageUrl && comment.profileImageUrl.trim()) {
                return comment;
              }
              // profileImageUrl이 없거나 빈 문자열인 경우, 참여자 목록에서 찾기
              const participant = participantsData.find(
                (p: any) => p.nickname === comment.nickname
              );
              if (participant && (participant as any).imageUrl) {
                return {
                  ...comment,
                  profileImageUrl: (participant as any).imageUrl,
                };
              }
              return comment;
            });
            setComments(commentsWithProfileImages);
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

    useImperativeHandle(
      ref,
      () => ({
        save: async () => {
          if (!eventData || saveInProgress.current) return;
          saveInProgress.current = true;
          try {
            const body = buildPatchBody(eventData);
            const res = await patchEvent(eventId, body);
            if (res.success) {
              await fetchData();
            } else {
              alert("저장에 실패했습니다.");
            }
          } catch (e: any) {
            console.warn("[EventPost] 수정 저장 실패:", e);
            alert("저장에 실패했습니다.");
          } finally {
            saveInProgress.current = false;
          }
        },
      }),
      [eventId, eventData],
    );

    useEffect(() => {
      fetchData();
    }, [eventId]);

    const applyEdit = (field: string) => {
      if (!eventData) return;
      const trimmed = editValue.trim();
      setEditingField(null);
      setEditValue("");
      if (field === "title")
        setEventData({ ...eventData, title: trimmed || eventData.title });
      if (field === "introduction")
        setEventData({
          ...eventData,
          introduction: trimmed || null,
          information: trimmed || null,
        });
    };

    const startEdit = (field: string, value: string | number | null) => {
      setEditingField(field);
      setEditValue(value != null ? String(value) : "");
    };

    /** eventData → ScheduleModal value */
    const getScheduleValue = () => {
      const s = getStartTime(eventData);
      const e = getEndTime(eventData);
      return {
        startAt: s ? new Date(s) : null,
        endAt: e ? new Date(e) : null,
      };
    };

    /** eventData → LocationModal value */
    const getLocationValue = () => ({
      streetAddress: getStreetAddress(eventData) || "",
      lotNumber: getLotNumber(eventData) ?? null,
    });

    const renderEditable = (
      field: string,
      displayValue: string,
      valueForEdit: string | number | null,
    ) => {
      if (!isMyEvent) return displayValue;
      if (editingField === field) {
        const isNum = field === "price" || field === "capacity";
        return (
          <input
            autoFocus
            type={isNum ? "number" : "text"}
            min={field === "capacity" ? 0 : undefined}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={() => applyEdit(field)}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyEdit(field);
              if (e.key === "Escape") {
                setEditingField(null);
                setEditValue("");
              }
            }}
            className="border border-[#BFBFBF] rounded px-1 py-0.5 text-[14px] w-full max-w-[400px] outline-none focus:ring-1 focus:ring-[#F24148]"
          />
        );
      }
      return (
        <span
          role="button"
          tabIndex={0}
          onClick={() => startEdit(field, valueForEdit)}
          onKeyDown={(e) => e.key === "Enter" && startEdit(field, valueForEdit)}
          className="cursor-pointer hover:bg-gray-100 rounded px-1"
        >
          {displayValue || "클릭하여 입력"}
        </span>
      );
    };

    const handleSubmitComment = async () => {
      if (!commentContent.trim() || submittingComment) return;

      setSubmittingComment(true);
      try {
        const res = await createComment(eventId, {
          content: commentContent.trim(),
        });
        if (res.success && res.data) {
          // 백엔드 응답에 profileImageUrl이 없거나 빈 문자열이면 현재 사용자의 프로필 이미지 사용
          const commentData: CommentItem = {
            ...res.data,
            profileImageUrl: res.data.profileImageUrl || profile?.profileImageUrl || "",
          };
          setComments((prev) => [commentData, ...prev]);
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
          <p className="text-red-600">
            {error ?? "행사 정보를 불러올 수 없습니다."}
          </p>
        </div>
      );
    }

    const streetAddr = getStreetAddress(eventData);
    const lotNum = getLotNumber(eventData);
    const startT = getStartTime(eventData);
    const endT = getEndTime(eventData);
    const currentParticipants = participants.length;
    const totalCapacity = eventData.capacity ?? 0;
    const remainingSpots = totalCapacity - currentParticipants;
    const locationText = streetAddr
      ? lotNum
        ? `${streetAddr} ${lotNum}`
        : streetAddr
      : "장소 미정";
    const priceText =
      eventData.price != null
        ? `${eventData.price.toLocaleString()} ₩`
        : "가격 미정";
    const capacityText =
      totalCapacity > 0
        ? `${currentParticipants}/${totalCapacity}, 현재 ${remainingSpots}자리가 남았습니다.`
        : "인원 미정";
    const visibleParticipants = showAllParticipants
      ? participants.slice(0, 18)
      : participants.slice(0, 4);

    return (
      <div className="w-full mt-[192px] pl-[161px]">
        <h1 className="text-[32px] font-bold text-[#1A1A1A] font-sans">
          {eventData.title || "제목 없음"}
        </h1>
        <div className="mt-[10px] text-h5 text-[#1A1A1A]">
          <span
            role="button"
            tabIndex={0}
            onClick={() => isMyEvent && setOpenModal("schedule")}
            onKeyDown={(e) =>
              isMyEvent && e.key === "Enter" && setOpenModal("schedule")
            }
            className={
              isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""
            }
          >
            {formatDateTime(startT, endT)}
          </span>
        </div>

        <div className="mt-[52px] space-y-[17px] text-[14px] font-medium text-[#1A1A1A]">
          <div className="flex items-start gap-[8px]">
            <img
              src={location_icon}
              alt="location"
              className="w-[24px] h-[24px] shrink-0"
            />
            <span
              role="button"
              tabIndex={0}
              onClick={() => isMyEvent && setOpenModal("location")}
              onKeyDown={(e) =>
                isMyEvent && e.key === "Enter" && setOpenModal("location")
              }
              className={
                isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""
              }
            >
              {locationText}
            </span>
          </div>
          <div className="flex items-start gap-[8px]">
            <img
              src={price_icon}
              alt="price"
              className="w-[24px] h-[24px] shrink-0"
            />
            <span
              role="button"
              tabIndex={0}
              onClick={() => isMyEvent && setOpenModal("price")}
              onKeyDown={(e) =>
                isMyEvent && e.key === "Enter" && setOpenModal("price")
              }
              className={
                isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""
              }
            >
              {priceText}
            </span>
          </div>
          <div className="flex items-start gap-[8px]">
            <img
              src={participant_icon}
              alt="participants"
              className="w-[24px] h-[24px] shrink-0"
            />
            <span
              role="button"
              tabIndex={0}
              onClick={() => isMyEvent && setOpenModal("seats")}
              onKeyDown={(e) =>
                isMyEvent && e.key === "Enter" && setOpenModal("seats")
              }
              className={
                isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""
              }
            >
              {capacityText}
            </span>
          </div>
          {(eventData.playlistUrl || eventData.playlist || isMyEvent) && (
            <div className="flex items-start gap-[8px]">
              <img
                src={playlist_icon}
                alt="playlist"
                className="w-[24px] h-[24px] shrink-0"
              />
              <span
                role="button"
                tabIndex={0}
                onClick={() => isMyEvent && setOpenModal("playlist")}
                onKeyDown={(e) =>
                  isMyEvent && e.key === "Enter" && setOpenModal("playlist")
                }
                className={
                  isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""
                }
              >
                {eventData.playlistUrl ||
                  eventData.playlist ||
                  "플레이리스트 없음"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-[48px] w-[645px]">
          {editingField === "introduction" && isMyEvent ? (
            <textarea
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => applyEdit("introduction")}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  e.preventDefault();
                  applyEdit("introduction");
                }
                if (e.key === "Escape") {
                  setEditingField(null);
                  setEditValue("");
                }
              }}
              placeholder="이곳을 클릭해 행사 정보를 수정하세요."
              className="w-full min-h-[120px] border border-[#BFBFBF] rounded px-2 py-1 text-[16px] outline-none focus:ring-1 focus:ring-[#F24148] placeholder:text-[#919191]"
            />
          ) : (
            <p
              role="button"
              tabIndex={0}
              onClick={() =>
                isMyEvent &&
                startEdit(
                  "introduction",
                  eventData.introduction || eventData.information || "",
                )
              }
              onKeyDown={(e) =>
                isMyEvent &&
                e.key === "Enter" &&
                startEdit(
                  "introduction",
                  eventData.introduction || eventData.information || "",
                )
              }
              className={`text-[16px] font-medium text-[#1A1A1A] leading-[19px] max-h-[228px] overflow-y-auto break-words custom-scrollbar whitespace-pre-line ${isMyEvent ? "cursor-pointer hover:bg-gray-100 rounded" : ""} ${!eventData.introduction && !eventData.information && isMyEvent ? "text-[#919191]" : ""}`}
            >
              {eventData.introduction ||
                eventData.information ||
                (isMyEvent ? "이곳을 클릭해 행사 정보를 수정하세요." : "")}
            </p>
          )}
        </div>

        <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
          참여자
        </div>

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
                          src={convertImageUrl((participant as any).profileImageUrl)}
                          alt={participant.nickname}
                          className="h-full w-full object-cover"
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
                ))
              ) : (
                <div className="text-gray-400 text-sm">참여자가 없습니다.</div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowParticipantsModal(true)}
            className="ml-[12px] h-[44px] w-[118px] rounded-[20px] border border-[#919191] bg-[#F7F7F8] flex items-center justify-center gap-1"
          >
            <img src={add_icon} alt="add" className="h-[24px] w-[24px]" />
            <span className="text-[14px] font-medium text-[#1A1A1A]">
              모두보기
            </span>
          </button>
        </div>

        <div className="mt-[70px] text-h6 text-[#1A1A1A] font-semibold">
          댓글
        </div>

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
                          {comment.profileImageUrl && comment.profileImageUrl.trim() ? (
                            <img
                              src={convertImageUrl(comment.profileImageUrl)}
                              alt={comment.nickname}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                // 이미지 로드 실패 시 디폴트 아이콘 표시
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
              <div className="text-gray-400 text-center py-8">
                댓글이 없습니다.
              </div>
            )}
          </div>

          <div className="mt-[32px] h-[2px] w-full bg-[#F24148]" />
          <div className="mt-[12px] h-[2px] w-full bg-[#F24148]" />
        </div>

        <div className="mt-[32px] w-[644px]">
          <div className="flex items-start gap-[12px]">
            <div className="h-[52px] w-[52px] flex items-center justify-center shrink-0">
              <div className="h-[44px] w-[44px] rounded-full bg-[#D9D9D9] flex items-center justify-center overflow-hidden">
                {profile?.profileImageUrl ? (
                  <img
                    src={convertImageUrl(profile.profileImageUrl)}
                    alt={profile.nickname || "프로필"}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아이콘으로 fallback
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

        {/* 행사 생성 시 사용하는 모달들 */}
        <ScheduleModal
          open={openModal === "schedule"}
          onClose={() => setOpenModal(null)}
          value={
            eventData ? getScheduleValue() : { startAt: null, endAt: null }
          }
          onSave={(next) => {
            setEventData({
              ...eventData,
              startTime: next.startAt?.toISOString() ?? null,
              endTime: next.endAt?.toISOString() ?? null,
              schedule:
                next.startAt && next.endAt
                  ? {
                      startDate: next.startAt.toISOString(),
                      endDate: next.endAt.toISOString(),
                    }
                  : eventData.schedule,
            });
          }}
        />
        <LocationModal
          open={openModal === "location"}
          onClose={() => setOpenModal(null)}
          value={
            eventData
              ? getLocationValue()
              : { streetAddress: "", lotNumber: null }
          }
          onSave={(next) => {
            setEventData({
              ...eventData,
              streetAddress: next.streetAddress,
              lotNumberAddress: next.lotNumber,
              location: next,
            });
          }}
        />
        <SeatsModal
          open={openModal === "seats"}
          onClose={() => setOpenModal(null)}
          value={eventData?.capacity ?? null}
          onSave={(next) => setEventData({ ...eventData, capacity: next })}
        />
        <PriceModal
          open={openModal === "price"}
          onClose={() => setOpenModal(null)}
          value={eventData?.price ?? null}
          onSave={(next) => setEventData({ ...eventData, price: next })}
        />
        <PlaylistModal
          open={openModal === "playlist"}
          onClose={() => setOpenModal(null)}
          value={eventData?.playlistUrl ?? eventData?.playlist ?? ""}
          onSave={(next) =>
            setEventData({ ...eventData, playlistUrl: next, playlist: next })
          }
        />
        <ParticipantsModal
          open={showParticipantsModal}
          onClose={() => setShowParticipantsModal(false)}
          participants={participants.map((p) => {
            // API status를 모달 형식으로 변환
            let status: "going" | "pending" | "declined" = "pending";
            if (p.status === "ATTEND") status = "going";
            else if (p.status === "PENDING") status = "pending";
            else if (p.status === "ABSENT") status = "declined";

            // API 응답은 nickname 필드를 사용 (OpenAPI 스펙 확인)
            const participantName = (p as any).nickname || (p as any).name || "";

            return {
              id: String(p.userId), // userId를 문자열로 변환
              name: participantName,
              status,
              profileImageUrl: convertImageUrl((p as any).profileImageUrl),
            };
          })}
        />
      </div>
    );
  },
);
