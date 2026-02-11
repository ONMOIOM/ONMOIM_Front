import { useState, useEffect } from 'react';
// 에셋
import playlist_icon from '../../../assets/icons/playlist_icon.svg';
import close from '../../../assets/icons/close.svg';

export type PlaylistModalProps = {
  open: boolean;
  onClose: () => void;
  value: string;
  onSave: (next: string) => void;
  saving?: boolean;
};

export const PlaylistModal = ({ open, onClose, value, onSave, saving }: PlaylistModalProps) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!open) return;
    setInput(value || "");
  }, [open, value]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* overlay 클릭 → 닫힘 */}
      <div
        className="absolute inset-0 bg-black/20"
        onClick={onClose}
      />

      {/* modal box */}
      <div className="absolute inset-0 flex mt-[273px] ml-[265px] h-[570px] pointer-events-none">
        <div className="pointer-events-auto w-[521px] rounded-[20px] bg-[#FFFFFF]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[102px] pt-[62px] pl-[50px]">
            <div className="flex items-center gap-2">
              <img src={playlist_icon} alt='playlist_icon' className="text-[#1A1A1A] h-[31px] w-[31px]"/>
              <span className="text-base font-bold text-[32px] text-[#1A1A1A]">플레이리스트</span>
            </div>

            <button
              onClick={onClose}
              className="pr-[43px] text-[#1A1A1A] hover:text-[#1A1A1A]"
            >
              <img src={close} alt='close_icon' className='w-[39px] h-[39px]'/>
            </button>
          </div>

          {/* 플리 링크 */}
          <div className="pl-[46px] pr-[43px] mb-[111px]">
            <div className="font-semibold text-[24px] mb-[20px]">링크 추가</div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-[435px] h-[58px] border border-[#BFBFBF] rounded-[20px] bg-[#FFFFFF] px-[24px] text-[16px] text-[#595959] placeholder:text-[#BFBFBF] outline-none"
                placeholder="ex) http://open.spotify.com/playlist/yourplaylist"
                />
          </div>

          {/* 저장 버튼 → 닫힘 */}
          <div className="flex justify-center mb-[44px]">
            <button
              className={[
                "h-[71px] w-[435px] rounded-[10px]",
                "bg-[#F7F7F8] text-[#595959]"
              ].join(" ")}
              onClick={() => {
                onSave(input.trim());
                onClose();
              }}
            >
              <span className="text-[20px] font-semibold text-[#595959]">확인</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
