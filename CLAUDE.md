# 🤖 Claude Code 개발 지침

**노션 견적서 공유 서비스**는 노션 데이터베이스에 입력한 견적서를 클라이언트가 고유 링크로 즉시 확인하고 PDF로 수령할 수 있는 서비스입니다.

📋 상세 프로젝트 요구사항은 `@/docs/PRD.md` 참조

## 🛠️ 핵심 기술 스택

- **Framework**: Next.js 15.5.3 (App Router + Turbopack)
- **Runtime**: React 19.1.0 + TypeScript 5
- **Styling**: TailwindCSS v4 + shadcn/ui (new-york style)
- **Forms**: React Hook Form + Zod + Server Actions
- **UI Components**: Radix UI + Lucide Icons
- **Development**: ESLint + Prettier + Husky + lint-staged
- **Notion**: @notionhq/client (설치 예정)
- **PDF**: @react-pdf/renderer (설치 예정)

## 📄 라우팅 구조

| 경로             | 설명                           | 접근             |
| ---------------- | ------------------------------ | ---------------- |
| `/`              | 견적서 목록 (F001, F006)       | 관리자 직접 접속 |
| `/invoices/[id]` | 견적서 상세 (F002, F003, F006) | 목록에서 클릭    |
| `/view/[id]`     | 공개 뷰어 (F004, F005, F007)   | 고유 링크 접속   |

## 🔑 환경 변수

```bash
NOTION_TOKEN=          # 노션 API 토큰 (서버 전용)
NOTION_DATABASE_ID=    # 견적서 데이터베이스 ID (서버 전용)
NEXT_PUBLIC_APP_URL=   # 앱 URL (공개 링크 생성용)
```

## ⚠️ 개발 주의사항

- **Notion API**: `src/lib/notion.ts` 에서만 호출, 서버 컴포넌트 전용
- **PDF 생성**: `@react-pdf/renderer`는 클라이언트 전용 → `'use client'` + `dynamic(ssr: false)` 필수
- **params**: Next.js 15에서 `params`는 `Promise` → 반드시 `await params` 사용
- **견적서 상태**: `'초안' | '발송됨' | '승인됨'` (src/types/invoice.ts 참조)

## 📚 개발 가이드

- **🗺️ 개발 로드맵**: `@/docs/ROADMAP.md`
- **📋 프로젝트 요구사항**: `@/docs/PRD.md`
- **📁 프로젝트 구조**: `@/docs/guides/project-structure.md`
- **🎨 스타일링 가이드**: `@/docs/guides/styling-guide.md`
- **🧩 컴포넌트 패턴**: `@/docs/guides/component-patterns.md`
- **⚡ Next.js 15.5.3 전문 가이드**: `@/docs/guides/nextjs-15.md`
- **📝 폼 처리 완전 가이드**: `@/docs/guides/forms-react-hook-form.md`

## ⚡ 자주 사용하는 명령어

```bash
# 개발
npm run dev         # 개발 서버 실행 (Turbopack)
npm run build       # 프로덕션 빌드
npm run check-all   # 모든 검사 통합 실행 (권장)

# UI 컴포넌트
npx shadcn@latest add button    # 새 컴포넌트 추가
```

## ✅ 작업 완료 체크리스트

```bash
npm run check-all   # 모든 검사 통과 확인
npm run build       # 빌드 성공 확인
```

💡 **상세 규칙은 위 개발 가이드 문서들을 참조하세요**
