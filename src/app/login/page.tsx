'use client'

import { Suspense, useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import { FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { loginAction } from './actions'

// useSearchParams를 사용하는 컴포넌트를 분리하여 Suspense 경계 처리
function LoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || '/'

  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <form action={action} className="space-y-4">
      {/* 로그인 후 복귀 경로 */}
      <input type="hidden" name="from" value={from} />

      <div className="space-y-2">
        <Label htmlFor="id">아이디</Label>
        <Input
          id="id"
          name="id"
          type="text"
          placeholder="관리자 아이디"
          autoComplete="username"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
      </div>

      {/* 오류 메시지 */}
      {state?.error && (
        <p className="text-destructive text-sm">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '로그인 중...' : '로그인'}
      </Button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* 로고 영역 */}
        <div className="mb-6 flex flex-col items-center gap-2">
          <div className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-lg">
            <FileText className="size-5" />
          </div>
          <h1 className="text-foreground text-xl font-bold">견적서 서비스</h1>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg">관리자 로그인</CardTitle>
            <CardDescription>
              관리자 아이디와 비밀번호를 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* useSearchParams는 Suspense로 감싸야 함 */}
            <Suspense fallback={<div className="h-40" />}>
              <LoginForm />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
