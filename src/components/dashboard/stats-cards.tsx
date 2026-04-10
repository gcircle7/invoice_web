// 대시보드 통계 카드 — 전체 건수, 총 견적 금액, 발송됨, 승인됨
import { FileText, TrendingUp, Send, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { InvoiceSummary } from '@/types/invoice'

interface StatsCardsProps {
  invoices: InvoiceSummary[]
}

export function StatsCards({ invoices }: StatsCardsProps) {
  const total = invoices.length
  const totalAmount = invoices.reduce((sum, i) => sum + i.totalAmount, 0)
  const sentCount = invoices.filter(i => i.status === '발송됨').length
  const approvedCount = invoices.filter(i => i.status === '승인됨').length

  const cards = [
    {
      title: '전체 견적서',
      value: `${total}건`,
      icon: FileText,
      description: '등록된 전체 견적서 수',
    },
    {
      title: '총 견적 금액',
      value: `${totalAmount.toLocaleString('ko-KR')}원`,
      icon: TrendingUp,
      description: '전체 견적서 합산 금액',
    },
    {
      title: '발송됨',
      value: `${sentCount}건`,
      icon: Send,
      description: '클라이언트에게 발송된 견적서',
    },
    {
      title: '승인됨',
      value: `${approvedCount}건`,
      icon: CheckCircle,
      description: '클라이언트가 승인한 견적서',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map(card => {
        const Icon = card.icon
        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-muted-foreground text-sm font-medium">
                {card.title}
              </CardTitle>
              <Icon className="text-muted-foreground h-4 w-4 shrink-0" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                {card.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
