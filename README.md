# ONMOIM
> **행사 초대장 제작·공유·참여 조사 웹 서비스 ONMOIM 프론트엔드 레포지토리입니다.**

## Role & Responsibilities
| 닉네임 | 담당 파트 |
| :---: | :---: |
| **칠판** | **메인 / 분석 페이지** |
| **도비** | **프로필 / 참여자 페이지** |
| **카야** | **로그인 / 이벤트 생성 페이지** | 

<br/>

## Convention Rules

### 1. Commit Message Strategy
커밋 메시지는 아래 규칙을 따릅니다.
> `[태그]: 설명` 형식으로 작성 (예: `feat: 메인 페이지 레이아웃 구현`)

| 태그 | 설명 |
| :--- | :--- |
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `design` | CSS 등 UI 디자인 변경 |
| `refactor` | 코드 리팩토링 (기능 변경 없음) |
| `chore` | 빌드 업무, 패키지 매니저 설정 등 |
| `docs` | 문서 수정 (README 등) |

### 2. Branch Naming Strategy
브랜치는 작업의 흐름을 한눈에 파악할 수 있도록 3단계 계층 구조를 사용합니다.
> **`{작업자}/{유형}/{작업-내용}`** (예: `chillpan/design/common-components`)

| 구분 | 설명 | 예시 |
| :--- | :--- | :--- |
| **작업자** | 본인의 닉네임을 소문자로 작성 | `chillpan`, `dobby`, `kaya` |
| **유형** | 작업의 성격에 맞는 태그 작성 | `feat`, `design`, `fix`, `refactor` |
| **작업 내용** | 하이픈(`-`)을 사용하여 소문자로 간결하게 작성 | `common-components`, `profile-api` |

---
**유형별 상세 구분**
- `feat`: 새로운 기능 개발
- `design`: UI/UX 스타일 작업 및 컴포넌트 제작
- `fix`: 버그 및 오류 수정
- `refactor`: 기능 변화 없는 코드 구조 개선
- `docs`: README 등 문서 수정

