# 메인페이지 구현에 있어 백엔드 API 요구사항 정리 (프론트엔드 → 백엔드 전달용)

메인 페이지·알람 UI 완성을 위해 필요한 API 및 기존 API 보완 사항을 정리한 문서입니다.

---

## 1. 신규 API 요청

아래 API는 현재 명세/백엔드에 없어서 새로 구현이 필요할 것 같습니다..!

### 1. 메인 페이지

1. **내가 참여한 행사 목록**

   - 메서드: **GET**
   - 경로: `/api/v1/users/events/joined`
   - 용도: "참여한 행사" 탭 + "같은 행사에 참여한 분들" 아래에 나열할 리스트를 불러오기 위해 필요합니다.
     로그인 사용자가 참여한 행사 목록. 각 항목에 `eventId` 포함 필요.

2. **전체 행사 참여자 (행사 목록 전체 조회)**
   - 용도: 메인 상단 등 "전체 행사 참여자" 수/목록 표시.
     프론트단에서 구현은 디스코드에서 메시지 보냈던 형식으로 목데이터 뽑아서 UI 구현했음

---

## 2. 기존 API 응답 보완 요청

이미 있는 API이지만, 이미지url이나 호스트 이름 등이 필요합니다!

4. **행사 목록 전체체 조회**

   - 보완 내용: 응답 `data[]` 각 항목에 **imageUrl**, **hostName**

5. **행사 단건 조회**

   - 메서드: GET
   - 경로: `/api/v1/users/events/{eventId}`
   - 내용: 응답 `data`에 **imageUrl**, **hostName** 필드 **추가**

   필요 스펙:

   - `imageUrl`: string, nullable. 행사 대표 이미지 URL. 미리보기·카드용.
   - `hostName`: string, nullable. 호스트(개최자) 이름.

---

## 3. 알람(알림) API 상세 명세

네비게이션 바 알람 아이콘 클릭 시 열리는 **알람 모달** UI를 구현하기 위해 필요한 **신규 API**입니다!

6. **알람 목록 조회**

   - 메서드: **GET**
   - 경로: `/api/v1/notifications`
   - 용도: 안 읽음/읽음 모달 창의 리스트용.
   - 쿼리 파라미터 제안:
     - `status`: string, 선택. `unread` | `read` | 미지정 시 전체.
     - `page`: number, 선택. 페이지 번호 (기본값 1).
     - `limit`: number, 선택. 페이지당 개수 (기본값 20 등).
   - 응답 data (배열) 각 항목 필드:
     - `id`: string, 필수. 알림 고유 ID.
     - `message`: string, 필수. 알림 본문 (예: "행사 정보가 변경되었습니다.").
     - `createdAt`: string, 필수. ISO 8601 (표시용: "1월 12일" 등으로 포맷).
     - `isRead`: boolean, 필수. 읽음 여부.
     - `eventId`: number, 선택. 연관 행사 ID (클릭 시 해당 행사로 이동용).

7. **안 읽음 개수 조회**

   - 메서드: **GET**
   - 경로: `/api/v1/notifications/unread/count`
   - 용도: 알람 아이콘 배지 숫자, 탭 "안 읽음 (N)" 표시.

8. **단일 알람 읽음 처리**

   - 메서드: **PATCH**
   - 경로: `/api/v1/notifications/{notificationId}/read`
   - 용도: 알림 카드 클릭 시 해당 알림만 읽음 처리.

9. **전체 읽음 처리**
   - 메서드: **PATCH**
   - 경로: `/api/v1/notifications/mark-all-as-read`
   - 용도: 모달 내 "모두 읽음 처리" 버튼.

---
