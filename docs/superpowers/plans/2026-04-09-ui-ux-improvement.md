# UI/UX 개선 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 컨테이너 폭 통일(`max-w-4xl`), 견적 항목 테이블 간격 개선, 전체 UI 모던화를 통해 일관되고 세련된 인터페이스를 구현한다.

**Architecture:** Container 컴포넌트의 `md` 사이즈를 `max-w-4xl`로 변경하여 콘텐츠 페이지에 통일된 폭을 적용하고, 각 페이지와 컴포넌트에 개별 스타일 개선을 순차 적용한다.

**Tech Stack:** Next.js 15.5.3 App Router, TailwindCSS v4, shadcn/ui (new-york style), TypeScript 5

---

## 파일 맵

| 파일                                            | 작업 유형 | 내용                                           |
| ----------------------------------------------- | --------- | ---------------------------------------------- |
| `src/components/layout/container.tsx`           | 수정      | `md` 사이즈 `max-w-5xl` → `max-w-4xl`          |
| `src/app/page.tsx`                              | 수정      | Container `size="md"`, 타이틀 영역 `border-b`  |
| `src/components/invoice/invoice-item-table.tsx` | 수정      | 셀 패딩 `py-4 px-6`, 헤더 uppercase, 합계 bold |
| `src/app/invoices/[id]/page.tsx`                | 수정      | 정보 그리드 배경, 총액 강조                    |
| `src/app/view/[id]/page.tsx`                    | 수정      | Container 교체, 총액 박스 컬러, 섹션 간격 확대 |

---

## Task 1: Container `md` 사이즈 변경

**Files:**

- Modify: `src/components/layout/container.tsx`

- [ ] **Step 1: 파일 수정**

`src/components/layout/container.tsx` 의 `md` 값을 변경한다:

```tsx
import { cn } from '@/lib/utils'

interface ContainerProps {
  children: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
}

export function Container({
  children,
  className,
  size = 'lg',
}: ContainerProps) {
  const sizes = {
    sm: 'max-w-3xl',
    md: 'max-w-4xl',
    lg: 'max-w-7xl',
    xl: 'max-w-[1400px]',
    full: 'max-w-full',
  }

  return (
    <div
      className={cn(
        'mx-auto w-full px-4 sm:px-6 lg:px-8',
        sizes[size],
        className
      )}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run check-all
```

Expected: 오류 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add src/components/layout/container.tsx
git commit -m "style: Container md 사이즈를 max-w-4xl로 변경"
```

---

## Task 2: 홈 목록 페이지 Container 폭 적용 및 타이틀 스타일

**Files:**

- Modify: `src/app/page.tsx`

- [ ] **Step 1: 파일 수정**

`src/app/page.tsx` 의 Container `size`를 `"md"`로, 타이틀 영역에 `border-b pb-6`을 추가한다:

```tsx
// 견적서 목록 페이지 — 관리자가 직접 접속하는 메인 페이지
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Container } from '@/components/layout/container'
import { InvoiceTable } from '@/components/invoice/invoice-table'
import { RefreshButton } from '@/components/invoice/refresh-button'
import { DUMMY_INVOICES } from '@/lib/dummy'

export default async function HomePage() {
  // TODO: const invoices = await getInvoices() — 노션 API 연동 후 교체 예정
  const invoices = DUMMY_INVOICES

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Container size="md">
          <div className="py-8">
            {/* 페이지 타이틀, 설명, 새로고침 버튼을 같은 행에 배치 */}
            <div className="mb-6 flex items-start justify-between border-b pb-6">
              <div>
                <h1 className="text-2xl font-bold">견적서 목록</h1>
                <p className="text-muted-foreground mt-1 text-sm">
                  노션 데이터베이스에 연동된 견적서를 확인합니다.
                </p>
              </div>
              {/* 새로고침 버튼 — 클라이언트 컴포넌트로 분리 */}
              <RefreshButton />
            </div>
            {/* 견적서 목록 테이블 */}
            <InvoiceTable invoices={invoices} />
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run check-all
```

Expected: 오류 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add src/app/page.tsx
git commit -m "style: 홈 페이지 컨테이너 폭 md 적용 및 타이틀 border-b 추가"
```

---

## Task 3: 견적 항목 테이블 간격 및 스타일 개선

**Files:**

- Modify: `src/components/invoice/invoice-item-table.tsx`

- [ ] **Step 1: 파일 수정**

`src/components/invoice/invoice-item-table.tsx` 전체를 아래로 교체한다:

```tsx
// 견적서 항목 목록을 테이블 형태로 표시하는 컴포넌트
// 항목명, 수량, 단가, 금액 컬럼과 합계 행을 포함합니다
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InvoiceItem } from '@/types/invoice'

interface InvoiceItemTableProps {
  items: InvoiceItem[]
}

/**
 * 금액을 한국어 통화 형식으로 포맷합니다
 * @param amount 포맷할 금액 (숫자)
 * @returns "1,000,000원" 형식의 문자열
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function InvoiceItemTable({ items }: InvoiceItemTableProps) {
  // 모든 항목의 금액 합산
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
            항목명
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            수량
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            단가
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            금액
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell className="px-6 py-4">{item.itemName}</TableCell>
            <TableCell className="px-6 py-4 text-right">
              {item.quantity}
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              {formatCurrency(item.unitPrice)}
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              {formatCurrency(item.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* 합계 행: 모든 항목 금액의 총합 표시 */}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="px-6 py-4 text-base font-bold">
            합계
          </TableCell>
          <TableCell className="px-6 py-4 text-right text-base font-bold">
            {formatCurrency(totalAmount)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run check-all
```

Expected: 오류 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add src/components/invoice/invoice-item-table.tsx
git commit -m "style: 견적 항목 테이블 셀 패딩 확대 및 헤더 uppercase 적용"
```

---

## Task 4: 견적서 상세 페이지 정보 그리드 및 총액 강조

**Files:**

- Modify: `src/app/invoices/[id]/page.tsx`

- [ ] **Step 1: 정보 그리드 배경 추가**

`src/app/invoices/[id]/page.tsx` 의 날짜/금액 그리드에 배경색을 추가하고 총액을 강조한다.

변경 전:

```tsx
<div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
  {/* 발행일 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">발행일</p>
    <p className="text-sm font-semibold">
      {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
    </p>
  </div>
  {/* 만료일 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">만료일</p>
    <p className="text-sm font-semibold">
      {new Date(invoice.expiryDate).toLocaleDateString('ko-KR')}
    </p>
  </div>
  {/* 총액 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">총액</p>
    <p className="text-lg font-bold">
      {invoice.totalAmount.toLocaleString('ko-KR')}원
    </p>
  </div>
</div>
```

변경 후:

```tsx
<div className="bg-muted/30 grid grid-cols-1 gap-6 rounded-lg p-5 sm:grid-cols-3">
  {/* 발행일 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">발행일</p>
    <p className="text-sm font-semibold">
      {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
    </p>
  </div>
  {/* 만료일 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">만료일</p>
    <p className="text-sm font-semibold">
      {new Date(invoice.expiryDate).toLocaleDateString('ko-KR')}
    </p>
  </div>
  {/* 총액 */}
  <div className="space-y-1">
    <p className="text-muted-foreground text-sm font-medium">총액</p>
    <p className="text-primary text-xl font-bold">
      {invoice.totalAmount.toLocaleString('ko-KR')}원
    </p>
  </div>
</div>
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run check-all
```

Expected: 오류 없이 통과

- [ ] **Step 3: 커밋**

```bash
git add src/app/invoices/[id]/page.tsx
git commit -m "style: 견적서 상세 페이지 정보 그리드 배경 및 총액 강조"
```

---

## Task 5: 공개 뷰어 페이지 Container 교체 및 UI 개선

**Files:**

- Modify: `src/app/view/[id]/page.tsx`

- [ ] **Step 1: 파일 수정**

`src/app/view/[id]/page.tsx` 전체를 아래로 교체한다:

```tsx
// 견적서 공개 뷰어 페이지
// 클라이언트가 고유 링크로 접속하여 견적서를 열람하는 페이지
// 인쇄 친화적 레이아웃, 유효기간 배너, PDF 다운로드 버튼 포함
import { FileText } from 'lucide-react'
import { getDummyInvoice } from '@/lib/dummy'
import { Container } from '@/components/layout/container'
import { ExpiryBanner } from '@/components/invoice/expiry-banner'
import { InvoiceItemTable } from '@/components/invoice/invoice-item-table'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'
import { Separator } from '@/components/ui/separator'

interface ViewPageProps {
  params: Promise<{ id: string }>
}

export default async function ViewPage({ params }: ViewPageProps) {
  // Next.js 15: params는 Promise → await 필수
  const { id } = await params

  // 더미 데이터에서 견적서 조회 (추후 노션 API로 교체 예정)
  const invoice = getDummyInvoice(id)

  // 견적서를 찾을 수 없는 경우 not-found UI 렌더링
  if (!invoice) {
    return (
      <main className="py-12">
        <Container size="md">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="text-muted-foreground mb-4 h-16 w-16" />
            <h1 className="mb-2 text-2xl font-bold">
              견적서를 찾을 수 없습니다
            </h1>
            <p className="text-muted-foreground text-sm">
              요청하신 견적서가 존재하지 않거나 삭제되었습니다.
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              견적서 ID: {id}
            </p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-8 md:py-12">
      <Container size="md">
        {/* 유효기간 배너 — 인쇄 시 숨김 */}
        <div className="mb-6 print:hidden">
          <ExpiryBanner expiryDate={invoice.expiryDate} />
        </div>

        {/* 견적서 본문 영역 */}
        <div className="space-y-10">
          {/* 브랜딩 헤더 영역 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* 서비스 브랜딩 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <FileText className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">견적서</h2>
                <p className="text-muted-foreground text-xs">
                  {/* TODO: 발행자 서비스명 연동 (노션 설정 페이지) */}
                  견적서 공유 서비스
                </p>
              </div>
            </div>

            {/* 발행자 정보 영역 */}
            <div className="text-muted-foreground text-sm sm:text-right">
              {/* TODO: 발행자 정보 연동 (상호명, 연락처, 이메일) */}
              <p className="text-foreground font-medium">홍길동 디자인</p>
              <p>contact@example.com</p>
              <p>010-0000-0000</p>
            </div>
          </div>

          <Separator />

          {/* 견적서 기본 정보 영역 */}
          <div className="space-y-4">
            {/* 견적서 제목 및 상태 */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold md:text-3xl">
                {invoice.title}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            {/* 견적서 세부 정보 그리드 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* 클라이언트명 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  클라이언트
                </p>
                <p className="font-semibold">{invoice.clientName}</p>
              </div>

              {/* 발행일 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  발행일
                </p>
                <p className="font-semibold">
                  {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 유효기간 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  유효기간
                </p>
                <p className="font-semibold">
                  {new Date(invoice.expiryDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 견적 항목 테이블 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold">견적 항목</h2>
            <InvoiceItemTable items={invoice.items} />
          </div>

          {/* 총액 강조 표시 영역 */}
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold md:text-xl">최종 합계</span>
              <span className="text-primary text-2xl font-bold md:text-3xl">
                {invoice.totalAmount.toLocaleString('ko-KR')}원
              </span>
            </div>
          </div>

          {/* PDF 다운로드 버튼 — 인쇄 시 숨김 */}
          <div className="flex justify-center pb-4 print:hidden">
            <PdfDownloadButton invoice={invoice} />
          </div>
        </div>
      </Container>
    </main>
  )
}
```

- [ ] **Step 2: 빌드 검증**

```bash
npm run check-all
```

Expected: 오류 없이 통과

- [ ] **Step 3: 최종 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공

- [ ] **Step 4: 커밋**

```bash
git add src/app/view/[id]/page.tsx
git commit -m "style: 공개 뷰어 페이지 Container 통일 및 총액 박스 브랜드 컬러 적용"
```

---

## 완료 체크리스트

- [ ] Task 1: Container `md` → `max-w-4xl` 변경
- [ ] Task 2: 홈 페이지 Container `size="md"` + 타이틀 border-b
- [ ] Task 3: 견적 항목 테이블 셀 패딩/스타일 개선
- [ ] Task 4: 상세 페이지 정보 그리드 배경 + 총액 강조
- [ ] Task 5: 공개 뷰어 Container 교체 + 총액 박스 + 간격
- [ ] `npm run check-all` 전체 통과
- [ ] `npm run build` 성공
