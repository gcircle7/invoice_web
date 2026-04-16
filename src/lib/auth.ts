import { createHash, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { env } from './env'

const COOKIE_NAME = 'admin-session'

// 환경변수 기반 결정론적 세션 토큰 생성
export function createSessionToken(): string {
  return createHash('sha256')
    .update(env.SESSION_SECRET + env.ADMIN_ID + env.ADMIN_PASSWORD)
    .digest('hex')
}

// 쿠키에서 세션 토큰 검증
export async function verifySession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  const expected = createSessionToken()
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected))
  } catch {
    return false
  }
}

// 세션 쿠키 설정 (로그인) — maxAge 미설정으로 브라우저 종료 시 만료
export async function setSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  })
}

// 세션 쿠키 삭제 (로그아웃)
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
