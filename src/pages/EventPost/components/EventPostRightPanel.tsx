import { useState, useEffect, useRef } from "react";
import ReplyOptions from "./ReplyOptions";
import add_photo_icon from "../../../assets/icons/add_photo_icon.svg";
import edit_icon from "../../../assets/icons/edit_icon.svg";
import { getEvent } from "../../../api/eventInfo";
import { uploadEventImage } from "../../../api/event_updated";
import { compressImage } from "../../../utils/imageCompression";
import { convertImageUrl } from "../../../utils/imageUrlConverter";

type Props = {
  eventId: number;
  isMyEvent: boolean;
};

export const EventPostRightPanel = ({ eventId, isMyEvent }: Props) => {
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // 이벤트 데이터에서 이미지 URL 가져오기
  useEffect(() => {
    const fetchEventImage = async () => {
      try {
        const res = await getEvent(eventId);
        if (res.success && res.data?.imageUrl) {
          const convertedUrl = convertImageUrl(res.data.imageUrl);
          setCoverImageUrl(convertedUrl || null);
        }
      } catch (error) {
        console.error("[EventPostRightPanel] 이벤트 이미지 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventImage();
  }, [eventId]);

  const openFilePicker = () => {
    if (!isMyEvent || isUploading) return;
    fileRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    setIsUploading(true);

    try {
      // 이미지 압축
      const compressed = await compressImage(file, 1920, 0.85);
      const blob = compressed as Blob;
      const imageFile = new File([blob], file.name || "image.jpg", {
        type: blob.type || "image/jpeg",
      });

      // 임시 미리보기 URL 생성
      const tempUrl = URL.createObjectURL(file);
      setCoverImageUrl(tempUrl);

      // API 호출하여 이미지 업로드
      const res = await uploadEventImage(eventId, imageFile);
      console.log("[EventPostRightPanel] 행사 이미지 업로드 응답:", res);
      
      if (res.success && res.data) {
        // 백엔드에서 반환된 URL을 변환하여 저장
        const convertedUrl = convertImageUrl(res.data);
        console.log("[EventPostRightPanel] 변환된 URL:", convertedUrl);
        
        // 임시 URL 해제하고 서버 URL로 교체
        URL.revokeObjectURL(tempUrl);
        setCoverImageUrl(convertedUrl);
      } else {
        // 업로드 실패 시 임시 URL 제거
        URL.revokeObjectURL(tempUrl);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("[EventPostRightPanel] 행사 이미지 업로드 실패:", error);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      // 같은 파일 다시 선택 가능하게
      e.target.value = "";
    }
  };

  const hasImage =
    coverImageUrl &&
    typeof coverImageUrl === "string" &&
    coverImageUrl.trim() !== "" &&
    coverImageUrl !== "null" &&
    coverImageUrl !== "undefined";

  return (
    <div className="w-full mt-[192px]">
      {/* edit 모드일 때, 파일 인풋 */}
      {isMyEvent && (
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {/* 이미지 업로드 영역 */}
      <div
        className={[
          "relative w-full h-[540px] rounded-[10px]",
          "flex items-center justify-center",
          isMyEvent
            ? "border-[2px] border-dashed border-[#525252] bg-[#F7F7F7]"
            : "border-0 bg-[#D9D9D9]",
        ].join(" ")}
      >
        {isUploading ? (
          // 업로드 중일 때
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#525252]" />
            <span className="text-[16px]">업로드 중...</span>
          </div>
        ) : hasImage ? (
          // 사진 있을 때
          <>
            <img
              src={coverImageUrl}
              alt="cover"
              className="absolute inset-0 w-full h-full object-cover rounded-[10px]"
            />

            {/* 본인 행사일 때, 수정하기 버튼 */}
            {isMyEvent && (
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isUploading) openFilePicker();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    if (!isUploading) openFilePicker();
                  }
                }}
                className={[
                  "absolute bottom-[32px] right-[24px]",
                  "w-[145px] h-[57px] rounded-[20px]",
                  "bg-[#FFFFFF] px-[28px] py-[16px] text-[#595959] border border-[#595959]",
                  "flex items-center justify-center gap-[8px]",
                  isUploading ? "cursor-not-allowed opacity-50" : "cursor-pointer select-none",
                ].join(" ")}
              >
                <img src={edit_icon} alt="edit_icon" className="h-[25px] w-[25px]" />
                <span className="text-[16px] font-medium whitespace-nowrap break-keep">
                  수정하기
                </span>
              </div>
            )}
          </>
        ) : (
          // 사진 없을 때
          isMyEvent ? (
            <button
              type="button"
              onClick={openFilePicker}
              disabled={isUploading}
              className="flex flex-col items-center gap-2 text-gray-400 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <img
                src={add_photo_icon}
                alt="add_photo_icon"
                className="w-[67.5px] h-[67.5px]"
              />
            </button>
          ) : (
            <div className="bg-[#D9D9D9]" />
          )
        )}
      </div>

      {!isMyEvent && (
        <div className="mt-[39px]">
          <div className="mb-[16px] text-[24px] font-semibold text-[#1A1A1A]">
            회신 선택지
          </div>
          <ReplyOptions eventId={eventId} />
        </div>
      )}
    </div>
  );
};
