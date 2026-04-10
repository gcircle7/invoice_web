// 견적서 목록 페이지 — 관리자가 직접 접속하는 메인 페이지
// ISR: 60초마다 노션 데이터 재검증
export const revalidate = 60

import { InvoiceTable } from '@/components/invoice/invoice-table'
import { RefreshButton } from '@/components/invoice/refresh-button'
import { getInvoices } from '@/lib/notion'

export default async function HomePage() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      {/* 페이지 타이틀 + 새로고침 버튼 */}
      <div className="flex items-start justify-between border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold">견적서 목록</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            노션 데이터베이스에 연동된 견적서를 확인합니다.
          </p>
        </div>
        <RefreshButton />
      </div>

      {/* 견적서 목록 테이블 */}
      <InvoiceTable invoices={invoices} />
    </div>
  )
}
