'use server'

// 서버 액션 모음 — 캐시 무효화 등 서버 측 작업을 클라이언트에서 호출할 때 사용
import { revalidatePath } from 'next/cache'

/**
 * 견적서 목록 캐시 무효화
 * RefreshButton 컴포넌트에서 호출되어 최신 노션 데이터를 반영합니다
 */
export async function revalidateInvoices() {
  revalidatePath('/')
}
