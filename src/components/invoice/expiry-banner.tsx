// 견적서 유효기간 안내 배너 컴포넌트
// 유효기간 이전: 유효기간 안내 표시
// 유효기간 이후: 만료 경고 표시
import { AlertCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ExpiryBannerProps {
  expiryDate: string // ISO 8601 날짜 문자열 (예: "2026-04-29")
}

/**
 * 날짜 문자열을 한국어 형식으로 포맷합니다
 * @param dateStr ISO 8601 날짜 문자열
 * @returns "2026년 4월 29일" 형식의 문자열
 */
function formatExpiryDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ExpiryBanner({ expiryDate }: ExpiryBannerProps) {
  // 현재 날짜와 유효기간 비교하여 만료 여부 판단
  const isExpired = new Date(expiryDate) < new Date()

  if (isExpired) {
    return (
      <Alert variant="destructive">
        <AlertTriangle />
        <AlertTitle>견적서 만료</AlertTitle>
        <AlertDescription>이 견적서는 만료되었습니다.</AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="default">
      <AlertCircle />
      <AlertTitle>유효기간 안내</AlertTitle>
      <AlertDescription>
        유효기간: {formatExpiryDate(expiryDate)}까지
      </AlertDescription>
    </Alert>
  )
}
