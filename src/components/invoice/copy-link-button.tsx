'use client'

// 견적서 공개 링크를 클립보드에 복사하는 버튼 컴포넌트
// 복사 완료 시 아이콘과 텍스트가 변경되며 2초 후 원래 상태로 복귀합니다
import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'

interface CopyLinkButtonProps {
  invoiceId: string
  // 버튼 크기 변형 — 상단 헤더 영역: 'sm', 하단 액션 영역: 'default'
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
  className?: string
}

export function CopyLinkButton({
  invoiceId,
  size = 'default',
  variant = 'outline',
  className,
}: CopyLinkButtonProps) {
  // 복사 완료 상태 — true일 때 체크 아이콘과 "복사됨!" 텍스트 표시
  const [isCopied, setIsCopied] = useState(false)

  // 공개 뷰어 링크를 클립보드에 복사하는 핸들러
  const handleCopy = async () => {
    // 환경변수 → window.location.origin 순으로 fallback
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin
    const url = `${appUrl}/view/${invoiceId}`

    const markCopied = () => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }

    try {
      // 1차: Clipboard API (모던 브라우저)
      await navigator.clipboard.writeText(url)
      markCopied()
    } catch {
      // 2차: execCommand 폴백 (삼성 인터넷 등 구형 브라우저)
      try {
        const textarea = document.createElement('textarea')
        textarea.value = url
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.focus()
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
        markCopied()
      } catch {
        // 3차: 모든 방법 실패 시 에러 토스트
        toast.error('링크 복사에 실패했습니다')
      }
    }
  }

  return (
    <Button
      size={size}
      variant={variant}
      className={className}
      onClick={handleCopy}
      aria-label={isCopied ? '링크가 복사되었습니다' : '공개 링크 복사'}
    >
      {/* 복사 완료 여부에 따라 아이콘 전환 */}
      {isCopied ? (
        <Check className="mr-2 h-4 w-4" />
      ) : (
        <Copy className="mr-2 h-4 w-4" />
      )}
      {isCopied ? '복사됨!' : '링크 복사'}
    </Button>
  )
}
