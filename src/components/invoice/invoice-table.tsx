'use client'

// 견적서 목록을 테이블 형태로 렌더링하는 클라이언트 컴포넌트
// 행 클릭 시 견적서 상세 페이지로 이동합니다
import { useRouter } from 'next/navigation'
import { FileText } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import type { InvoiceSummary } from '@/types/invoice'

interface InvoiceTableProps {
  invoices: InvoiceSummary[]
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const router = useRouter()

  // 금액을 한국 원화 형식으로 포맷합니다
  const formatAmount = (amount: number) => amount.toLocaleString('ko-KR') + '원'

  // 날짜를 한국어 형식으로 포맷합니다
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('ko-KR')

  // 빈 목록일 때 empty state UI를 렌더링합니다
  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <FileText className="text-muted-foreground mb-4 size-12" />
        <h3 className="text-foreground mb-1 text-base font-semibold">
          견적서가 없습니다
        </h3>
        <p className="text-muted-foreground text-sm">
          노션 데이터베이스에 견적서를 추가하면 이곳에 표시됩니다.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            {/* 테이블 헤더 컬럼 정의 */}
            <TableHead className="w-[280px]">제목</TableHead>
            <TableHead>클라이언트</TableHead>
            <TableHead className="text-right">총액</TableHead>
            <TableHead>발행일</TableHead>
            <TableHead>만료일</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow
              key={invoice.id}
              // TODO: 클릭 시 해당 견적서 상세 페이지로 이동
              onClick={() => router.push(`/invoices/${invoice.id}`)}
              className="cursor-pointer"
              aria-label={`${invoice.title} 견적서 상세 보기`}
            >
              {/* 견적서 제목 */}
              <TableCell className="font-medium">{invoice.title}</TableCell>
              {/* 클라이언트명 */}
              <TableCell className="text-muted-foreground">
                {invoice.clientName}
              </TableCell>
              {/* 총액 (한국 원화 형식) */}
              <TableCell className="text-right font-medium tabular-nums">
                {formatAmount(invoice.totalAmount)}
              </TableCell>
              {/* 발행일 */}
              <TableCell className="text-muted-foreground">
                {formatDate(invoice.issueDate)}
              </TableCell>
              {/* 만료일 */}
              <TableCell className="text-muted-foreground">
                {formatDate(invoice.expiryDate)}
              </TableCell>
              {/* 견적서 상태 뱃지 */}
              <TableCell>
                <InvoiceStatusBadge status={invoice.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
