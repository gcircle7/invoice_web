// 개발 및 테스트용 더미 데이터
// 노션 API 연동 전 UI 개발을 위한 샘플 데이터 모음
import type { Invoice, InvoiceItem, InvoiceSummary } from '@/types/invoice'

// 견적서 항목 더미 데이터 (실제 노션 DB 샘플 기반)
const DUMMY_ITEMS: InvoiceItem[] = [
  {
    id: 'item-001',
    invoiceId: 'inv-001',
    itemName: '웹사이트 디자인',
    quantity: 1,
    unitPrice: 3000000,
    amount: 3000000,
  },
  {
    id: 'item-002',
    invoiceId: 'inv-001',
    itemName: '로고 제작',
    quantity: 2,
    unitPrice: 500000,
    amount: 1000000,
  },
  {
    id: 'item-003',
    invoiceId: 'inv-001',
    itemName: '명함디자인',
    quantity: 100,
    unitPrice: 10000,
    amount: 1000000,
  },
]

// 견적서 목록 더미 데이터 (요약 정보만 포함, items 제외)
export const DUMMY_INVOICES: InvoiceSummary[] = [
  {
    id: 'inv-001',
    title: 'INV-2025-001',
    clientName: 'ABC 회사',
    status: '대기',
    issueDate: '2026-04-06',
    expiryDate: '2026-04-29',
    totalAmount: 5000000,
  },
]

/**
 * ID로 견적서 상세 데이터를 조회합니다
 * @param id 견적서 ID
 * @returns 견적서 전체 데이터 (항목 포함) 또는 null
 */
export function getDummyInvoice(id: string): Invoice | null {
  const summary = DUMMY_INVOICES.find(inv => inv.id === id)
  if (!summary) return null

  return {
    ...summary,
    items: DUMMY_ITEMS.filter(item => item.invoiceId === id),
  }
}
