# UI/UX 개선 설계 문서

**날짜:** 2026-04-09  
**범위:** 컨테이너 폭 통일, 테이블 간격 개선, 전체 모던 UI 개선  
**접근 방식:** 옵션 B (중간 수정)

---

## 1. 개요

### 목표

- 전체 컨테이너 폭을 `max-w-4xl`로 통일하여 일관성 확보
- 견적 항목 테이블 셀 간격을 여유롭게 조정
- 카드, 그리드, 총액 영역 등 세부 UI 모던화

### 변경 대상 파일

- `src/components/layout/container.tsx`
- `src/components/invoice/invoice-item-table.tsx`
- `src/app/page.tsx`
- `src/app/invoices/[id]/page.tsx`
- `src/app/view/[id]/page.tsx`

---

## 2. 섹션 1 — 컨테이너 폭 통일

### 변경 내용

`Container` 컴포넌트의 `md` 사이즈를 `max-w-5xl` → `max-w-4xl`로 변경한다.

```typescript
// src/components/layout/container.tsx
const sizes = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl', // 변경: max-w-5xl → max-w-4xl
  lg: 'max-w-7xl', // 유지 (헤더/푸터용)
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
}
```

### 각 페이지 적용

| 위치             | 현재               | 변경 후                         |
| ---------------- | ------------------ | ------------------------------- |
| 헤더 (`Header`)  | `lg` (`max-w-7xl`) | `lg` 유지                       |
| 푸터 (`Footer`)  | `lg` (`max-w-7xl`) | `lg` 유지                       |
| `/` 홈 콘텐츠    | `lg` (`max-w-7xl`) | `md` (`max-w-4xl`)              |
| `/invoices/[id]` | `md` (`max-w-5xl`) | `md` (`max-w-4xl`, 자동 반영)   |
| `/view/[id]`     | 직접 `max-w-4xl`   | `<Container size="md">` 로 통일 |

### 핵심 결정

- 헤더/푸터는 `lg`를 유지한다. 전체 너비 네비게이션이 더 자연스럽기 때문이다.
- `/` 홈의 Container를 `lg` → `md`로 변경한다.
- `/view/[id]`는 현재 Container 컴포넌트 없이 직접 클래스를 쓰므로 Container로 교체한다.

---

## 3. 섹션 2 — 견적 항목 테이블 간격 개선

### 변경 내용

`src/components/invoice/invoice-item-table.tsx`의 셀 패딩 및 스타일 강화.

#### TableHead

```tsx
// 변경 전
<TableHead>항목명</TableHead>
<TableHead className="text-right">수량</TableHead>

// 변경 후
<TableHead className="px-6 py-4 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
  항목명
</TableHead>
<TableHead className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-muted-foreground uppercase">
  수량
</TableHead>
```

#### TableCell (바디)

```tsx
// 변경 전
<TableCell>{item.itemName}</TableCell>
<TableCell className="text-right">{item.quantity}</TableCell>

// 변경 후
<TableCell className="px-6 py-4">{item.itemName}</TableCell>
<TableCell className="px-6 py-4 text-right">{item.quantity}</TableCell>
```

#### TableFooter (합계 행)

```tsx
// 변경 전
<TableRow>
  <TableCell colSpan={3} className="font-semibold">합계</TableCell>
  <TableCell className="text-right font-semibold">...</TableCell>
</TableRow>

// 변경 후
<TableRow>
  <TableCell colSpan={3} className="px-6 py-4 text-base font-bold">합계</TableCell>
  <TableCell className="px-6 py-4 text-right text-base font-bold">...</TableCell>
</TableRow>
```

#### 래퍼 (`Table` 감싸는 div)

```tsx
// 변경 전 (invoice-item-table 에는 래퍼 없음, 카드 내부에서 px-0)
// 변경 후: table 자체에 border 제거하고 카드 내부에서 자연스럽게 렌더링
```

---

## 4. 섹션 3 — 카드 및 전체 UI 모던화

### `/invoices/[id]` 상세 페이지

- 날짜/금액 정보 그리드에 `bg-muted/30 rounded-lg p-5` 추가 → 데이터 구역 배경 강조
- 카드 내 Separator 위아래 여백 확보
- 총액을 `text-xl font-bold text-primary`로 강조

```tsx
// 변경 전
<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">

// 변경 후
<div className="grid grid-cols-1 gap-6 rounded-lg bg-muted/30 p-5 sm:grid-cols-3">
```

### `/` 홈 목록 페이지

- 페이지 타이틀 영역에 `border-b pb-6 mb-6` 추가 → 타이틀과 테이블 구분감
- Container를 `size="md"`로 변경

```tsx
// 변경 전
<div className="mb-6 flex items-start justify-between">

// 변경 후
<div className="mb-6 flex items-start justify-between border-b pb-6">
```

### `/view/[id]` 공개 뷰어

- `<main className="mx-auto max-w-4xl px-4 ...">` → `<Container size="md">` 로 교체
- 총액 박스: `bg-muted/50` → `bg-primary/5 border-primary/20`으로 브랜드 컬러 연동
- 섹션 간격: `space-y-8` → `space-y-10`으로 확대

```tsx
// 변경 전
<div className="bg-muted/50 rounded-lg border p-4 md:p-6">

// 변경 후
<div className="rounded-lg border border-primary/20 bg-primary/5 p-4 md:p-6">
```

---

## 5. 변경 범위 요약

| 파일                        | 변경 유형 | 내용                                           |
| --------------------------- | --------- | ---------------------------------------------- |
| `container.tsx`             | 수정      | `md` 사이즈 `max-w-5xl` → `max-w-4xl`          |
| `invoice-item-table.tsx`    | 수정      | 셀 패딩 `py-4 px-6`, 헤더 uppercase, 합계 bold |
| `page.tsx` (홈)             | 수정      | Container `size="md"`, 타이틀 border-b         |
| `[id]/page.tsx` (상세)      | 수정      | 정보 그리드 배경, 총액 강조                    |
| `view/[id]/page.tsx` (뷰어) | 수정      | Container 교체, 총액 박스 컬러, 간격 확대      |

## 6. 비변경 범위

- 헤더/푸터 구조 및 폭 (기능 변경 없음)
- 라우팅 구조
- 데이터 패칭 로직
- 타입 정의

---

## 7. 체크리스트

- [ ] `container.tsx` `md` 사이즈 변경
- [ ] `/` 홈 Container `size="md"` 적용 + 타이틀 border-b
- [ ] `invoice-item-table.tsx` 셀 패딩/스타일 개선
- [ ] `/invoices/[id]` 정보 그리드 배경 + 총액 강조
- [ ] `/view/[id]` Container 교체 + 총액 박스 + 간격 확대
- [ ] `npm run check-all` 통과
- [ ] `npm run build` 성공
