/**
 * JoinUserCard - 같은 행사에 참여한 분들 카드 (Figma Rectangle 4367 + 4372)
 * 상단: 프로필 플레이스홀더 (284×231, #D9D9D9, 상단만 20px 라운드)
 * 하단: 이름(우상단) + SNS 아이콘(하단 18px, 좌측 인스타 기준 20px, 아이콘 간격 12px, 29×29)
 */

import { useState } from "react";
import instagramIcon from "../../../assets/icons/icons_instagram.svg";
import linkedinIcon from "../../../assets/icons/icons_linkedin.svg";
import twitterIcon from "../../../assets/icons/TwitterGroup.svg";
import { convertImageUrl } from "../../../utils/imageUrlConverter";

export interface JoinUserCardProps {
  /** 참여자 이름 (예: 윤수호) */
  name: string;
  /** 프로필 이미지 URL (없으면 #D9D9D9 플레이스홀더) */
  imageUrl?: string;
}

const ICON_SIZE_PX = 29;

const JoinUserCard = ({ name, imageUrl }: JoinUserCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  // 이미지 URL이 있고 비어있지 않을 때만 변환
  const convertedImageUrl = imageUrl && imageUrl.trim() ? convertImageUrl(imageUrl) : null;

  return (
    <article className="flex w-[285px] shrink-0 flex-col">
      {/* 상단: 프로필 영역 (Rectangle 4367) - 284×231, #D9D9D9, 20px 20px 0 0 */}
      <div className="flex h-[231px] w-[285px] shrink-0 items-center justify-center overflow-hidden rounded-t-[20px] bg-[#D9D9D9]">
        {convertedImageUrl && !imageError ? (
          <img
            src={convertedImageUrl}
            alt={name}
            className="h-full w-full object-cover"
            onError={() => {
              setImageError(true);
            }}
          />
        ) : null}
      </div>

      {/* 하단: 이름(상단 19px, 우측 20px) + SNS 아이콘(하단 18px, 좌측 20px, 간격 12px, 29×29) */}
      <div className="relative flex h-[107px] w-[285px] shrink-0 rounded-b-[20px] border border-t-0 border-[#D9D9D9] bg-white">
        {/* H5_semiBold: 20px, 600, #1A1A1A → gray-900 토큰 사용 */}
        <p className="absolute right-5 top-[19px] text-[20px] font-semibold leading-normal text-gray-900">
          {name}
        </p>
        <div className="absolute bottom-[18px] left-5 flex items-center gap-3">
          <img
            src={instagramIcon}
            alt="Instagram"
            width={ICON_SIZE_PX}
            height={ICON_SIZE_PX}
            className="shrink-0"
          />
          <img
            src={twitterIcon}
            alt="Twitter"
            width={ICON_SIZE_PX}
            height={ICON_SIZE_PX}
            className="shrink-0"
          />
          <img
            src={linkedinIcon}
            alt="LinkedIn"
            width={ICON_SIZE_PX}
            height={ICON_SIZE_PX}
            className="shrink-0"
          />
        </div>
      </div>
    </article>
  );
};

export default JoinUserCard;
