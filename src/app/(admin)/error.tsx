'use client'

// 관리자 영역 전역 에러 바운더리
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function AdminErrorPage({ error, reset }: ErrorPageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex max-w-md flex-col items-center gap-6">
        <div className="bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full">
          <AlertCircle className="text-destructive h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold">오류가 발생했습니다</h1>
          <p className="text-muted-foreground text-sm">
            페이지를 불러오는 중 문제가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="bg-muted mt-2 rounded p-2 text-left font-mono text-xs break-all">
              {error.message}
            </p>
          )}
        </div>
        <Button onClick={reset}>다시 시도</Button>
      </div>
    </div>
  )
}
