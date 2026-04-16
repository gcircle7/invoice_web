import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'admin-session'
const PUBLIC_PATHS = ['/login', '/view']

// Edge Runtime에서는 crypto.subtle (Web Crypto API) 사용
async function sha256Hex(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 상수 시간 비교 (타이밍 공격 방지)
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 공개 경로는 통과
  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // 세션 쿠키 검증
  const token = request.cookies.get(COOKIE_NAME)?.value

  let valid = false
  if (token) {
    const sessionSecret = process.env.SESSION_SECRET
    const adminId = process.env.ADMIN_ID
    const adminPassword = process.env.ADMIN_PASSWORD

    if (sessionSecret && adminId && adminPassword) {
      const expected = await sha256Hex(sessionSecret + adminId + adminPassword)
      valid = constantTimeEqual(token, expected)
    }
  }

  if (!valid) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|fonts|.*\\.png).*)'],
}
