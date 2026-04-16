'use server'

import { redirect } from 'next/navigation'
import { env } from '@/lib/env'
import { setSessionCookie, clearSessionCookie } from '@/lib/auth'

export async function loginAction(
  _prevState: { error: string } | null,
  formData: FormData
) {
  const id = formData.get('id') as string
  const password = formData.get('password') as string
  const from = (formData.get('from') as string) || '/'

  if (!id || !password) {
    return { error: '아이디와 비밀번호를 입력해주세요.' }
  }

  if (id !== env.ADMIN_ID || password !== env.ADMIN_PASSWORD) {
    return { error: '아이디 또는 비밀번호가 올바르지 않습니다.' }
  }

  await setSessionCookie()
  redirect(from)
}

export async function logoutAction() {
  await clearSessionCookie()
  redirect('/login')
}
