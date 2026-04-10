// 대시보드 만료 임박 알림 — 오늘 기준 7일 이내 만료 예정 및 이미 만료된 견적서
import Link from 'next/link'
import { AlertCircle, Clock } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { InvoiceSummary } from '@/types/invoice'

interface ExpiryAlertProps {
  invoices: InvoiceSummary[]
}

export function ExpiryAlert({ invoices }: ExpiryAlertProps) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysLater = new Date(today)
  sevenDaysLater.setDate(sevenDaysLater.getDate() + 7)

  // 이미 만료된 견적서
  const expiredList = invoices.filter(i => {
    const expiry = new Date(i.expiryDate)
    expiry.setHours(0, 0, 0, 0)
    return expiry < today
  })

  // 7일 이내 만료 예정 견적서
  const urgentList = invoices.filter(i => {
    const expiry = new Date(i.expiryDate)
    expiry.setHours(0, 0, 0, 0)
    return expiry >= today && expiry <= sevenDaysLater
  })

  // 해당 건 없으면 렌더링하지 않음
  if (expiredList.length === 0 && urgentList.length === 0) return null

  return (
    <div className="space-y-3">
      {/* 만료된 견적서 */}
      {expiredList.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>만료된 견적서 {expiredList.length}건</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 space-y-1">
              {expiredList.map(i => (
                <li key={i.id} className="text-sm">
                  <Link
                    href={`/invoices/${i.id}`}
                    className="underline underline-offset-2"
                  >
                    {i.clientName} — {i.title}
                  </Link>
                  <span className="ml-2 opacity-80">
                    ({new Date(i.expiryDate).toLocaleDateString('ko-KR')} 만료)
                  </span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 만료 임박 견적서 */}
      {urgentList.length > 0 && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertTitle>만료 임박 {urgentList.length}건</AlertTitle>
          <AlertDescription>
            <ul className="mt-1 space-y-1">
              {urgentList.map(i => (
                <li key={i.id} className="text-sm">
                  <Link
                    href={`/invoices/${i.id}`}
                    className="underline underline-offset-2"
                  >
                    {i.clientName} — {i.title}
                  </Link>
                  <span className="text-muted-foreground ml-2">
                    ({new Date(i.expiryDate).toLocaleDateString('ko-KR')} 만료)
                  </span>
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
