import { Client, isFullPage, APIResponseError } from '@notionhq/client'
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import { env } from '@/lib/env'
import type {
  Invoice,
  InvoiceItem,
  InvoiceSummary,
  InvoiceStatus,
} from '@/types/invoice'

// 노션 클라이언트 초기화 (서버 사이드 전용)
const notion = new Client({ auth: env.NOTION_TOKEN })

// 노션 Select 값 → InvoiceStatus 매핑
const STATUS_MAP: Record<string, InvoiceStatus> = {
  대기: '대기',
  발송됨: '발송됨',
  승인됨: '승인됨',
}

// --- 내부 헬퍼 함수 ---

// Title 타입 프로퍼티 → string 추출
function extractTitle(prop: PageObjectResponse['properties'][string]): string {
  if (prop.type !== 'title') return ''
  return prop.title.map(rt => rt.plain_text).join('')
}

// RichText 타입 프로퍼티 → string 추출
function extractRichText(
  prop: PageObjectResponse['properties'][string]
): string {
  if (prop.type !== 'rich_text') return ''
  return prop.rich_text.map(rt => rt.plain_text).join('')
}

// Select 타입 프로퍼티 → InvoiceStatus 추출
function extractSelect(
  prop: PageObjectResponse['properties'][string]
): InvoiceStatus {
  if (prop.type !== 'select' || !prop.select) return '대기'
  return STATUS_MAP[prop.select.name] ?? '대기'
}

// Date 타입 프로퍼티 → ISO 8601 string 추출 (.start 사용)
function extractDate(prop: PageObjectResponse['properties'][string]): string {
  if (prop.type !== 'date' || !prop.date) return ''
  return prop.date.start
}

// Number 타입 프로퍼티 → number 추출
function extractNumber(prop: PageObjectResponse['properties'][string]): number {
  if (prop.type !== 'number' || prop.number === null) return 0
  return prop.number ?? 0
}

// Formula 타입 프로퍼티 → number 추출 (금액이 formula인 경우 대비)
function extractFormulaNumber(
  prop: PageObjectResponse['properties'][string]
): number {
  if (prop.type !== 'formula') return 0
  if (prop.formula.type !== 'number' || prop.formula.number === null) return 0
  return prop.formula.number ?? 0
}

// PageObjectResponse → InvoiceSummary 변환
// 실제 노션 DB 필드: 견적서 번호, 클라이언트명, 발행일, 유효기간, 상태, 총금액
function parseInvoiceSummary(page: PageObjectResponse): InvoiceSummary {
  const props = page.properties
  return {
    id: page.id,
    title: props['견적서 번호'] ? extractTitle(props['견적서 번호']) : '',
    clientName: props['클라이언트명']
      ? extractRichText(props['클라이언트명'])
      : '',
    status: props['상태'] ? extractSelect(props['상태']) : '대기',
    issueDate: props['발행일'] ? extractDate(props['발행일']) : '',
    expiryDate: props['유효기간'] ? extractDate(props['유효기간']) : '',
    totalAmount: props['총금액'] ? extractNumber(props['총금액']) : 0,
  }
}

// ItemPageObjectResponse → InvoiceItem 변환
// 실제 노션 items DB 필드: 항목명, 수량, 단가, 금액
function parseInvoiceItem(
  page: PageObjectResponse,
  invoiceId: string
): InvoiceItem {
  const props = page.properties
  // 금액은 formula 또는 number 타입일 수 있음
  const amountProp = props['금액']
  const amount = amountProp
    ? amountProp.type === 'formula'
      ? extractFormulaNumber(amountProp)
      : extractNumber(amountProp)
    : 0

  return {
    id: page.id,
    invoiceId,
    itemName: props['항목명'] ? extractTitle(props['항목명']) : '',
    quantity: props['수량'] ? extractNumber(props['수량']) : 0,
    unitPrice: props['단가'] ? extractNumber(props['단가']) : 0,
    amount,
  }
}

// --- Public API 함수 ---

// 전체 견적서 목록 조회 (F001) — items 없이 요약 정보만 반환
export async function getInvoices(): Promise<InvoiceSummary[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_DATABASE_ID,
    sorts: [{ property: '발행일', direction: 'descending' }],
  })

  return response.results.filter(isFullPage).map(parseInvoiceSummary)
}

// 특정 견적서 상세 조회 (F002) — items 포함
export async function getInvoiceById(id: string): Promise<Invoice | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    if (!isFullPage(page)) return null

    const summary = parseInvoiceSummary(page)
    const items = await getInvoiceItems(id)

    return { ...summary, items }
  } catch (error) {
    if (error instanceof APIResponseError) {
      // 404: 존재하지 않는 견적서
      // 400: 유효하지 않은 ID 형식 (validation_error)
      // 두 경우 모두 not found UI 표시
      if (error.status === 404 || error.status === 400) return null
    }
    throw error
  }
}

// 견적서 항목 조회 (F002 — InvoiceItem)
// items는 별도 노션 DB — invoices 관계 프로퍼티로 필터링
export async function getInvoiceItems(
  invoiceId: string
): Promise<InvoiceItem[]> {
  const response = await notion.databases.query({
    database_id: env.NOTION_ITEMS_DATABASE_ID,
    filter: {
      property: 'invoices',
      relation: {
        contains: invoiceId,
      },
    },
  })

  return response.results
    .filter(isFullPage)
    .map(page => parseInvoiceItem(page, invoiceId))
}
