type Props = {
  label?: "수정" | "확인";
  onClick?: () => void | Promise<void>;
  saving?: boolean;
};

export const EventPostBottomBar = ({ label = "수정", onClick, saving }: Props) => {
  return (
    <div className="w-[540px]">
      <div className="flex justify-end gap-[17px]">
        <button
          type="button"
          disabled={saving}
          className="h-[82px] w-[210px] rounded-[10px] bg-[#F24148] text-[#FFFFFF] text-[24px] font-semibold border border-[#F24148] disabled:opacity-60"
          onClick={() => onClick?.()}
        >
          {label === "수정" && saving ? "저장 중..." : label}
        </button>
      </div>
    </div>
  );
};
