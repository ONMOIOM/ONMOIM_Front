
export const ActionPanel = () => {
    return (
       <div className="w-[140px] shrink-0 flex flex-col gap-3 pt-[360px]">
            <button className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
                미리보기
            </button>
            <button className="w-full rounded-lg border border-gray-200 px-4 py-2 text-sm">
                저장하기
            </button>
        </div>
    )
}