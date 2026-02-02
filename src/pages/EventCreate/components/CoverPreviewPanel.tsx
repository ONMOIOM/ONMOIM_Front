import { CoverPreviewPanelProps } from '../types/types';
import RSVPCard from './RSVPSelector';

export const CoverPreviewPanel = ({
    coverImageUrl,
    setCoverImageUrl,
}: CoverPreviewPanelProps) => {
    return (
        <div className="flex-1 min-w-0">
            <div className="relative w-full h-[340px] border border-gray-200 bg-gray-200">
                {coverImageUrl ? (
                    <img
                        src={coverImageUrl}
                        alt="cover"
                        className="w-full h-full object-cover"
                    />
                ) : null}

                <button
                    type="button"
                    onClick={() => {
                        // 실제로 url 받아서 넣기
                        setCoverImageUrl("");
                    }}
                    className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-1 text-sm text-white"
                >
                ✎ 수정
                </button>
            </div>
        
            <div className="mt-6">
                <RSVPCard />
            </div>
        </div>
    )
}