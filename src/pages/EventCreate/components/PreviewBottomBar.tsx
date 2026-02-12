import { useNavigate } from "react-router-dom";

export default function() {
    const navigate = useNavigate();

    return(
        <div>
            {/* Right floating buttons */}
          <div className="w-[140px] shrink-0 flex flex-col gap-3 pt-[240px]">
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
              onClick={() => navigate("/event-create")}
            >
              돌아가기
            </button>
            <button
              type="button"
              className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm"
              onClick={() => {
                // 여기서는 UI만 맞추는 단계라 일단 콘솔
                console.log("저장하기(미리보기 화면)");
              }}
            >
              저장하기
            </button>
          </div>
        </div>
    )
}