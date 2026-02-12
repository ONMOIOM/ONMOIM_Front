import { useRef, useState } from "react";
import RSVPCard from "./RSVPCard";
import { useEventDraftStore } from "../store/useEventDraftStore";
import { uploadEventImage } from "../../../api/event_updated";
import { compressImage } from "../../../utils/imageCompression";
import { convertImageUrl } from "../../../utils/imageUrlConverter";
// 에셋
import add_photo_icon from "../../../assets/icons/add_photo_icon.svg";
import edit_icon from '../../../assets/icons/edit_icon.svg';


type Props = { 
  mode: "edit" | "preview"
};

export const RightFormPanel = ({mode}: Props) => {
  const coverImageUrl = useEventDraftStore((s) => s.data.coverImageUrl);
  const setCoverImageUrl = useEventDraftStore((s) => s.setCoverImageUrl);
  const eventId = useEventDraftStore((s) => s.eventId);
  const [isUploading, setIsUploading] = useState(false);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (mode !== "edit") return;
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

    // eventId가 없으면 업로드 불가
    if (!eventId) {
      alert("행사 초안이 생성되지 않았습니다. 잠시 후 다시 시도해주세요.");
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
      console.log("[EventCreate] 행사 이미지 업로드 응답:", res);
      
      if (res.success && res.data) {
        // 백엔드에서 반환된 URL을 변환하여 저장
        const convertedUrl = convertImageUrl(res.data);
        console.log("[EventCreate] 변환된 URL:", convertedUrl);
        
        // 임시 URL 해제하고 서버 URL로 교체
        URL.revokeObjectURL(tempUrl);
        setCoverImageUrl(convertedUrl);
      } else {
        // 업로드 실패 시 임시 URL 제거
        URL.revokeObjectURL(tempUrl);
        setCoverImageUrl(null);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("[EventCreate] 행사 이미지 업로드 실패:", error);
      setCoverImageUrl(null);
      alert("이미지 업로드 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
      // 같은 파일 다시 선택 가능하게
      e.target.value = "";
    }
  };

  const isEdit = mode === "edit";

  const isValidImageUrl =
  typeof coverImageUrl === "string" &&
  coverImageUrl.trim() !== "" &&
  coverImageUrl !== "null" &&
  coverImageUrl !== "undefined";

  const hasImage = isValidImageUrl;
  
  return (
    <div className="w-full mt-[192px]">
      {/* edit 모드일 때, 파일 인풋 */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* 이미지 업로드 영역 */}
      <button
        type="button"
        onClick={() => {
          if (!isEdit || isUploading) return;
          if (!hasImage) openFilePicker();
        }}
        disabled={!isEdit || isUploading}
        className={[
          "relative w-full h-[540px] rounded-[10px]",
          "flex items-center justify-center",
          isEdit
            ? "border-[2px] border-dashed border-[#525252] bg-[#F7F7F7]"
            : "border-0 bg-[#D9D9D9]",
          isEdit && !hasImage && !isUploading ? "cursor-pointer" : "cursor-default",
          "disabled:opacity-100",
        ].join(" ")}
        aria-label="upload cover image"
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

            {/* edit 모드일 때, 수정하기 */}
            {isEdit && (
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
          // 사진 없을 때, edit은 아이콘 / preview는 회색 바탕
          isEdit ? (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <img
                src={add_photo_icon}
                alt="add_photo_icon"
                className="w-[67.5px] h-[67.5px]"
              />
            </div>
          ) : <div className="w-full h-full min-h-[200px] rounded-[10px] bg-[#D9D9D9]"/>
        )}
      </button>

      {/* 회신 선택지 */}
      <div className="mt-[39px]">
        <div className="mb-[16px] text-[24px] font-semibold text-[#1A1A1A]">
          회신 선택지
        </div>
        <RSVPCard />
      </div>
    </div>
  );
};
