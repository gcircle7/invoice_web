'use client'

// 견적서 상세 페이지 전용 에러 바운더리
import Link from 'next/link'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function InvoiceDetailError({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">견적서를 불러올 수 없습니다</h1>
          <p className="text-muted-foreground text-sm">
            견적서 정보를 가져오는 중 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도하거나 목록으로 돌아가주세요.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="bg-muted mt-2 rounded p-2 text-left font-mono text-xs break-all">
              {error.message}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={reset}>다시 시도</Button>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              목록으로
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
