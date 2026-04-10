// 대시보드 페이지 — 통계 카드, 최근 견적서, 만료 임박 알림
// ISR: 60초마다 노션 데이터 재검증
export const revalidate = 60

import { getInvoices } from '@/lib/notion'
import { StatsCards } from '@/components/dashboard/stats-cards'
import { RecentInvoices } from '@/components/dashboard/recent-invoices'
import { ExpiryAlert } from '@/components/dashboard/expiry-alert'

export default async function DashboardPage() {
  const invoices = await getInvoices()

  return (
    <div className="space-y-6">
      {/* 페이지 타이틀 */}
      <div className="border-b pb-6">
        <h1 className="text-2xl font-bold">대시보드</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          견적서 현황을 한눈에 확인합니다.
        </p>
      </div>

      {/* 통계 카드 4개 */}
      <StatsCards invoices={invoices} />

      {/* 최근 견적서 + 만료 임박 알림 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentInvoices invoices={invoices} />
        </div>
        <div>
          <ExpiryAlert invoices={invoices} />
        </div>
      </div>
    </div>
  )
}
