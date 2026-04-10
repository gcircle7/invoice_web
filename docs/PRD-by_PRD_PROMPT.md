# 📋 PRD: 노션 기반 견적서 웹 뷰어 (invoice-web)

> **버전**: 1.0.0 MVP
> **작성일**: 2026-04-08
> **상태**: Draft

---

## 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [사용자 페르소나](#2-사용자-페르소나)
3. [핵심 기능 요구사항 (MVP)](#3-핵심-기능-요구사항-mvp)
4. [데이터 모델 설계](#4-데이터-모델-설계)
5. [페이지 및 라우팅 구조](#5-페이지-및-라우팅-구조)
6. [API 설계](#6-api-설계)
7. [UI/UX 요구사항](#7-uiux-요구사항)
8. [기술 구현 가이드라인](#8-기술-구현-가이드라인)
9. [MVP 개발 로드맵](#9-mvp-개발-로드맵)
10. [리스크 및 제약사항](#10-리스크-및-제약사항)

---

## 1. 프로젝트 개요

### 1.1 배경 및 문제 정의

프리랜서 또는 소규모 사업자는 클라이언트에게 견적서를 전달할 때 다음과 같은 문제를 겪는다:

- Word/Excel 파일로 작성 → 이메일 첨부 → 클라이언트가 열어야 함 (앱 필요)
- 노션으로 작성해도 노션 공유 링크는 노션 UI가 그대로 노출되어 비전문적
- PDF로 직접 만들면 수정할 때마다 재발행 필요

**핵심 문제**: 노션에서 익숙하게 데이터를 입력하면서, 클라이언트에게는 **전문적인 견적서 웹 페이지**를 제공하고 **PDF 다운로드**까지 지원하는 도구가 없다.

### 1.2 목표 (MVP 범위)

MVP의 목표는 다음 3가지 핵심 흐름만 동작하게 하는 것이다:

1. **노션 데이터 읽기**: Notion API를 통해 견적서 데이터베이스에서 데이터를 가져온다
2. **웹 렌더링**: `/invoice/[slug]` URL에서 전문적으로 디자인된 견적서를 보여준다
3. **PDF 다운로드**: 브라우저 인쇄 기반 PDF 다운로드 버튼을 제공한다

### 1.3 비목표 (MVP에서 제외)

| 항목                          | 이유                                            |
| ----------------------------- | ----------------------------------------------- |
| 사용자 인증/회원가입          | 공급자는 환경변수로 API 키 설정, MVP에서 불필요 |
| 견적서 편집 UI                | 노션에서 편집하는 것이 핵심 가치 제안           |
| 이메일 발송 기능              | URL 복사-붙여넣기로 충분                        |
| 견적서 승인/서명 워크플로우   | Phase 2 이후                                    |
| 다중 공급자 지원 (멀티테넌시) | 단일 사업자 대상 MVP                            |
| 대시보드 / 견적서 목록 페이지 | Phase 2 이후                                    |
| 알림 기능 (이메일, Slack)     | Phase 2 이후                                    |
| 결제 연동                     | Phase 3 이후                                    |

### 1.4 성공 지표 (KPI)

| 지표                          | MVP 목표                        |
| ----------------------------- | ------------------------------- |
| 견적서 페이지 로딩 시간 (LCP) | 2초 이하                        |
| PDF 다운로드 성공률           | 95% 이상 (크롬/사파리/엣지)     |
| Notion API 데이터 정합성      | 필드 누락 없이 100% 렌더링      |
| 모바일 레이아웃 정상 표시     | iOS Safari, Android Chrome 대응 |

---

## 2. 사용자 페르소나

### 2.1 공급자 페르소나 (견적서 작성자)

| 항목          | 내용                                                                               |
| ------------- | ---------------------------------------------------------------------------------- |
| **이름**      | 김지훈 (프리랜서 개발자, 32세)                                                     |
| **기술 수준** | 노션 일상 사용자, 개발 지식 없음                                                   |
| **목표**      | 클라이언트에게 빠르고 전문적인 견적서를 보내고 싶다                                |
| **불만**      | 노션 링크를 보내면 클라이언트가 노션 가입을 요구받거나, 레이아웃이 엉망으로 보인다 |
| **사용 맥락** | 프로젝트 수주 시 노션에서 견적서 작성 후 클라이언트에게 링크 공유                  |

**공급자 워크플로우**:

```
노션 DB에 견적서 입력
→ 노션 페이지 ID 또는 slug 필드 확인
→ https://invoice-web.com/invoice/[slug] 링크를 클라이언트에게 전달
```

### 2.2 클라이언트 페르소나 (견적서 수신자)

| 항목          | 내용                                                              |
| ------------- | ----------------------------------------------------------------- |
| **이름**      | 박수진 (스타트업 마케터, 29세)                                    |
| **기술 수준** | 일반 웹 사용자, 노션 계정 없음                                    |
| **목표**      | 견적서 내용을 빠르게 확인하고 PDF로 저장하고 싶다                 |
| **불만**      | 파일을 다운받아 앱을 열거나, 노션 가입을 해야 하는 번거로움       |
| **사용 맥락** | 링크 클릭 → 브라우저에서 바로 견적서 확인 → PDF 저장 후 결재 상신 |

**클라이언트 워크플로우**:

```
링크 수신
→ 브라우저에서 URL 열기 (노션 계정 불필요)
→ 견적서 내용 확인
→ PDF 다운로드 버튼 클릭 → 저장
```

---

## 3. 핵심 기능 요구사항 (MVP)

### 3.1 기능 우선순위 매트릭스

| 우선순위         | 기능             | 설명                               |
| ---------------- | ---------------- | ---------------------------------- |
| **Must Have**    | Notion API 연동  | 견적서 데이터 fetch                |
| **Must Have**    | 견적서 웹 뷰     | `/invoice/[slug]` 페이지 렌더링    |
| **Must Have**    | PDF 다운로드     | 브라우저 인쇄 기반 PDF 생성        |
| **Must Have**    | 견적서 구성 요소 | 공급자/클라이언트 정보, 품목, 합계 |
| **Must Have**    | 반응형 디자인    | 모바일/데스크톱 대응               |
| **Should Have**  | 로딩/에러 UI     | Suspense + 에러 페이지             |
| **Should Have**  | not-found 처리   | 잘못된 slug 접근 시 안내 페이지    |
| **Nice to Have** | 링크 만료 처리   | 만료일 필드 기반 접근 차단         |
| **Nice to Have** | 견적서 상태 배지 | 초안/검토중/승인됨 표시            |

### 3.2 사용자 스토리

#### Must Have

```
As a 공급자,
I want 노션 데이터베이스에 견적서를 입력하면 자동으로 웹 페이지가 생성되길,
So that 별도의 코딩 없이 전문적인 견적서 URL을 클라이언트에게 공유할 수 있다.

As a 클라이언트,
I want 링크를 클릭하면 브라우저에서 바로 견적서를 볼 수 있길,
So that 노션 계정이나 특정 앱 없이 견적서를 확인할 수 있다.

As a 클라이언트,
I want PDF 다운로드 버튼을 클릭하여 견적서를 PDF로 저장하길,
So that 내부 결재 시스템에 첨부하거나 보관할 수 있다.

As a 공급자,
I want 견적서에 공급자 정보, 클라이언트 정보, 품목 목록, 세금, 합계가 표시되길,
So that 클라이언트가 견적 내용을 명확하게 파악할 수 있다.
```

#### Should Have

```
As a 클라이언트,
I want 존재하지 않는 견적서 URL에 접근하면 안내 페이지를 보길,
So that 링크 오류 여부를 즉시 알 수 있다.

As a 공급자,
I want 견적서 로딩 중 스켈레톤 UI를 보길,
So that 클라이언트가 빈 화면에서 혼란을 겪지 않는다.
```

#### Nice to Have

```
As a 공급자,
I want 만료일이 지난 견적서 링크가 자동으로 차단되길,
So that 오래된 견적서를 클라이언트가 실수로 참조하지 않는다.

As a 클라이언트,
I want 견적서 상태(초안/검토중/승인됨)를 배지로 확인하길,
So that 현재 진행 상태를 한눈에 파악할 수 있다.
```

---

## 4. 데이터 모델 설계

### 4.1 견적서 TypeScript 인터페이스

```typescript
// src/lib/types/invoice.ts

/** 견적서 상태 */
export type InvoiceStatus = 'draft' | 'sent' | 'approved' | 'rejected'

/** 통화 코드 */
export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'EUR'

/** 공급자 정보 */
export interface Supplier {
  name: string // 회사명 또는 개인 이름
  businessNumber?: string // 사업자등록번호 (선택)
  email: string
  phone?: string
  address?: string
  logoUrl?: string // 로고 이미지 URL (선택)
}

/** 클라이언트 정보 */
export interface Client {
  name: string // 회사명 또는 담당자명
  email?: string
  phone?: string
  address?: string
}

/** 견적 품목 (Line Item) */
export interface LineItem {
  id: string
  description: string // 품목명 / 작업 내용
  quantity: number // 수량
  unitPrice: number // 단가 (원 단위)
  unit?: string // 단위 (개, 시간, 건 등)
  subtotal: number // quantity * unitPrice (computed)
  note?: string // 품목별 비고
}

/** 세금 정보 */
export interface TaxInfo {
  rate: number // 세율 (예: 0.1 = 10%)
  label: string // 표시명 (예: "부가세 10%")
  amount: number // 세금 금액 (computed)
}

/** 견적서 전체 */
export interface Invoice {
  id: string // Notion page ID
  slug: string // URL에 사용되는 고유 식별자
  title: string // 견적서 제목
  invoiceNumber: string // 견적서 번호 (예: INV-2026-001)
  status: InvoiceStatus
  currency: CurrencyCode
  issueDate: string // ISO 8601 (예: 2026-04-08)
  dueDate?: string // 유효기한 (선택)
  supplier: Supplier
  client: Client
  lineItems: LineItem[]
  subtotal: number // 품목 합계 (세전)
  tax?: TaxInfo
  discount?: number // 할인 금액 (절대값)
  total: number // 최종 합계
  note?: string // 견적서 전체 비고
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}
```

### 4.2 노션 데이터베이스 필드 매핑

> 노션 데이터베이스 이름 예시: `Invoice DB`

| 노션 필드명        | 필드 타입 | 매핑 대상                         | 비고                                  |
| ------------------ | --------- | --------------------------------- | ------------------------------------- |
| `Name`             | Title     | `invoice.title`                   | 필수                                  |
| `Slug`             | Rich Text | `invoice.slug`                    | URL 경로, 필수, 영문/숫자/-만 허용    |
| `Invoice Number`   | Rich Text | `invoice.invoiceNumber`           | 예: `INV-2026-001`                    |
| `Status`           | Select    | `invoice.status`                  | 옵션: Draft, Sent, Approved, Rejected |
| `Issue Date`       | Date      | `invoice.issueDate`               |                                       |
| `Due Date`         | Date      | `invoice.dueDate`                 | 선택                                  |
| `Currency`         | Select    | `invoice.currency`                | 옵션: KRW, USD, JPY, EUR              |
| `Supplier Name`    | Rich Text | `invoice.supplier.name`           |                                       |
| `Supplier Email`   | Email     | `invoice.supplier.email`          |                                       |
| `Supplier Phone`   | Phone     | `invoice.supplier.phone`          | 선택                                  |
| `Supplier Address` | Rich Text | `invoice.supplier.address`        | 선택                                  |
| `Business Number`  | Rich Text | `invoice.supplier.businessNumber` | 선택                                  |
| `Client Name`      | Rich Text | `invoice.client.name`             |                                       |
| `Client Email`     | Email     | `invoice.client.email`            | 선택                                  |
| `Client Address`   | Rich Text | `invoice.client.address`          | 선택                                  |
| `Tax Rate`         | Number    | `invoice.tax.rate`                | 예: `0.1` (10%)                       |
| `Discount`         | Number    | `invoice.discount`                | 절대 금액                             |
| `Note`             | Rich Text | `invoice.note`                    | 선택                                  |

#### 품목(Line Item) 처리 방식

노션 데이터베이스에서 품목 목록은 **별도의 관계형(Relation) 데이터베이스**로 구성한다:

| 노션 필드명  | 필드 타입 | 매핑 대상                      |
| ------------ | --------- | ------------------------------ |
| `Name`       | Title     | `lineItem.description`         |
| `Invoice`    | Relation  | 상위 견적서와 연결             |
| `Quantity`   | Number    | `lineItem.quantity`            |
| `Unit Price` | Number    | `lineItem.unitPrice`           |
| `Unit`       | Rich Text | `lineItem.unit` (예: 시간, 건) |
| `Note`       | Rich Text | `lineItem.note`                |

> **대안 방식**: 품목을 노션 페이지 본문 테이블로 작성하는 방식도 고려할 수 있으나,
> Relation DB 방식이 데이터 정합성 측면에서 우수하여 권장한다.

---

## 5. 페이지 및 라우팅 구조

### 5.1 App Router 라우트 설계

```
src/app/
├── layout.tsx                    # 루트 레이아웃 (전역 폰트, ThemeProvider)
├── page.tsx                      # 홈페이지 (랜딩 또는 리다이렉트)
├── not-found.tsx                 # 전역 404 페이지
│
├── invoice/
│   └── [slug]/
│       ├── page.tsx              # 견적서 뷰 페이지 (Server Component)
│       ├── loading.tsx           # 스켈레톤 로딩 UI
│       └── not-found.tsx         # 견적서 없음 안내 페이지
│
└── api/
    └── invoice/
        └── [slug]/
            └── route.ts          # GET /api/invoice/[slug] — Notion 데이터 fetch
```

### 5.2 각 라우트 상세

#### `/invoice/[slug]` — 견적서 뷰 페이지

```typescript
// src/app/invoice/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getInvoiceBySlug } from '@/lib/notion'
import { InvoiceView } from '@/components/invoice/invoice-view'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function InvoicePage({ params }: Props) {
  const { slug } = await params
  const invoice = await getInvoiceBySlug(slug)

  if (!invoice) {
    notFound()
  }

  // Nice to Have: 만료일 체크
  if (invoice.dueDate && new Date(invoice.dueDate) < new Date()) {
    // 만료된 견적서 처리 (Phase 2)
  }

  return <InvoiceView invoice={invoice} />
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const invoice = await getInvoiceBySlug(slug)

  return {
    title: invoice ? `${invoice.title} | 견적서` : '견적서를 찾을 수 없습니다',
    robots: { index: false, follow: false }, // 검색엔진 노출 차단
  }
}
```

#### `/api/invoice/[slug]` — 내부 API Route

```typescript
// src/app/api/invoice/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getInvoiceBySlug } from '@/lib/notion'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const invoice = await getInvoiceBySlug(slug)

  if (!invoice) {
    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 })
  }

  return NextResponse.json(invoice)
}
```

### 5.3 컴포넌트 구조

```
src/components/
├── ui/                           # shadcn/ui 기본 컴포넌트
│   ├── button.tsx
│   ├── badge.tsx
│   ├── separator.tsx
│   └── skeleton.tsx
│
└── invoice/                      # 견적서 전용 컴포넌트
    ├── invoice-view.tsx          # 견적서 전체 레이아웃 (최상위)
    ├── invoice-header.tsx        # 제목, 번호, 날짜, 상태 배지
    ├── invoice-parties.tsx       # 공급자 + 클라이언트 정보 2단
    ├── invoice-line-items.tsx    # 품목 테이블
    ├── invoice-summary.tsx       # 소계/할인/세금/합계
    ├── invoice-note.tsx          # 비고
    ├── invoice-download-btn.tsx  # PDF 다운로드 버튼 (Client Component)
    └── invoice-skeleton.tsx      # 로딩 스켈레톤
```

---

## 6. API 설계

### 6.1 Notion API 연동 방식

**라이브러리**: `@notionhq/client` (공식 SDK)

```bash
npm install @notionhq/client
```

**핵심 함수 구조**:

```typescript
// src/lib/notion.ts
import { Client } from '@notionhq/client'
import { Invoice, LineItem } from '@/lib/types/invoice'

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID!
const LINE_ITEMS_DATABASE_ID = process.env.NOTION_LINE_ITEMS_DATABASE_ID!

/** slug로 견적서 조회 */
export async function getInvoiceBySlug(slug: string): Promise<Invoice | null> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Slug',
      rich_text: { equals: slug },
    },
  })

  if (response.results.length === 0) return null

  const page = response.results[0]
  return parseInvoicePage(page)
}

/** 노션 페이지 → Invoice 타입 변환 */
function parseInvoicePage(page: any): Invoice {
  const props = page.properties

  return {
    id: page.id,
    slug: getRichText(props['Slug']),
    title: getTitle(props['Name']),
    invoiceNumber: getRichText(props['Invoice Number']),
    status: getSelect(props['Status']) as Invoice['status'],
    currency: getSelect(props['Currency']) as Invoice['currency'],
    issueDate: getDate(props['Issue Date']),
    dueDate: getDate(props['Due Date']) ?? undefined,
    supplier: {
      name: getRichText(props['Supplier Name']),
      email: getEmail(props['Supplier Email']),
      phone: getPhone(props['Supplier Phone']) ?? undefined,
      address: getRichText(props['Supplier Address']) ?? undefined,
      businessNumber: getRichText(props['Business Number']) ?? undefined,
    },
    client: {
      name: getRichText(props['Client Name']),
      email: getEmail(props['Client Email']) ?? undefined,
      address: getRichText(props['Client Address']) ?? undefined,
    },
    lineItems: [], // 별도 query 필요
    subtotal: 0, // lineItems 집계 후 계산
    total: 0, // 집계 후 계산
    tax: getNumber(props['Tax Rate'])
      ? {
          rate: getNumber(props['Tax Rate'])!,
          label: `부가세 ${getNumber(props['Tax Rate'])! * 100}%`,
          amount: 0, // 계산 후 채움
        }
      : undefined,
    discount: getNumber(props['Discount']) ?? undefined,
    note: getRichText(props['Note']) ?? undefined,
    createdAt: page.created_time,
    updatedAt: page.last_edited_time,
  }
}
```

### 6.2 내부 API 엔드포인트 명세

| Method | Path                  | 설명               | Response       |
| ------ | --------------------- | ------------------ | -------------- |
| `GET`  | `/api/invoice/[slug]` | slug로 견적서 조회 | `Invoice` JSON |

**성공 응답 (200)**:

```json
{
  "id": "notion-page-id",
  "slug": "project-abc-2026",
  "title": "웹사이트 개발 견적서",
  "invoiceNumber": "INV-2026-001",
  "status": "sent",
  "currency": "KRW",
  "issueDate": "2026-04-08",
  "dueDate": "2026-04-22",
  "supplier": { ... },
  "client": { ... },
  "lineItems": [ ... ],
  "subtotal": 3000000,
  "tax": { "rate": 0.1, "label": "부가세 10%", "amount": 300000 },
  "total": 3300000
}
```

**에러 응답**:

| 상태 코드 | 원인                        | Response Body                          |
| --------- | --------------------------- | -------------------------------------- |
| `404`     | slug에 해당하는 견적서 없음 | `{ "error": "Invoice not found" }`     |
| `500`     | Notion API 오류             | `{ "error": "Internal server error" }` |
| `429`     | Notion Rate Limit 초과      | `{ "error": "Too many requests" }`     |

### 6.3 캐싱 전략

```typescript
// Notion API 호출 시 Next.js fetch 캐싱 활용
// @notionhq/client는 내부적으로 fetch를 사용하지 않으므로
// unstable_cache로 래핑

import { unstable_cache } from 'next/cache'

export const getInvoiceBySlug = unstable_cache(
  async (slug: string) => {
    // Notion API 호출 로직
  },
  ['invoice-by-slug'],
  {
    revalidate: 300, // 5분 캐시
    tags: ['invoice'], // revalidateTag('invoice')로 무효화 가능
  }
)
```

---

## 7. UI/UX 요구사항

### 7.1 견적서 레이아웃 와이어프레임

```
┌─────────────────────────────────────────────────────────┐
│  [로고]                              [PDF 다운로드 버튼]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  견적서                              견적서 번호: INV-001 │
│  ──────────────────────────────────────────────────     │
│  발행일: 2026-04-08    유효기한: 2026-04-22              │
│  상태: [발송됨]                                          │
│                                                         │
├──────────────────────┬──────────────────────────────────┤
│  공급자               │  클라이언트                       │
│  ────────────────     │  ──────────────────────          │
│  (주)짐코딩           │  박수진 마케팅팀                   │
│  김지훈               │  스타트업 주식회사                 │
│  jh@gymcoding.dev    │  parksu@startup.co.kr            │
│  010-1234-5678       │                                  │
│  사업자: 123-45-67890 │                                  │
├──────────────────────┴──────────────────────────────────┤
│                                                         │
│  품목                      수량   단가         금액      │
│  ─────────────────────────────────────────────────────  │
│  웹사이트 기획 및 설계         1식  500,000    500,000   │
│  프론트엔드 개발              80시간  25,000  2,000,000  │
│  백엔드 API 개발              20시간  25,000    500,000  │
│  ─────────────────────────────────────────────────────  │
│                                         소계  3,000,000 │
│                                    부가세 10%   300,000 │
│                                    ─────────────────    │
│                                    합 계  3,300,000원   │
│                                                         │
├─────────────────────────────────────────────────────────┤
│  비고                                                    │
│  계약금 50% 선입금 후 작업 시작 예정입니다.                │
└─────────────────────────────────────────────────────────┘
```

### 7.2 견적서 필수 UI 요소

| 섹션                | 필수 요소                                                  |
| ------------------- | ---------------------------------------------------------- |
| **헤더**            | 공급자 로고(선택), "견적서" 타이틀, 견적서 번호, 상태 배지 |
| **메타 정보**       | 발행일, 유효기한, 통화                                     |
| **공급자 정보**     | 회사명, 담당자명, 이메일, 전화번호, 주소, 사업자번호       |
| **클라이언트 정보** | 회사명/이름, 이메일, 주소                                  |
| **품목 테이블**     | 품목명, 수량, 단위, 단가, 금액                             |
| **합계 영역**       | 소계, 할인(있을 경우), 세금(있을 경우), 최종 합계          |
| **비고**            | 자유 텍스트 (없으면 숨김)                                  |
| **PDF 버튼**        | 고정 위치(우상단) 또는 상단 툴바                           |

### 7.3 디자인 원칙

```tsx
// 견적서 뷰는 인쇄 최적화를 위해 흰색 배경 고정
// 다크모드는 웹 뷰에서만 선택적으로 적용하되, 인쇄 시 항상 라이트 모드

// ✅ 견적서 컨테이너 — A4 비율 유지
<div className={cn(
  "mx-auto bg-white text-foreground",
  "w-full max-w-[794px]",         // A4 너비 (96dpi 기준)
  "min-h-[1123px]",               // A4 높이 최소값
  "p-8 md:p-12",
  "shadow-lg print:shadow-none",  // 화면에서는 그림자, 인쇄 시 제거
)}>

// ✅ 품목 테이블 — 반응형
<div className="overflow-x-auto">
  <table className="w-full text-sm">
    <thead className="border-b-2 border-foreground">
      <tr>
        <th className="py-2 text-left font-semibold">품목</th>
        <th className="py-2 text-right font-semibold">수량</th>
        <th className="py-2 text-right font-semibold hidden sm:table-cell">단가</th>
        <th className="py-2 text-right font-semibold">금액</th>
      </tr>
    </thead>
  </table>
</div>
```

### 7.4 PDF 출력 고려사항

```css
/* src/app/globals.css 또는 invoice-print.css */

@media print {
  /* PDF 버튼 숨기기 */
  .no-print {
    display: none !important;
  }

  /* 페이지 여백 설정 */
  @page {
    size: A4;
    margin: 15mm;
  }

  /* 품목 테이블 페이지 분할 방지 */
  tr {
    break-inside: avoid;
  }

  /* 배경색 강제 출력 (상태 배지 등) */
  * {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* 그림자 제거 */
  .shadow-lg {
    box-shadow: none !important;
  }
}
```

**PDF 다운로드 버튼 구현 (Client Component)**:

```tsx
// src/components/invoice/invoice-download-btn.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface Props {
  invoiceNumber: string
}

export function InvoiceDownloadBtn({ invoiceNumber }: Props) {
  const handleDownload = () => {
    // 파일명 설정 후 브라우저 인쇄 다이얼로그 열기
    const originalTitle = document.title
    document.title = `견적서_${invoiceNumber}`
    window.print()
    document.title = originalTitle
  }

  return (
    <Button
      onClick={handleDownload}
      className="no-print" // 인쇄 시 숨김
    >
      <Download className="mr-2 h-4 w-4" />
      PDF 다운로드
    </Button>
  )
}
```

---

## 8. 기술 구현 가이드라인

### 8.1 환경변수 목록

`.env.local` 파일에 다음 항목을 설정한다:

```bash
# .env.local

# Notion 연동 (필수)
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_LINE_ITEMS_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 앱 설정 (선택)
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**.env.local 발급 방법**:

1. [Notion 개발자 포털](https://www.notion.so/my-integrations)에서 인테그레이션 생성
2. `NOTION_API_KEY` = "Internal Integration Secret" 값
3. 견적서 DB 페이지 URL의 32자리 ID → `NOTION_DATABASE_ID`
4. 노션 DB에서 해당 인테그레이션에 접근 권한 부여 (Share → Connections)

### 8.2 PDF 생성 방식 비교 및 선택 근거

| 방식                                 | 장점                                               | 단점                                              | MVP 적합성      |
| ------------------------------------ | -------------------------------------------------- | ------------------------------------------------- | --------------- |
| **`window.print()` (브라우저 인쇄)** | 추가 라이브러리 불필요, CSS 그대로 적용, 구현 10분 | 브라우저 인쇄 다이얼로그 노출, 파일명 제어 제한적 | ✅ **MVP 채택** |
| `@react-pdf/renderer`                | 완전한 PDF 제어, 일관된 출력                       | 별도 PDF 레이아웃 코드 필요, 한글 폰트 설정 복잡  | Phase 2         |
| `puppeteer` (서버사이드)             | 서버에서 정확한 PDF 생성                           | 서버리스 환경 호환 어려움, 번들 크기 큼           | Phase 3         |

**MVP 결론**: `window.print()` + `@media print` CSS로 구현. 추가 의존성 없이 빠르게 구현 가능.

### 8.3 의존성 설치

```bash
# MVP 필수 패키지
npm install @notionhq/client

# PDF 향상 (Phase 2, MVP에서는 불필요)
# npm install @react-pdf/renderer
```

### 8.4 캐싱 전략 요약

| 데이터        | 캐시 TTL    | 무효화 방법                |
| ------------- | ----------- | -------------------------- |
| 견적서 데이터 | 5분 (300초) | `revalidateTag('invoice')` |
| 품목 데이터   | 5분 (300초) | 견적서 캐시와 동일         |

> **이유**: 견적서는 실시간 업데이트 빈도가 낮고, Notion API Rate Limit(분당 3회)을 고려하여 캐싱 필수.

### 8.5 Notion 유틸리티 함수

```typescript
// src/lib/notion-utils.ts
// Notion API 응답에서 값을 안전하게 추출하는 헬퍼 함수

export function getTitle(prop: any): string {
  return prop?.title?.[0]?.plain_text ?? ''
}

export function getRichText(prop: any): string {
  return prop?.rich_text?.[0]?.plain_text ?? ''
}

export function getSelect(prop: any): string {
  return prop?.select?.name ?? ''
}

export function getDate(prop: any): string {
  return prop?.date?.start ?? ''
}

export function getNumber(prop: any): number | null {
  return prop?.number ?? null
}

export function getEmail(prop: any): string {
  return prop?.email ?? ''
}

export function getPhone(prop: any): string {
  return prop?.phone_number ?? ''
}
```

---

## 9. MVP 개발 로드맵

### Phase 1: 기반 구축 (1~2일)

| 작업            | 세부 내용                               | DoD                          |
| --------------- | --------------------------------------- | ---------------------------- |
| 환경변수 설정   | `.env.local` + Notion 인테그레이션 연동 | Notion API 호출 성공         |
| 타입 정의       | `Invoice`, `LineItem` 인터페이스        | TypeScript 컴파일 통과       |
| Notion 유틸리티 | `getInvoiceBySlug()` 함수 + 파서        | 실제 DB에서 데이터 파싱 성공 |
| 라우트 생성     | `/invoice/[slug]` 페이지 + API Route    | URL 접근 시 200 응답         |

**Phase 1 완료 조건**: `http://localhost:3000/invoice/test-slug` 접근 시 견적서 원시 데이터가 화면에 표시됨

### Phase 2: UI 구현 (2~3일)

| 작업                   | 세부 내용                        | DoD                       |
| ---------------------- | -------------------------------- | ------------------------- |
| `InvoiceView` 컴포넌트 | 전체 레이아웃 조립               | 모든 필드 렌더링          |
| `InvoiceHeader`        | 제목, 번호, 날짜, 상태 배지      | 시각적으로 완성           |
| `InvoiceParties`       | 공급자 + 클라이언트 2단 레이아웃 | 반응형 (모바일 1단)       |
| `InvoiceLineItems`     | 품목 테이블                      | 금액 포맷팅 (원화)        |
| `InvoiceSummary`       | 소계/할인/세금/합계              | 계산 정합성 검증          |
| `InvoiceDownloadBtn`   | `window.print()` 구현            | PDF 출력 정상             |
| 로딩 UI                | `invoice-skeleton.tsx`           | Suspense 연동             |
| not-found 페이지       | 없는 slug 접근 시 안내           | `notFound()` 호출 시 표시 |

**Phase 2 완료 조건**: 실제 노션 데이터가 전문적인 견적서 디자인으로 렌더링되고 PDF 다운로드 성공

### Phase 3: 품질 및 엣지 케이스 (1일)

| 작업               | 세부 내용                             | DoD                            |
| ------------------ | ------------------------------------- | ------------------------------ |
| 에러 핸들링        | Notion API 오류, 네트워크 오류 처리   | 500 에러 시 안내 페이지 표시   |
| 인쇄 스타일 최적화 | `@media print` CSS 보완               | 크롬/사파리/엣지 PDF 출력 확인 |
| 금액 포맷팅        | `Intl.NumberFormat` 통화별 포맷       | KRW는 원, USD는 $ 표시         |
| 빌드 검증          | `npm run check-all` + `npm run build` | 0 에러, 0 경고                 |
| 모바일 테스트      | iOS Safari, Android Chrome            | 레이아웃 깨짐 없음             |

**Phase 3 완료 조건**: `npm run build` 성공 + 모바일/데스크톱/PDF 모두 정상 동작

---

## 10. 리스크 및 제약사항

### 10.1 Notion API 제한사항

| 제약                | 내용                       | 대응 방안                                         |
| ------------------- | -------------------------- | ------------------------------------------------- |
| **Rate Limit**      | 분당 3회 요청 제한         | `unstable_cache` 5분 캐싱으로 API 호출 최소화     |
| **응답 지연**       | 평균 200~500ms             | Suspense + 스켈레톤 UI로 UX 보완                  |
| **페이로드 크기**   | 블록 응답은 100개 제한     | 품목 50개 이상 시 pagination 필요 (Phase 2)       |
| **Private API Key** | 서버사이드에서만 사용 필수 | `NOTION_API_KEY` 절대 클라이언트 번들에 포함 금지 |

### 10.2 PDF 생성 브라우저 호환성

| 브라우저           | 지원 수준    | 이슈                      |
| ------------------ | ------------ | ------------------------- |
| Chrome (데스크톱)  | ✅ 완전 지원 | 없음                      |
| Safari (macOS/iOS) | ✅ 지원      | 간헐적 여백 차이          |
| Edge               | ✅ 지원      | 없음                      |
| Firefox            | ⚠️ 부분 지원 | 일부 CSS 인쇄 속성 미지원 |
| 모바일 Chrome      | ⚠️ 제한적    | 인쇄 다이얼로그 UI 상이   |

**대응**: `@media print` 크로스 브라우저 테스트를 Phase 3에서 수행. Firefox 이슈는 알려진 제약으로 문서화.

### 10.3 보안 고려사항

| 항목              | 위험                                     | 대응                                                                 |
| ----------------- | ---------------------------------------- | -------------------------------------------------------------------- |
| **URL 추측 공격** | slug가 단순할 경우 타인 견적서 열람 가능 | slug에 UUID 일부 또는 랜덤 토큰 포함 권장 (예: `project-abc-a1b2c3`) |
| **검색엔진 노출** | 견적서 URL이 구글에 인덱싱될 수 있음     | `robots: noindex` 메타태그 적용 (6.1절 참고)                         |
| **API Key 유출**  | `NOTION_API_KEY`가 클라이언트에 노출     | 모든 Notion 호출은 Server Component 또는 Route Handler에서만 수행    |
| **민감 정보**     | 견적서에 사업자번호, 연락처 포함         | HTTPS 필수, slug를 충분히 복잡하게 설정하도록 가이드                 |

---

## 체크리스트

### PRD 완성도 확인

- [x] 모든 섹션 포함
- [x] TypeScript 타입 정의가 실제 구현 가능한 수준
- [x] Notion 데이터베이스 필드 매핑 명확
- [x] PDF 다운로드 구현 방식 명시 (`window.print()`)
- [x] MVP 범위와 비목표 명확히 구분
- [x] 개발자가 바로 착수 가능한 수준의 코드 예시 포함
- [x] 캐싱 전략 명시
- [x] 환경변수 목록 완비
- [x] 보안 고려사항 포함
