import { useState } from 'react';
import { HiHeart, HiOutlineHeart } from 'react-icons/hi';

interface LikeButtonProps {
  recipeId: number;
  initialLiked?: boolean;
}

// [중요] 페이지 곳곳에서 쓰일 찜하기 버튼
const LikeButton = ({ recipeId, initialLiked = false }: LikeButtonProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleToggleLike = async (): Promise<void> => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // TODO: API 명세서 완성 후 구현
      // if (isLiked) {
      //   await eventAPI.removeFavorite(recipeId);
      //   setIsLiked(false);
      // } else {
      //   await eventAPI.addFavorite(recipeId);
      //   setIsLiked(true);
      // }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('찜하기 처리 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isLiked
          ? 'text-red-500 scale-110'
          : 'text-white hover:text-red-300 hover:scale-105'
      }`}
      aria-label={isLiked ? '찜하기 취소' : '찜하기'}
    >
      {isLiked ? (
        <HiHeart size={24} className="drop-shadow-md" />
      ) : (
        <HiOutlineHeart size={24} className="drop-shadow-lg" />
      )}
    </button>
  );
};

export default LikeButton;
