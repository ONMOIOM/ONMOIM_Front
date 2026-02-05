# 프로필 화면 미구현/연결 필요 항목 정리

`dobby/design/profile-component` 브랜치에서 UI 위주로 구현하고, API/기능 연결을 보류한 항목들을 정리했습니다.

## 1) 프로필 정보 조회/반영

- 대상 화면: `src/pages/Profile/Profile.tsx`, `src/pages/Profile/ProfileEdit.tsx`
- 현 상태: 이름/성/자기소개/이메일/가입일/SNS가 모두 목데이터.
- 연결 필요:
  - 회원 정보 조회 API로 기본 정보 로딩
  - `Profile`/`ProfileEdit` 양쪽에서 같은 데이터 소스 사용
  - 로딩/에러 상태 처리

## 2) 이메일 변경 플로우

- 대상 컴포넌트: `src/components/profile/EmailFlowModal.tsx`
- 현 상태:
  - 이메일 유효성 검사: 프론트 정규식 + mock(“exists” 포함 시 중복 처리)
  - “인증 이메일 받기/확인/성공” 단계는 UI 전환만 구현
  - 인증번호 검증/재발송 없음
- 연결 필요:
  - 이메일 변경 요청 API
  - 인증 이메일 발송 API
  - 인증번호 검증 API
  - 검증 성공 시 회원 이메일 업데이트 API
  - 실패 케이스(중복/형식/인증 실패) 메시지/상태 반영

## 3) SNS(인스타/트위터/링크드인) 추가 모달

- 대상 컴포넌트:
  - `src/components/profile/InstagramAddModal.tsx`
  - `src/components/profile/TwitterAddModal.tsx`
  - `src/components/profile/LinkedinAddModal.tsx`
- 현 상태:
  - 모달 내 입력값은 로컬 상태로만 유지
  - 확인 시 `ProfileEdit` 내 로컬 상태만 업데이트
  - 빈 값은 저장하지 않고 닫힘
- 연결 필요:
  - 회원 정보 수정 API에 각 SNS 아이디 저장
  - 기존 SNS 값 조회/초기값 반영
  - 저장 성공/실패 시 처리 및 모달 종료 조건

## 4) 프로필 수정 저장

- 대상 화면: `src/pages/Profile/ProfileEdit.tsx`
- 현 상태:
  - 이름/성/자기소개 변경은 로컬 상태만 변경
  - “저장” 버튼 동작 없음
- 연결 필요:
  - 회원 정보 수정 API 호출
  - 저장 성공 시 상태 동기화(프로필 페이지/스토어)
  - 실패 시 에러 처리

## 5) 탈퇴 페이지

- 대상 화면: `src/pages/Profile/ProfileWithdraw.tsx`
- 현 상태:
  - 체크박스 2개 모두 체크 시 탈퇴 버튼 활성화
  - “돌아가기”는 history back
  - “탈퇴하기”는 동작 없음
- 연결 필요:
  - 회원 탈퇴 API 호출
  - 성공 시 로그아웃/세션 정리/로그인 페이지 이동
  - 실패 시 에러 처리
  - 필요 시 아이디 입력 검증 로직 추가(현재 readOnly)

## 6) 프로필 이미지 변경

- 대상 화면: `src/pages/Profile/Profile.tsx`, `src/pages/Profile/ProfileEdit.tsx`
- 현 상태: 버튼/이미지 UI만 존재
- 연결 필요:
  - 이미지 업로드 API
  - 업로드 성공 시 프로필 이미지 갱신

## 7) 같은 행사 참여자 보기 페이지 (임시 토글 제거)

- 대상 화면: `src/pages/EventParticipants/EventParticipants.tsx`
- 현 상태:
  - 빈 상태 확인을 위한 임시 토글 버튼 존재
  - 참여자 목록은 목데이터 사용
- 정리 필요(백엔드 연동 전):
  - 임시 토글 버튼 제거
  - 실제 참여자 API 데이터로 교체
