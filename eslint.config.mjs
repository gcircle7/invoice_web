// Next.js 16 Flat Config 방식 — eslint-config-next가 배열을 직접 반환
import nextConfig from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import eslintConfigPrettier from 'eslint-config-prettier'

const eslintConfig = [
  // Next.js 기본 규칙 + Core Web Vitals 규칙
  ...nextCoreWebVitals,
  // TypeScript 규칙 포함 (eslint-config-next에 내장)
  // Prettier와 충돌하는 규칙 비활성화
  eslintConfigPrettier,
  {
    // 빌드 산출물 및 자동 생성 파일 제외
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
    ],
  },
]

export default eslintConfig
