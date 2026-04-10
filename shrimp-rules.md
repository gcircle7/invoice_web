# Development Guidelines — 노션 견적서 공유 서비스

## 1. 프로젝트 개요

- **목적**: 노션 데이터베이스를 단일 데이터 소스로 활용, 견적서를 고유 링크로 공유하고 PDF 수령
- **기술 스택**: Next.js 15.5.3 (App Router + Turbopack) / React 19 / TypeScript 5 / TailwindCSS v4 / shadcn/ui (new-york)
- **외부 의존성**: `@notionhq/client` (노션 API), `@react-pdf/renderer` (PDF 생성)
- **현재 상태**: Phase 1 완료 (골격 구축). Phase 2 진행 중 (UI/UX 완성 — 더미 데이터 활용)

---

## 2. 라우팅 구조 및 파일 위치

| 경로             | 파일                             | 역할                           | 레이아웃                                |
| ---------------- | -------------------------------- | ------------------------------ | --------------------------------------- |
| `/`              | `src/app/page.tsx`               | 견적서 목록 (F001, F006)       | 루트 레이아웃 (Header/Footer 포함)      |
| `/invoices/[id]` | `src/app/invoices/[id]/page.tsx` | 견적서 상세 (F002, F003, F006) | 루트 레이아웃                           |
| `/view/[id]`     | `src/app/view/[id]/page.tsx`     | 공개 뷰어 (F004, F005, F007)   | 뷰어 전용 레이아웃 (Header/Footer 없음) |

- **레이아웃 파일**: `src/app/layout.tsx` (루트), `src/app/view/layout.tsx` (뷰어 전용)
- **뷰어 레이아웃은 절대 수정하지 말 것**: Header/Footer가 없는 구조가 의도적 설계

---

## 3. 핵심 파일 수정 규칙

### src/types/invoice.ts

- `Invoice`, `InvoiceItem`, `InvoiceSummary`, `InvoiceStatus` 타입 정의
- **상태값 변경 금지**: `InvoiceStatus = '대기' | '발송됨' | '승인됨'` — 노션 DB와 1:1 매핑
- 새 타입 추가 시 이 파일에만 추가, 페이지나 컴포넌트 파일에 인라인 타입 선언 금지

### src/lib/notion.ts

- **노션 API 호출은 이 파일에서만 수행** — 페이지/컴포넌트에서 직접 호출 절대 금지
- `@notionhq/client` 임포트 및 `notion` 클라이언트 인스턴스는 이 파일에만 존재
- 이 파일의 함수들은 서버 컴포넌트에서만 호출 (클라이언트 컴포넌트 호출 금지)
- 함수 추가 시 패턴 유지: `export async function getXxx(): Promise<Type>`

### src/lib/env.ts

- 환경변수 접근은 반드시 `import { env } from '@/lib/env'`를 통해서만
- `process.env.XXX` 직접 접근 금지 (env.ts에서 Zod 검증 후 사용)
- 새 환경변수 추가 시: `envSchema`에 추가 → `.env.example`에 추가 (동시 수행 필수)

### src/lib/utils.ts

- `cn()` 유틸리티 함수 위치 — TailwindCSS 클래스 병합용
- 새 공통 유틸리티는 이 파일 또는 `src/lib/[name]-utils.ts` 형태로 추가

---

## 4. 컴포넌트 배치 규칙

```
src/components/
├── ui/           → shadcn/ui 기반 순수 UI (비즈니스 로직 없음, props로만 제어)
├── layout/       → 레이아웃 (Header, Footer, Container)
├── navigation/   → 네비게이션 (MainNav, MobileNav)
├── invoice/      → 견적서 도메인 컴포넌트 (신규 추가 예정)
│   ├── invoice-status-badge.tsx   (F006)
│   ├── invoice-item-table.tsx     (F002)
│   └── expiry-banner.tsx          (F007)
└── providers/    → Context Provider
```

**배치 결정 기준:**

- 견적서 도메인 관련 → `src/components/invoice/`
- 여러 페이지 공통 순수 UI → `src/components/ui/`
- 특정 페이지에서만 사용하는 복잡한 컴포넌트 → 해당 페이지 폴더 내 (예: `src/app/invoices/[id]/_components/`)

**파일 네이밍**: kebab-case (`invoice-status-badge.tsx`)
**컴포넌트 네이밍**: PascalCase (`export function InvoiceStatusBadge()`)

---

## 5. Notion API 사용 규칙

- **서버 컴포넌트 전용**: `notion.ts` 함수는 `page.tsx` (서버 컴포넌트)에서만 호출
- `'use client'` 선언된 파일에서 `notion.ts` 함수 호출 절대 금지
- 노션 API 응답의 snake_case 필드는 반드시 camelCase로 변환 후 `Invoice` 타입으로 반환
- 노션 페이지 UUID = 공개 링크 슬러그 (`/view/[notion-page-id]`)

---

## 6. PDF 생성 규칙

- `@react-pdf/renderer`는 **클라이언트 전용**
- PDF 컴포넌트 파일 최상단에 반드시 `'use client'` 선언
- 페이지에서 사용 시 반드시 `dynamic(import, { ssr: false })` 적용

```typescript
// ✅ 올바른 패턴
const PDFDownloadButton = dynamic(
  () => import('@/components/invoice/pdf-download-button'),
  { ssr: false }
)
```

---

## 7. Next.js 15 필수 규칙

### params는 반드시 await

```typescript
// ✅ 올바른 패턴
export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
}

// ❌ 금지 패턴
export default function InvoicePage({ params }: { params: { id: string } }) {
  const { id } = params // Next.js 15에서 오류 발생
}
```

### Server Actions

- Server Action은 `'use server'` 선언 필요
- 폼 처리는 `React Hook Form + Zod + Server Action` 조합 사용

---

## 8. 더미 데이터 사용 규칙 (Phase 2)

- 더미 데이터 유틸리티 위치: `src/lib/dummy.ts`
- UI 개발 중 노션 API 미연동 시 더미 데이터 사용
- Phase 3 (노션 API 연동) 완료 후 더미 데이터 임포트 제거 필수
- 더미 데이터는 `Invoice` / `InvoiceItem` 타입을 완전히 준수해야 함

---

## 9. 환경변수

| 변수명                | 용도           | 접근                                 |
| --------------------- | -------------- | ------------------------------------ |
| `NOTION_TOKEN`        | 노션 API 인증  | 서버 전용 (`env.NOTION_TOKEN`)       |
| `NOTION_DATABASE_ID`  | 견적서 DB ID   | 서버 전용 (`env.NOTION_DATABASE_ID`) |
| `NEXT_PUBLIC_APP_URL` | 공개 링크 생성 | 클라이언트/서버 모두 가능            |

- `NEXT_PUBLIC_` 접두사 없는 변수는 클라이언트 번들에 절대 노출 금지

---

## 10. 스타일링 규칙

- **TailwindCSS v4** 사용 — `tailwind.config.*` 파일 없음, `globals.css`에서 설정
- 클래스 병합 시 반드시 `cn()` 사용 (`import { cn } from '@/lib/utils'`)
- 인라인 style 속성 사용 금지 (TailwindCSS 클래스로 대체)
- 인쇄 대응: `print:hidden` 클래스로 출력 불필요 UI 숨김

---

## 11. 경로 별칭

- 항상 `@/` 경로 별칭 사용, 상대경로(`../`) 사용 금지
- `@/components`, `@/lib`, `@/types`, `@/app`

---

## 12. 파일 동시 수정 필수 규칙

| 수정 대상                                         | 동시 수정 필요 파일                              |
| ------------------------------------------------- | ------------------------------------------------ |
| 환경변수 추가 (`src/lib/env.ts`)                  | `.env.example`                                   |
| `InvoiceStatus` 값 변경 (`src/types/invoice.ts`)  | `src/lib/notion.ts` (파싱 로직), 관련 컴포넌트   |
| 노션 API 함수 시그니처 변경 (`src/lib/notion.ts`) | 호출하는 모든 `page.tsx`                         |
| 라우트 추가/변경                                  | `docs/ROADMAP.md` (기능 ID 매핑 테이블 업데이트) |

---

## 13. 작업 완료 검증

```bash
npm run check-all   # ESLint + TypeScript + Prettier 통합 검사
npm run build       # 프로덕션 빌드 성공 확인
```

- **모든 작업 완료 후 위 명령어를 실행하여 오류 없음 확인 필수**
- Playwright MCP 테스트: API 연동 및 비즈니스 로직 구현 시 필수 수행

---

## 14. 금지 사항

- `process.env.XXX` 직접 접근 — `env.ts`를 통해서만
- 클라이언트 컴포넌트에서 `notion.ts` 함수 호출
- `@react-pdf/renderer`를 SSR 환경에서 임포트
- `params`를 `await` 없이 직접 구조분해
- 상대 경로 import (`../`)
- `src/components/ui/` 내 비즈니스 로직 포함
- `InvoiceStatus` 값을 `'대기' | '발송됨' | '승인됨'` 외 문자열로 변경
- 노션 API 호출을 `src/lib/notion.ts` 외 파일에서 수행
- `src/app/view/layout.tsx`에 Header/Footer 추가
- 파일명에 snake_case 또는 PascalCase 사용 (kebab-case만 허용)
- 단일 파일 300줄 초과 (초과 시 분할)
