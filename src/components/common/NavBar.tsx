import { HiBell } from 'react-icons/hi';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gray-0 h-[152px]">
      <div className="flex justify-between pl-[66px] pr-[54px] pt-[51px]">
        {/* 왼쪽: 로고 */}
        <div className="w-[118px] h-[34px] text-h6 font-bold text-gray-900">
          ONMOIM
        </div>

        {/* 오른쪽: 버튼들 + 아이콘*/}
        <div className="flex items-start gap-[31px]">
          <button
            onClick={() => navigate('/analysis')}
            className="w-[170px] h-[50px] border border-gray-900 rounded-12 bg-gray-0 text-gray-900 flex items-center justify-center text-h2 hover:bg-gray-300 transition-colors outline-none"
          >
            분석하기
          </button>
          <button
            onClick={() => navigate('/event-create')}
            className="w-[170px] h-[50px] border border-gray-900 rounded-12 bg-gray-0 text-gray-900 flex items-center justify-center gap-1 text-h2 hover:bg-gray-300 transition-colors outline-none"
          >
            <span>+</span>
            <span>Create</span>
          </button>
          <button 
            className="w-[125px] h-[50px] border border-gray-900 rounded-12 bg-gray-0 text-gray-900 flex items-center justify-center text-h2 hover:bg-gray-300 transition-colors outline-none"
          >
            Help
          </button>
          <button className="w-[28px] h-[28px] flex items-center justify-center flex-shrink-0 hover:opacity-80 transition-opacity outline-none mt-[12px]">
          <HiBell 
  size={28} 
  className="fill-gray-0 stroke-gray-900 stroke-1" 
/>
          </button>
          {/* 프로필 사진과 더보기 버튼 컨테이너 */}
          <div className="relative w-[40px] h-[40px] flex-shrink-0 mt-[4px]">
            {/* 프로필 사진 */}
            <div
              className="w-[40px] h-[40px] rounded-circle bg-gradient-to-br from-red-400 to-red-600 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate('/profile')}
              role="button"
              aria-label="프로필 페이지로 이동"
            />
            {/* 더보기 버튼 */}
            <button className="absolute left-[26px] top-[24px] w-[28px] h-[28px] rounded-circle bg-gray-0 border border-gray-900 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors outline-none">
              <HiOutlineDotsHorizontal className="text-gray-900" size={16} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
