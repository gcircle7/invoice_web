// 견적서 항목 목록을 테이블 형태로 표시하는 컴포넌트
// 항목명, 수량, 단가, 금액 컬럼과 합계 행을 포함합니다
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { InvoiceItem } from '@/types/invoice'

interface InvoiceItemTableProps {
  items: InvoiceItem[]
}

/**
 * 금액을 한국어 통화 형식으로 포맷합니다
 * @param amount 포맷할 금액 (숫자)
 * @returns "1,000,000원" 형식의 문자열
 */
function formatCurrency(amount: number): string {
  return amount.toLocaleString('ko-KR') + '원'
}

export function InvoiceItemTable({ items }: InvoiceItemTableProps) {
  // 모든 항목의 금액 합산
  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-muted-foreground px-6 py-4 text-xs font-semibold tracking-wider uppercase">
            항목명
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            수량
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            단가
          </TableHead>
          <TableHead className="text-muted-foreground px-6 py-4 text-right text-xs font-semibold tracking-wider uppercase">
            금액
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map(item => (
          <TableRow key={item.id}>
            <TableCell className="px-6 py-4">{item.itemName}</TableCell>
            <TableCell className="px-6 py-4 text-right">
              {item.quantity}
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              {formatCurrency(item.unitPrice)}
            </TableCell>
            <TableCell className="px-6 py-4 text-right">
              {formatCurrency(item.amount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* 합계 행: 모든 항목 금액의 총합 표시 */}
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3} className="px-6 py-4 text-base font-bold">
            합계
          </TableCell>
          <TableCell className="px-6 py-4 text-right text-base font-bold">
            {formatCurrency(totalAmount)}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  )
}
