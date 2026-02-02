type Props = {
  onConfirm: () => void;
}

export default function CodeExpiredPage({ onConfirm }: Props) {
  return (
    <div className="min-h-screen bg-[#eeeeee]">
      {/* 중앙 회색 패널 */}
      <div className="mx-auto flex min-h-screen max-w-[780px] items-center justify-center px-6">
        <div className="w-full rounded-[28px] bg-[#d9d9d9] px-6 py-20">
          {/* 흰 카드 */}
          <div className="mx-auto w-full max-w-[520px] rounded-[14px] bg-white px-10 py-10 shadow-sm">
            <div className="text-center">
              {/* 캘린더 아이콘 */}
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gray-100">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-600"
                  >
                    <path
                      d="M7 2v3M17 2v3M3.5 9h17"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6 5h12a3 3 0 0 1 3 3v11a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 13h4"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              <div className="text-[20px] font-semibold text-gray-900">
                오래된 코드
              </div>
              <div className="mt-2 text-[12px] text-gray-500">
                발송된지 일정 시간 이상이 지나 만료되었습니다.
                <br />
                다시 인증을 진행해주세요!
              </div>
            </div>

            <button
              type="button"
              className="mt-8 h-[48px] w-full rounded-[12px] border border-gray-200 bg-white text-[14px] font-medium text-gray-800 hover:bg-gray-50"
              onClick={onConfirm}
            >
              이해했습니다.
            </button>

            {/* 아주 작은 안내문 */}
            <div className="mt-10 text-center text-[10px] leading-4 text-gray-400">
              인증코드는 발급된 시점부터 일정 시간 동안만 유효합니다.
              <br />
              만료된 경우 다시 인증 이메일을 발송해주세요.
              <br />
              도움이 필요하면 고객센터로 문의해주세요.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
