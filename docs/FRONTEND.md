# 프론트엔드 가이드

최신 develop branch : 01/31

---

## 1. 에셋 (로고, 이미지)

- Figma에서 로고·이미지 등을 내려받아 사용한다.
- 공용 에셋: `src/assets/` (아이콘 등), `public/fonts/` (Pretendard JP Variable 폰트).

---

## 2. 디자인 토큰

CSS 하드코딩을 줄이기 위해 **디자인 토큰**을 사용한다.  
토큰 정의: **`src/index.css`** 내 `@theme { ... }` 블록.

### 2.1 토큰 종류

| 구분 | 내용 |
|------|------|
| **색상** | Gray, Primary, Red, Teal, Purple, Blue, Orange, Pink, Stone, Link 등 (`--color-*`) |
| **간격** | `--spacing-nav-bar-to-buttons` (네비바 ↔ 버튼 66.5px) 등 |
| **Radius** | `--radius-0` ~ `--radius-16`, `--radius-circle` |
| **타이포** | H1~H7, Caption 10pt (`--font-size-h*`, `--font-size-caption-10pt`) |

### 2.2 사용 예시

- **Tailwind로 색/간격 사용**  
  - 색: `text-red-500`, `bg-primary-100`, `border-gray-600`  
  - 간격(토큰): `pt-nav-bar-to-buttons` (theme에 정의된 spacing)
- **타이포**  
  - 클래스: `text-h6`, `text-caption-10pt` (index.css에 유틸 클래스 정의됨)
- **직접 CSS 변수**  
  - `var(--color-red-500)`, `var(--spacing-nav-bar-to-buttons)` (필요 시)

---

## 3. 레이아웃·공통 컴포넌트

### 3.1 공통 레이아웃

- **`src/components/Layout.tsx`**  
  - 상단: **NavBar** (로고, 이벤트 생성하기, 알림, 프로필)
  - 그 아래: **main**(페이지 콘텐츠) + **aside**(오른쪽 고정)
  - aside: **문의하기**, **분석하기** 버튼 세로 배치, 네비바와 세로 간격 66.5px (`pt-nav-bar-to-buttons`)

### 3.2 공통 컴포넌트 (`src/components/common/`)

| 컴포넌트 | 설명 |
|----------|------|
| **NavBar** | 상단 네비게이션 (로고, 이벤트 생성하기, 알림, 프로필) |
| **Layout** | NavBar + main + aside(문의하기/분석하기) 구조 |
| **InquiryButton** | 문의하기 버튼 (Figma 스펙: 179×58, pill 형태) |
| **AnalyzeButton** | 분석하기 버튼 (동일 스타일) |

- **공통으로 쓰는 UI는 `src/components/`(또는 `common/`)에 두고, 페이지 전용은 각 페이지의 `components/`에 둔다.**

### 3.3 페이지별 컴포넌트

- 각 페이지 폴더 안에 **`components/`** 폴더를 두고, 해당 페이지에서만 쓰는·중복되는 요소를 넣어 재사용한다.
- 예: `src/pages/EventCreate/components/`, `src/pages/Profile/components/` 등.

---

## 4. API 테스트 페이지

| 경로 | 용도 |
|------|------|
| **`/test`** | **TestPage Kaya** — auth, event API 테스트 |
| **`/test-other`** | **TestPage** — eventInfo, analysis, profile API 테스트 |

주소창에 위 경로 입력 후 이동하면 된다.

---

## 5. 폰트

- **Pretendard JP Variable** (`public/fonts/PretendardJPVariable.ttf`)
- `index.css`에서 `@font-face`로 등록되어 있으며, `@theme`의 `--font-family-sans`로 전역 적용된다.
