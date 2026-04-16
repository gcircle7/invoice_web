'use client'

import { useState } from 'react'
import Link from 'next/link'
import { LogOut, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { ThemeToggle } from '@/components/theme-toggle'
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { logoutAction } from '@/app/login/actions'

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
      {/* 상단 헤더 바 */}
      <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-14 shrink-0 items-center justify-between border-b px-4 backdrop-blur">
        <div className="flex items-center gap-2">
          {/* 모바일 햄버거 메뉴 */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">메뉴 열기</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-56 p-0">
              <SheetTitle className="flex h-14 items-center border-b px-4 font-bold">
                견적서 서비스
              </SheetTitle>
              <AdminSidebar onClose={() => setMobileOpen(false)} />
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-bold">
            견적서 서비스
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* 로그아웃 버튼 */}
          <form action={logoutAction}>
            <Button variant="ghost" size="icon" type="submit" title="로그아웃">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">로그아웃</span>
            </Button>
          </form>
        </div>
      </header>

      {/* 바디 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 데스크탑 사이드바 */}
        <aside className="bg-sidebar hidden w-56 shrink-0 border-r md:flex md:flex-col">
          <AdminSidebar />
        </aside>

        <Separator orientation="vertical" className="hidden md:block" />

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  )
}
