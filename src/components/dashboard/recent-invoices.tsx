// 대시보드 최근 견적서 — 발행일 기준 최근 5건 테이블
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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

interface RecentInvoicesProps {
  invoices: InvoiceSummary[]
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  const recent = invoices.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">최근 견적서</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {recent.length === 0 ? (
          <p className="text-muted-foreground px-6 py-8 text-center text-sm">
            등록된 견적서가 없습니다.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>견적서 번호</TableHead>
                <TableHead>클라이언트</TableHead>
                <TableHead className="text-right">총액</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>발행일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent.map(invoice => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-muted/50 cursor-pointer"
                >
                  <TableCell className="font-medium">
                    <Link
                      href={`/invoices/${invoice.id}`}
                      className="hover:text-primary block"
                    >
                      {invoice.title}
                    </Link>
                  </TableCell>
                  <TableCell>{invoice.clientName}</TableCell>
                  <TableCell className="text-right">
                    {invoice.totalAmount.toLocaleString('ko-KR')}원
                  </TableCell>
                  <TableCell>
                    <InvoiceStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
