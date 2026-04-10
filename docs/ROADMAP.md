# 노션 견적서 공유 서비스 개발 로드맵

노션을 단일 데이터 소스로 활용하여, 견적서를 고유 링크로 공유하고 PDF로 수령할 수 있는 서비스

## 개요

노션 견적서 공유 서비스는 **1인 프리랜서 및 소규모 개발자/디자이너**를 위한 견적 공유 자동화 도구로 다음 기능을 제공합니다:

- **견적서 목록 조회**: 노션 데이터베이스에서 전체 견적서를 테이블로 조회
- **견적서 공유 링크**: 노션 페이지 ID 기반 고유 URL 생성 및 클립보드 복사
- **공개 뷰어 및 PDF**: 클라이언트가 링크로 접속하여 열람 및 PDF 다운로드

## 개발 워크플로우

1. **작업 계획**
   - 기존 코드베이스를 학습하고 현재 상태를 파악
   - 새로운 작업을 포함하도록 `ROADMAP.md` 업데이트
   - 우선순위 작업은 마지막 완료된 작업 다음에 삽입

2. **작업 생성**
   - `/tasks` 디렉토리에 새 작업 파일 생성
   - 명명 형식: `XXX-description.md` (예: `001-setup.md`)
   - 고수준 명세서, 관련 파일, 수락 기준, 구현 단계 포함
   - **API/비즈니스 로직 작업 시 "## 테스트 체크리스트" 섹션 필수 포함 (Playwright MCP 테스트 시나리오 작성)**
   - 예시를 위해 `/tasks` 디렉토리의 마지막 완료된 작업 참조. 예를 들어, 현재 작업이 `012`라면 `011`과 `010`을 예시로 참조.
   - 이러한 예시들은 완료된 작업이므로 내용이 완료된 작업의 최종 상태를 반영함 (체크된 박스와 변경 사항 요약). 새 작업의 경우, 문서에는 빈 박스와 변경 사항 요약이 없어야 함. 초기 상태의 샘플로 `000-sample.md` 참조.

3. **작업 구현**
   - 작업 파일의 명세서를 따름
   - 기능과 기능성 구현
   - **API 연동 및 비즈니스 로직 구현 시 Playwright MCP로 테스트 수행 필수**
   - 각 단계 완료 후 중단하고 추가 지시를 기다림

4. **로드맵 업데이트**
   - 로드맵에서 완료된 작업을 ✅로 표시

---

## 개발 단계

### Phase 1: 애플리케이션 골격 구축 ✅

- **Task 001: 프로젝트 초기화 및 기본 구조 설정** ✅ - 완료
  - ✅ 스타터킷 보일러플레이트 정리 (login, signup, sections 제거)
  - ✅ TypeScript 타입 정의 (`src/types/invoice.ts` — Invoice, InvoiceItem, InvoiceSummary)
  - ✅ 페이지 라우팅 골격 생성 (`/`, `/invoices/[id]`, `/view/[id]`)
  - ✅ 뷰어 전용 레이아웃 구성 (`src/app/view/layout.tsx` — Header/Footer 없음)
  - ✅ 노션 API 유틸리티 placeholder 생성 (`src/lib/notion.ts`)
  - ✅ 환경변수 스키마 설정 (`src/lib/env.ts` — NOTION_TOKEN, NOTION_DATABASE_ID)
  - ✅ CLAUDE.md, README.md PRD 기반 업데이트

---

### Phase 2: UI/UX 완성 (더미 데이터 활용) ✅

- **Task 002: 공통 UI 컴포넌트 구현** ✅ - 완료
  - ✅ 견적서 상태 뱃지 컴포넌트 (`InvoiceStatusBadge`) — 초안/발송됨/승인됨 색상 구분
  - ✅ 견적서 항목 테이블 컴포넌트 (`InvoiceItemTable`) — 품목명, 수량, 단가, 금액
  - ✅ 유효기간 만료 배너 컴포넌트 (`ExpiryBanner`) — 만료 여부에 따라 조건부 표시
  - ✅ 더미 데이터 유틸리티 생성 (`src/lib/dummy.ts`) — 개발 중 UI 검증용

- **Task 003: 견적서 목록 페이지 UI 완성** ✅ - 완료
  - ✅ 견적서 목록 테이블 레이아웃 구현 (클라이언트명, 총액, 생성일, 상태 컬럼)
  - ✅ 상태 뱃지 색상 구분 표시 (초안: gray, 발송됨: blue, 승인됨: green)
  - ✅ 새로고침 버튼 UI 구현 (아이콘 + 텍스트)
  - ✅ 목록 행 클릭 시 상세 페이지로 이동 (`/invoices/[id]`)
  - ✅ 빈 목록 상태(empty state) UI 처리

- **Task 004: 견적서 상세 페이지 UI 완성** ✅ - 완료
  - ✅ 견적서 항목 테이블 렌더링 (품목명, 수량, 단가, 금액)
  - ✅ 요약 정보 영역 (클라이언트명, 발행일, 유효기간, 총액)
  - ✅ 현재 상태 뱃지 표시
  - ✅ 링크 복사 버튼 UI 구현 (클립보드 아이콘 + 복사 완료 피드백)
  - ✅ 목록으로 돌아가기 버튼 구현

- **Task 005: 공개 뷰어 페이지 UI 완성** ✅ - 완료
  - ✅ 브랜딩 적용 견적서 레이아웃 (발행자 정보, 로고 영역, 항목 테이블, 합계)
  - ✅ 유효기간 배너 표시 (만료 전: 정보 배너, 만료 후: 경고 배너)
  - ✅ PDF 다운로드 버튼 UI 구현 (더미 클릭 이벤트)
  - ✅ 인쇄 친화적 스타일 적용 (`print:hidden` 클래스로 불필요한 UI 숨김)
  - ✅ 반응형 디자인 (모바일/태블릿/데스크톱)

---

### Phase 3: 핵심 기능 구현 ✅

- **Task 006: 노션 API 연동 구현** ✅ - 완료
  - ✅ `@notionhq/client` v5 설치 및 Client 초기화
  - ✅ `getInvoices()` — `dataSources.query` 사용, `InvoiceSummary[]` 반환
  - ✅ `getInvoiceById()` — 404 에러 처리 포함
  - ✅ `getInvoiceItems()` — 노션 테이블 블록 2단계 파싱
  - ✅ 노션 프로퍼티 파싱 헬퍼 (extractTitle, extractRichText, extractSelect, extractDate, extractNumber)
  - ✅ 3개 페이지(/, /invoices/[id], /view/[id]) 더미 데이터 → 실제 API 교체

- **Task 007: 고유 링크 생성 및 복사 기능 구현 (F003)** ✅ - 완료
  - ✅ NEXT_PUBLIC_APP_URL 환경변수 기반 URL 생성
  - ✅ Clipboard API + execCommand 폴백 처리
  - ✅ 복사 실패 시 sonner 토스트 알림 연동

- **Task 008: PDF 다운로드 구현 (F005)** ✅ - 완료
  - ✅ `@react-pdf/renderer` v4 설치
  - ✅ 맑은 고딕(MalgunGothic) 한글 폰트 등록 (public/fonts/)
  - ✅ `invoice-pdf.tsx` PDF 템플릿 컴포넌트 신규 구현
  - ✅ `pdf-download-button.tsx` 재구현 — 동적 import 패턴, 로딩 상태
  - ✅ 파일명 규칙: `견적서_[클라이언트명]_[발행일].pdf`

- **Task 008-1: 핵심 기능 통합 테스트** ✅ - 완료
  - ✅ `/` 목록 페이지 — 노션 실데이터 로딩 확인 (INV-2025-001, INV-2025-002)
  - ✅ `/invoices/[id]` 상세 페이지 — 항목 테이블(웹사이트 디자인, 로고 제작, 명함디자인) 확인
  - ✅ `/view/[id]` 공개 뷰어 — PDF 다운로드 버튼 및 유효기간 배너 확인
  - ✅ 존재하지 않는 ID 접속 시 not-found UI 렌더링 (400/404 모두 처리)
  - ✅ `npm run check-all` 전체 통과

---

### Phase 4: 고급 기능 및 최적화 ✅

- **Task 009: 캐싱 및 성능 최적화** ✅ - 완료 — [tasks/009-caching-performance.md](../tasks/009-caching-performance.md)
  - ✅ ISR(Incremental Static Regeneration) 설정 — `revalidate` 옵션으로 노션 데이터 캐싱
  - ✅ 견적서 목록 새로고침 버튼에 `revalidatePath` 연동 (Server Action)
  - ✅ 노션 API 오류 시 에러 바운더리로 폴백 UI 제공
  - ✅ `src/app/actions.ts` Server Action 신규 생성

- **Task 010: 배포 및 환경 설정** ✅ - 완료 — [tasks/010-deployment.md](../tasks/010-deployment.md)
  - ✅ Vercel 프로젝트 생성 및 환경변수 설정
  - ✅ `NOTION_TOKEN`, `NOTION_DATABASE_ID`, `NOTION_ITEMS_DATABASE_ID`, `NEXT_PUBLIC_APP_URL` Vercel 등록
  - ✅ 프로덕션 빌드 검증 (`npm run build`)
  - ✅ 배포 후 전체 기능 동작 확인

- **Task 011: Next.js 16 업그레이드 (DEP0169 수정)** ✅ - 완료 — [tasks/011-nextjs-upgrade.md](../tasks/011-nextjs-upgrade.md)
  - ✅ **원인**: Node.js v24 + Next.js 15.5.3 → `url.parse()` DEP0169 경고 발생
  - ✅ `next` → `^16.2.3` 업그레이드 (`eslint-config-next` 동일)
  - ✅ Breaking Change 확인 및 대응 (`eslint.config.mjs` Flat Config 방식 교체)
  - ✅ 전체 기능 회귀 테스트 (`npm run check-all` + `npm run build` 통과)

---

### Phase 5: 서비스 고도화

- **Task 012: 다크/라이트 모드 토글 구현 (F008)** - 진행 중
  - `next-themes` ThemeProvider 설정 검증 및 `enableSystem` 옵션 활성화
  - ✅ 관리자 레이아웃 상단바 우측에 `ThemeToggle` 버튼 배치 (라이트/다크/시스템 드롭다운)
  - ✅ 기존 `ThemeToggle` 컴포넌트(`src/components/theme-toggle.tsx`) 동작 확인
  - 관리자 영역(`/`, `/invoices/[id]`)과 공개 뷰어(`/view/[id]`) 모두 테마 적용 확인
  - 라이트/다크 모드 전환 시 모든 컴포넌트의 색상 대비(contrast) 검증
  - 사용자 테마 선택 `localStorage` 영속 저장 확인
  - Playwright MCP로 테마 전환 E2E 테스트 수행

- **Task 013: 견적서 목록 링크 복사 기능 추가 (F009)**
  - `InvoiceTable` 컴포넌트에 "링크 복사" 컬럼 추가 (테이블 마지막 컬럼)
  - 기존 `CopyLinkButton` 컴포넌트를 `size="sm"` `variant="ghost"`로 재활용
  - 행 클릭 이벤트와 링크 복사 버튼 클릭 이벤트 충돌 방지 (`e.stopPropagation()`)
  - 모바일 반응형 처리 — 좁은 화면에서 링크 복사 컬럼 표시 전략 (아이콘만 표시 또는 행 액션 메뉴)
  - 복사 성공 시 sonner 토스트 알림 표시 (기존 CopyLinkButton 로직 활용)
  - Playwright MCP로 목록 페이지 링크 복사 E2E 테스트 수행

- **Task 014: 관리자 레이아웃 개선 (F010)** ✅ - 완료
  - ✅ `app/(admin)/layout.tsx` 생성 — `(admin)` route group 기반 관리자 전용 레이아웃
  - ✅ `src/components/layout/admin-sidebar.tsx` 생성 — 사이드바 네비게이션 (navItems 배열 확장 방식)
  - ✅ 상단바 리팩토링 — 로고 + ThemeToggle 배치, 기존 Header 컴포넌트 대체
  - ✅ 사이드바 + 메인 콘텐츠 2단 레이아웃 적용
  - ✅ 모바일 반응형 — 사이드바를 Sheet(드로어)로 전환
  - ✅ 공개 뷰어(`/view/[id]`)는 기존 단독 레이아웃 유지
  - ✅ `/`, `/invoices/[id]`, `/dashboard` 페이지에 관리자 레이아웃 자동 적용
  - Playwright MCP로 관리자 레이아웃 네비게이션 및 반응형 E2E 테스트 수행

- **Task 015: 견적서 대시보드 추가 (F011)** ✅ - 완료
  - ✅ `/dashboard` 신규 라우트 생성 (`app/(admin)/dashboard/page.tsx`)
  - ✅ 사이드바에 '대시보드' 메뉴 항목 추가 (`admin-sidebar.tsx`)
  - ✅ 통계 카드 컴포넌트 — 전체 건수, 총 견적 금액, 발송됨 건수, 승인됨 건수
  - ✅ 최근 견적서 5건 테이블 컴포넌트
  - ✅ 만료 임박 알림 컴포넌트 — 오늘 기준 7일 이내 만료 예정 및 만료된 견적서

- **Task 014-1: 고도화 통합 테스트**
  - Playwright MCP를 사용한 전체 사용자 플로우 테스트 (관리자 + 클라이언트 시나리오)
  - 다크/라이트 모드 전환 후 모든 페이지 시각적 검증
  - 목록 페이지 링크 복사 → 공개 뷰어 접속 플로우 테스트
  - 관리자 레이아웃 네비게이션 및 사이드바 동작 테스트
  - 모바일/태블릿/데스크톱 반응형 레이아웃 테스트
  - `npm run check-all` 및 `npm run build` 전체 통과 확인

---

## 기능 ID 매핑

| 기능 ID  | 기능명                          | 구현 Task  | 상태     |
| -------- | ------------------------------- | ---------- | -------- |
| **F001** | 노션 견적서 목록 조회           | Task 006   | ✅ 완료  |
| **F002** | 견적서 상세 조회                | Task 006   | ✅ 완료  |
| **F003** | 고유 링크 생성 및 복사          | Task 007   | ✅ 완료  |
| **F004** | 견적서 공개 뷰어 렌더링         | Task 005   | ✅ 완료  |
| **F005** | PDF 다운로드                    | Task 008   | ✅ 완료  |
| **F006** | 견적서 상태 표시                | Task 002   | ✅ 완료  |
| **F007** | 견적서 유효기간 표시            | Task 002   | ✅ 완료  |
| **F008** | 다크/라이트 모드 토글           | Task 012   | 진행 중  |
| **F009** | 목록 페이지 링크 복사           | Task 013   | 대기     |
| **F010** | 관리자 전용 레이아웃            | Task 014   | ✅ 완료  |
| **F011** | 견적서 대시보드                 | Task 015   | ✅ 완료  |

---

**최종 업데이트**: 2026-04-10
**진행 상황**: Phase 1~4 완료 (11/11 Tasks) / Phase 5 진행 중 (2/5 Tasks 완료, 1/5 진행 중)
