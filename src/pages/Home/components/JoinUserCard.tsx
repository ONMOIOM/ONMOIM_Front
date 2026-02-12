/**
 * JoinUserCard - 같은 행사에 참여한 분들 카드 (EventCard와 동일 크기: 456×379)
 * 상단: 프로필 영역 256px (EventCard 이미지 높이와 동일)
 * 하단: 이름 + SNS 아이콘 (123px, EventCard 하단과 동일)
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instagramIcon from "../../../assets/icons/icons_instagram.svg";
import linkedinIcon from "../../../assets/icons/icons_linkedin.svg";
import twitterIcon from "../../../assets/icons/TwitterGroup.svg";
import { convertImageUrl } from "../../../utils/imageUrlConverter";

export interface JoinUserCardProps {
  /** 참여자 이름 (예: 윤수호) */
  name: string;
  /** 프로필 이미지 URL (없으면 #D9D9D9 플레이스홀더) */
  imageUrl?: string;
  /** 사용자 ID (프로필 페이지 이동용) */
  userId: string;
}

const ICON_SIZE_PX = 29;

const JoinUserCard = ({ name, imageUrl, userId }: JoinUserCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  
  const convertedImageUrl = imageUrl && imageUrl.trim() ? convertImageUrl(imageUrl) : null;

  const handleCardClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/profile/${userId}`);
  };

  return (
    <article
      className="flex h-[379px] w-[456px] shrink-0 flex-col cursor-pointer overflow-hidden rounded-8 bg-gray-0 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:opacity-90 hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-all"
      onClick={handleCardClick}
    >
      {/* 상단: 프로필 영역 - EventCard 이미지와 동일 456×256, rounded-t-8 */}
      <div className="flex h-[256px] w-[456px] shrink-0 items-center justify-center overflow-hidden rounded-t-8 bg-[#E0E0E0]">
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

      {/* 하단: EventCard와 동일 높이 123px, 이름 + SNS 아이콘 */}
      <div className="relative flex min-h-[123px] flex-col justify-between px-4 py-4 rounded-b-8 border border-t-0 border-[#D9D9D9] bg-white">
        <p className="text-[20px] font-semibold leading-normal text-gray-900 truncate">
          {name}
        </p>
        <div className="flex items-center gap-3 mt-2">
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
