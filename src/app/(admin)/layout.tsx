import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import { AdminLayoutClient } from '@/components/layout/admin-layout-client'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 개발 환경(Turbopack)에서는 미들웨어가 실행되지 않을 수 있으므로
  // 서버 컴포넌트에서도 세션 검증
  const isValid = await verifySession()
  if (!isValid) {
    redirect('/login')
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
