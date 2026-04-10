export type InvoiceStatus = '대기' | '발송됨' | '승인됨'

export interface Invoice {
  id: string // 노션 페이지 UUID (공개 링크 슬러그로 활용)
  title: string
  clientName: string
  status: InvoiceStatus
  issueDate: string // ISO 8601
  expiryDate: string // ISO 8601
  totalAmount: number
  items: InvoiceItem[]
}

export interface InvoiceItem {
  id: string
  invoiceId: string
  itemName: string
  quantity: number
  unitPrice: number
  amount: number // quantity × unitPrice
}

// 목록 페이지용 요약 타입 (items 제외)
export type InvoiceSummary = Omit<Invoice, 'items'>
