# 노션 견적서 공유 서비스

노션 데이터베이스에 입력한 견적서를 클라이언트가 고유 링크로 즉시 확인하고 PDF로 수령할 수 있는 서비스입니다.

## 🎯 프로젝트 개요

**목적**: 별도 견적서 툴 없이 노션만으로 견적 공유 업무를 자동화한다.
**사용자**: 클라이언트에게 견적서를 발송해야 하는 1인 프리랜서 및 소규모 개발자/디자이너.

## 📱 주요 페이지

1. **견적서 목록** (`/`) — 노션 DB 연동, 테이블 형태, 상태 뱃지 표시
2. **견적서 상세** (`/invoices/[id]`) — 미리보기, 고유 링크 복사
3. **공개 뷰어** (`/view/[id]`) — 클라이언트용, 인증 없음, PDF 다운로드

## ⚡ 핵심 기능

- **F001** 노션 견적서 목록 조회
- **F002** 견적서 상세 조회
- **F003** 고유 링크 생성 및 클립보드 복사
- **F004** 견적서 공개 뷰어 렌더링
- **F005** PDF 다운로드
- **F006** 견적서 상태 표시 (초안 / 발송됨 / 승인됨)
- **F007** 유효기간 표시 및 만료 안내

## 🛠️ 기술 스택

- **Framework**: Next.js 15.5.3 (App Router)
- **Runtime**: React 19 + TypeScript
- **Styling**: TailwindCSS v4 + shadcn/ui
- **Notion**: @notionhq/client
- **PDF**: @react-pdf/renderer
- **Deploy**: Vercel

## 🚀 시작하기

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local에 NOTION_TOKEN, NOTION_DATABASE_ID 입력

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

## 📋 개발 상태

- ✅ 기본 프로젝트 구조 설정
- ✅ 타입 정의 (Invoice, InvoiceItem)
- ✅ 페이지 라우팅 구조 (`/`, `/invoices/[id]`, `/view/[id]`)
- 🔄 노션 API 연동
- ⏳ 견적서 목록/상세 UI 구현
- ⏳ 공개 뷰어 렌더링
- ⏳ PDF 다운로드

## 📖 문서

- [PRD 문서](./docs/PRD.md) — 상세 요구사항
- [개발 가이드](./CLAUDE.md) — 개발 지침
