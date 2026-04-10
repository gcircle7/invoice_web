// 견적서 상태를 시각적으로 표시하는 뱃지 컴포넌트
// 상태에 따라 다른 색상과 스타일을 적용합니다
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { InvoiceStatus } from '@/types/invoice'

interface InvoiceStatusBadgeProps {
  status: InvoiceStatus
  className?: string
}

// 상태별 뱃지 스타일 매핑
const STATUS_CONFIG: Record<
  InvoiceStatus,
  {
    variant: 'default' | 'secondary' | 'destructive' | 'outline'
    className: string
    label: string
  }
> = {
  대기: {
    variant: 'outline',
    className: 'text-gray-600',
    label: '대기',
  },
  발송됨: {
    variant: 'secondary',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    label: '발송됨',
  },
  승인됨: {
    variant: 'default',
    className: 'bg-green-600 text-white',
    label: '승인됨',
  },
}

export function InvoiceStatusBadge({
  status,
  className,
}: InvoiceStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <Badge variant={config.variant} className={cn(config.className, className)}>
      {config.label}
    </Badge>
  )
}
