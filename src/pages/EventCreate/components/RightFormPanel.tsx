import { useRef } from "react";
import RSVPCard from "./RSVPCard";
import { useEventDraftStore } from "../store/useEventDraftStore";
// 에셋
import add_photo_icon from "../../../assets/icons/add_photo_icon.svg";
import edit_icon from '../../../assets/icons/edit_icon.svg';


type Props = { 
  mode: "edit" | "preview"
};

export const RightFormPanel = ({mode}: Props) => {
  const coverImageUrl = useEventDraftStore((s) => s.data.coverImageUrl);
  const setCoverImageUrl = useEventDraftStore((s) => s.setCoverImageUrl);

  const fileRef = useRef<HTMLInputElement | null>(null);

  const openFilePicker = () => {
    if (mode !== "edit") return;
    fileRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있어요.");
      e.target.value = "";
      return;
    }

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setCoverImageUrl(url);

    // 같은 파일 다시 선택 가능하게
    e.target.value = "";
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
          if (!isEdit) return;
          if (!hasImage) openFilePicker();
        }}
        disabled={!isEdit}
        className={[
          "relative w-full h-[540px] rounded-[10px]",
          "flex items-center justify-center",
          isEdit
            ? "border-[2px] border-dashed border-[#525252] bg-[#F7F7F7]"
            : "border-0 bg-[#D9D9D9]",
          isEdit && !hasImage ? "cursor-pointer" : "cursor-default",
          "disabled:opacity-100",
        ].join(" ")}
        aria-label="upload cover image"
      >

        {hasImage ? (
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
                  openFilePicker();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    openFilePicker();
                  }
                }}
                className={[
                  "absolute bottom-[32px] right-[24px]",
                  "w-[145px] h-[57px] rounded-[20px]",
                  "bg-[#FFFFFF] px-[28px] py-[16px] text-[#595959] border border-[#595959]",
                  "flex items-center justify-center gap-[8px]",
                  "cursor-pointer select-none",
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
          ) : <div className="bg-[#D9D9D9]"/>
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
