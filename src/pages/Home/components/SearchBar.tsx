import { useState, useEffect } from "react";
import { HiOutlineSearch, HiX } from "react-icons/hi";
import { useDebounce } from "../../../hooks/useDebounce";

export interface SearchBarProps {
  /** 검색어 변경 시 실행될 콜백 (debounced) */
  onSearchChange: (searchTerm: string) => void;
  /** placeholder 텍스트 */
  placeholder?: string;
  /** debounce 지연 시간 (ms) */
  debounceDelay?: number;
}

const SearchBar = ({
  onSearchChange,
  placeholder = "행사 검색...",
  debounceDelay = 500,
}: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, debounceDelay);

  // debounced 값이 변경될 때만 콜백 호출
  useEffect(() => {
    onSearchChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onSearchChange]);

  const handleClear = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative ml-6 flex items-center">
      {/* 검색 아이콘 */}
      <div className="absolute left-3 flex items-center pointer-events-none">
        <HiOutlineSearch className="h-4 w-4 text-gray-400" />
      </div>

      {/* 검색 입력 필드 */}
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-64 rounded-lg border border-gray-300 bg-white pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
      />

      {/* 지우기 버튼 (검색어가 있을 때만 표시) */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 flex items-center justify-center rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          aria-label="검색어 지우기"
        >
          <HiX className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
