'use client'

// 견적서 목록 새로고침 버튼 — 클라이언트 이벤트 핸들러를 위해 분리
// Server Action을 호출하여 캐시를 무효화하고 최신 데이터를 불러옵니다
import { useTransition } from 'react'
import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { revalidateInvoices } from '@/app/actions'

export function RefreshButton() {
  // isPending: 서버 액션 처리 중 여부 — 로딩 UI 표시에 활용
  const [isPending, startTransition] = useTransition()

  // 새로고침 버튼 클릭 핸들러 — Server Action으로 캐시 무효화
  const handleRefresh = () => {
    startTransition(() => revalidateInvoices())
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isPending}
      aria-label="견적서 목록 새로고침"
    >
      {/* 처리 중일 때 회전 애니메이션 적용 */}
      <RefreshCw className={isPending ? 'animate-spin' : ''} />
      새로고침
    </Button>
  )
}
