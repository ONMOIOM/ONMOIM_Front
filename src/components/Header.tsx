import { HiBell } from 'react-icons/hi';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 로고 */}
        <div className="text-xl font-bold text-black">ONMOIM</div>

        {/* 오른쪽: 버튼들과 아이콘들 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/analysis')}
            className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-black hover:bg-gray-200 transition-colors"
          >
            분석하기
          </button>
          <button
            onClick={() => navigate('/event-create')}
            className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-black hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <span>+</span>
            <span>Create</span>
          </button>
          <button className="px-3 py-1.5 bg-gray-100 rounded-md text-sm text-black hover:bg-gray-200 transition-colors">
            Help
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
            <HiBell size={20} />
          </button>
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
              <HiOutlineDotsVertical className="text-white" size={16} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
