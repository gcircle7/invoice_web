'use client'

// PDF 다운로드 버튼 컴포넌트
// @react-pdf/renderer는 SSR 불가 → 클릭 시점에 동적 import 처리
// 인쇄 시 숨김 처리 (print:hidden)
import { useState } from 'react'
import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Invoice } from '@/types/invoice'

interface PdfDownloadButtonProps {
  invoice: Invoice
  className?: string
}

export function PdfDownloadButton({
  invoice,
  className,
}: PdfDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // 클릭 시점에 동적 import → 초기 번들에 포함 안됨 (SSR 에러 방지)
      const { pdf } = await import('@react-pdf/renderer')
      const { InvoicePdf } = await import('./invoice-pdf')

      const blob = await pdf(<InvoicePdf invoice={invoice} />).toBlob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url

      // 파일명: 견적서_[클라이언트명]_[발행일yyyymmdd].pdf
      const dateStr = invoice.issueDate
        ? invoice.issueDate.slice(0, 10).replace(/-/g, '')
        : 'unknown'
      link.download = `견적서_${invoice.clientName}_${dateStr}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Download className="mr-2 h-4 w-4" />
      )}
      {isLoading ? 'PDF 생성 중...' : 'PDF 다운로드'}
    </Button>
  )
}
