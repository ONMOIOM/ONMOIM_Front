import { useState, useEffect, useRef } from 'react';
import { LeftFormPanel } from "./components/LeftFormPanel";
import { CoverPreviewPanel } from "./components/CoverPreviewPanel";
import { ActionPanel } from "./components/ActionPanel";
import { useNavigate, useLocation } from "react-router-dom";
import { type FontTypeKey, ScheduleType, LocationType, DraftEvent } from './types/types.ts';

export default function EventCreate() {
    const navigate = useNavigate();

    // 개별 상태 관리
    const [title, setTitle] = useState("같은 행사 참여자 보기");
    const [fontType, setFontType] = useState<FontTypeKey>("normal");
    const [schedule, setSchedule] = useState<ScheduleType>({
        startAt: null,
        endAt: null,
    })
    const [location, setLocation] = useState<LocationType>({
        streetAddress: "",
        lotNumber: "",
    })
    const [capacity, setCapacity] = useState<number | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [allowExternal, setAllowExternal] = useState(false);
    const [playlist, setPlaylist] = useState("");
    const [description, setDescription] = useState("");
    const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);

    // 초안 생성
    const buildDraft = (): DraftEvent => ({
        title,
        fontType,
        schedule,
        location,
        capacity,
        price,
        allowExternal,
        playlist,
        description,
        coverImageUrl,
    });

    // 미리보기 버튼 클릭 시 실행
    const onPreview = () => {
        navigate("/event-create/preview", { state: { draft: buildDraft() } });
    };

    // 저장하기 버튼 클릭 시 실행
    const onSave = () => {
        const draft = buildDraft();
        // 여기서 draft 조각으로 PATCH 호출?
    };


    /*-- 미리보기에서 돌아가기 버튼 눌렀을 때 안날아가게 하기 위한 임시 조치--*/
    const { state } = useLocation();
    const draftFromPreview = (state as { draft?: DraftEvent } | null)?.draft;

    // 이미 한 번 반영했는지 체크 (입력 덮어쓰기 방지)
    const hydratedRef = useRef(false);

    useEffect(() => {
        if (!draftFromPreview) return;
        if (hydratedRef.current) return;
        hydratedRef.current = true;

        // ✅ 너가 부모(EventCreate)에서 들고 있는 개별 상태들 전부 여기서 복원
        setTitle(draftFromPreview.title);
        setFontType(draftFromPreview.fontType);
        setSchedule(draftFromPreview.schedule);
        setLocation(draftFromPreview.location);
        setCapacity(draftFromPreview.capacity);
        setPrice(draftFromPreview.price);
        setPlaylist(draftFromPreview.playlist);
        setDescription(draftFromPreview.description);
        setAllowExternal(draftFromPreview.allowExternal);
        setCoverImageUrl(draftFromPreview.coverImageUrl ?? null);
    }, [draftFromPreview]);

    return (
        <div className="w-full bg-white">
        <div className="mx-auto max-w-[1280px] px-8 pt-6">
            <div className="flex gap-10">

                {/* Left Panel*/}
                <LeftFormPanel
                    title={title}
                    setTitle={setTitle}
                    fontType={fontType}
                    setFontType={setFontType}
                    allowExternal={allowExternal}
                    setAllowExternal={setAllowExternal}
                    description={description}
                    setDescription={setDescription}
                    schedule={schedule}
                    setSchedule={setSchedule}
                    location={location}
                    setLocation={setLocation}
                    capacity={capacity}
                    setCapacity={setCapacity}
                    price={price}
                    setPrice={setPrice}
                    playlist={playlist}
                    setPlaylist={setPlaylist}
                />
            
                {/* Middle Panel */}
                <CoverPreviewPanel
                    coverImageUrl={coverImageUrl}
                    setCoverImageUrl={setCoverImageUrl}
                />

                {/* Right Panel */}
                <ActionPanel onPreview={onPreview} onSave={onSave}/>    
            </div>
        </div>
        </div>
    );
}
