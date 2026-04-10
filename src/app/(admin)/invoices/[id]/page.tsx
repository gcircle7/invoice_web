// 견적서 상세 페이지 — 특정 견적서의 전체 정보를 표시합니다
// ISR: 60초마다 노션 데이터 재검증
export const revalidate = 60

import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import { InvoiceItemTable } from '@/components/invoice/invoice-item-table'
import { CopyLinkButton } from '@/components/invoice/copy-link-button'
import { getInvoiceById } from '@/lib/notion'

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function InvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  // Next.js 15에서 params는 Promise — 반드시 await 처리
  const { id } = await params

  const invoice = await getInvoiceById(id)

  if (!invoice) {
    return <NotFoundState id={id} />
  }

  return (
    <div className="space-y-6">
      {/* 상단 네비게이션 영역: 뒤로가기 + 링크 복사 버튼 */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            목록으로
          </Link>
        </Button>
        <CopyLinkButton invoiceId={invoice.id} size="sm" />
      </div>

      {/* 견적서 요약 정보 카드 */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl">{invoice.title}</CardTitle>
              <CardDescription className="text-base">
                클라이언트: {invoice.clientName}
              </CardDescription>
            </div>
            <InvoiceStatusBadge status={invoice.status} className="shrink-0" />
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="mb-6" />
          {/* 날짜 및 금액 정보 그리드 */}
          <div className="bg-muted/30 grid grid-cols-1 gap-6 rounded-lg p-5 sm:grid-cols-3">
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">발행일</p>
              <p className="text-sm font-semibold">
                {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">만료일</p>
              <p className="text-sm font-semibold">
                {new Date(invoice.expiryDate).toLocaleDateString('ko-KR')}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground text-sm font-medium">총액</p>
              <p className="text-primary text-xl font-bold">
                {invoice.totalAmount.toLocaleString('ko-KR')}원
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 견적서 항목 테이블 카드 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">견적 항목</CardTitle>
        </CardHeader>
        <CardContent className="pb-0 [&_td]:px-0 [&_th]:px-0">
          <InvoiceItemTable items={invoice.items} />
        </CardContent>
      </Card>

      {/* 하단 액션 영역 */}
      <div className="flex justify-end">
        <CopyLinkButton
          invoiceId={invoice.id}
          size="lg"
          variant="default"
          className="min-w-40"
        />
      </div>
    </div>
  )
}

// 견적서를 찾을 수 없을 때 표시하는 안내 컴포넌트
function NotFoundState({ id }: { id: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-muted mb-6 flex h-20 w-20 items-center justify-center rounded-full">
        <FileText className="text-muted-foreground h-10 w-10" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">견적서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground mb-8 max-w-sm text-sm">
        요청하신 견적서(ID: <span className="font-mono font-medium">{id}</span>
        )를 찾을 수 없습니다. 링크가 올바른지 확인해주세요.
      </p>
      <Button asChild>
        <Link href="/">
          <ArrowLeft className="mr-2 h-4 w-4" />
          목록으로 돌아가기
        </Link>
      </Button>
    </div>
  )
}
