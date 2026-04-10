// 견적서 공개 뷰어 페이지
// 클라이언트가 고유 링크로 접속하여 견적서를 열람하는 페이지
// 인쇄 친화적 레이아웃, 유효기간 배너, PDF 다운로드 버튼 포함
// ISR: 공개 뷰어는 5분(300초) 캐시 — 목록 페이지보다 업데이트 빈도 낮음
export const revalidate = 300

import { FileText } from 'lucide-react'
import { getInvoiceById } from '@/lib/notion'
import { Container } from '@/components/layout/container'
import { ExpiryBanner } from '@/components/invoice/expiry-banner'
import { InvoiceItemTable } from '@/components/invoice/invoice-item-table'
import { InvoiceStatusBadge } from '@/components/invoice/invoice-status-badge'
import { PdfDownloadButton } from '@/components/invoice/pdf-download-button'
import { Separator } from '@/components/ui/separator'

interface ViewPageProps {
  params: Promise<{ id: string }>
}

export default async function ViewPage({ params }: ViewPageProps) {
  // Next.js 15: params는 Promise → await 필수
  const { id } = await params

  const invoice = await getInvoiceById(id)

  // 견적서를 찾을 수 없는 경우 not-found UI 렌더링
  if (!invoice) {
    return (
      <main className="py-12">
        <Container size="md">
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <FileText className="text-muted-foreground mb-4 h-16 w-16" />
            <h1 className="mb-2 text-2xl font-bold">
              견적서를 찾을 수 없습니다
            </h1>
            <p className="text-muted-foreground text-sm">
              요청하신 견적서가 존재하지 않거나 삭제되었습니다.
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              견적서 ID: {id}
            </p>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-8 md:py-12">
      <Container size="md">
        {/* 유효기간 배너 — 인쇄 시 숨김 */}
        <div className="mb-6 print:hidden">
          <ExpiryBanner expiryDate={invoice.expiryDate} />
        </div>

        {/* 견적서 본문 영역 */}
        <div className="space-y-10">
          {/* 브랜딩 헤더 영역 */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            {/* 서비스 브랜딩 */}
            <div className="flex items-center gap-3">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-lg">
                <FileText className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold">견적서</h2>
                <p className="text-muted-foreground text-xs">
                  {/* TODO: 발행자 서비스명 연동 (노션 설정 페이지) */}
                  견적서 공유 서비스
                </p>
              </div>
            </div>

            {/* 발행자 정보 영역 */}
            <div className="text-muted-foreground text-sm sm:text-right">
              {/* TODO: 발행자 정보 연동 (상호명, 연락처, 이메일) */}
              <p className="text-foreground font-medium">홍길동 디자인</p>
              <p>contact@example.com</p>
              <p>010-0000-0000</p>
            </div>
          </div>

          <Separator />

          {/* 견적서 기본 정보 영역 */}
          <div className="space-y-4">
            {/* 견적서 제목 및 상태 */}
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold md:text-3xl">
                {invoice.title}
              </h1>
              <InvoiceStatusBadge status={invoice.status} />
            </div>

            {/* 견적서 세부 정보 그리드 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {/* 클라이언트명 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  클라이언트
                </p>
                <p className="font-semibold">{invoice.clientName}</p>
              </div>

              {/* 발행일 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  발행일
                </p>
                <p className="font-semibold">
                  {new Date(invoice.issueDate).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 유효기간 */}
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                  유효기간
                </p>
                <p className="font-semibold">
                  {new Date(invoice.expiryDate).toLocaleDateString('ko-KR')}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* 견적 항목 테이블 */}
          <div className="space-y-2">
            <h2 className="text-base font-semibold">견적 항목</h2>
            <InvoiceItemTable items={invoice.items} />
          </div>

          {/* 총액 강조 표시 영역 */}
          <div className="border-primary/20 bg-primary/5 rounded-lg border p-4 md:p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold md:text-xl">최종 합계</span>
              <span className="text-primary text-2xl font-bold md:text-3xl">
                {invoice.totalAmount.toLocaleString('ko-KR')}원
              </span>
            </div>
          </div>

          {/* PDF 다운로드 버튼 — 인쇄 시 숨김 */}
          <div className="flex justify-center pb-4 print:hidden">
            <PdfDownloadButton invoice={invoice} />
          </div>
        </div>
      </Container>
    </main>
  )
}
