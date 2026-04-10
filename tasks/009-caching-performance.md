# Task 009: 캐싱 및 성능 최적화

## 개요

Next.js의 ISR(Incremental Static Regeneration)과 Server Action을 활용하여 노션 API 호출을 캐싱하고, 새로고침 버튼에 캐시 무효화를 연동한다. 또한 노션 API 오류 시 에러 바운더리로 폴백 UI를 제공한다.

## 관련 파일

- `src/app/page.tsx` — 견적서 목록 페이지 (ISR 적용)
- `src/app/invoices/[id]/page.tsx` — 견적서 상세 페이지 (ISR 적용)
- `src/app/view/[id]/page.tsx` — 공개 뷰어 페이지 (ISR 적용)
- `src/components/invoice/refresh-button.tsx` — 새로고침 버튼 (revalidatePath 연동)
- `src/lib/notion.ts` — 노션 API 함수
- `src/app/actions.ts` — Server Action 신규 생성
- `src/app/error.tsx` — 에러 바운더리 신규 생성
- `src/app/invoices/[id]/error.tsx` — 상세 페이지 에러 바운더리 신규 생성

## 수락 기준

- [ ] 목록 페이지(`/`)에 `export const revalidate = 60` 설정 — 60초마다 노션 데이터 갱신
- [ ] 상세 페이지(`/invoices/[id]`)에 `export const revalidate = 60` 설정
- [ ] 공개 뷰어(`/view/[id]`)에 `export const revalidate = 300` 설정 — 5분 캐시 (클라이언트 접속용)
- [ ] `src/app/actions.ts`에 `revalidateInvoices` Server Action 구현 — `revalidatePath('/')` 호출
- [ ] `RefreshButton`이 Server Action을 호출하여 캐시를 무효화하고 최신 데이터를 가져옴
- [ ] `src/app/error.tsx` 에러 바운더리 구현 — 노션 API 장애 시 폴백 UI 표시
- [ ] `npm run check-all` 전체 통과

## 구현 단계

### 단계 1: ISR 설정

각 페이지 파일에 `revalidate` 상수를 추가한다.

**`src/app/page.tsx`** 상단에 추가:
```ts
export const revalidate = 60 // 60초마다 재검증
```

**`src/app/invoices/[id]/page.tsx`** 상단에 추가:
```ts
export const revalidate = 60
```

**`src/app/view/[id]/page.tsx`** 상단에 추가:
```ts
export const revalidate = 300 // 공개 뷰어는 5분 캐시
```

### 단계 2: Server Action 생성

`src/app/actions.ts` 신규 생성:

```ts
'use server'

import { revalidatePath } from 'next/cache'

// 견적서 목록 캐시 무효화 — RefreshButton에서 호출
export async function revalidateInvoices() {
  revalidatePath('/')
}
```

### 단계 3: RefreshButton에 Server Action 연동

`src/components/invoice/refresh-button.tsx`를 수정하여:
- `revalidateInvoices` Server Action import
- `onClick`에서 Server Action 호출
- 로딩 상태(`isPending`) 표시 — `useTransition` 사용
- 새로고침 중 아이콘 회전 애니메이션

### 단계 4: 에러 바운더리 구현

`src/app/error.tsx` 신규 생성 (Next.js App Router 규약):
- `'use client'` 지시어 필수
- `error`, `reset` props 수신
- 사용자 친화적 에러 메시지 표시
- "다시 시도" 버튼으로 `reset()` 호출

## 테스트 체크리스트

- [ ] `npm run dev` 실행 후 목록 페이지 정상 로딩 확인
- [ ] 새로고침 버튼 클릭 시 로딩 스피너 표시 → 최신 데이터 로드 확인
- [ ] `.env.local`에서 `NOTION_TOKEN` 제거 후 에러 바운더리 UI 렌더링 확인 (복원 후 테스트)
- [ ] `npm run check-all` 전체 통과
