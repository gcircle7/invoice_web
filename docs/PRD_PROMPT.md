# MVP PRD 생성 메타 프롬프트

> 이 파일은 Claude Code에게 `docs/PRD.md`를 생성하도록 지시하는 메타 프롬프트입니다.
> 아래 프롬프트를 Claude Code 채팅창에 붙여넣어 실행하세요.

---

## 사용 방법

아래 `---BEGIN PROMPT---` ~ `---END PROMPT---` 사이의 텍스트를 복사하여 Claude Code에 입력하세요.

---BEGIN PROMPT---

당신은 시니어 프로덕트 매니저이자 풀스택 개발자입니다.
아래 프로젝트 컨텍스트와 요구사항을 바탕으로 `docs/PRD.md` 파일을 작성해주세요.

## 프로젝트 컨텍스트

- **프로젝트명**: 노션 기반 견적서 웹 뷰어 (invoice-web)
- **기술 스택**: Next.js 15.5.3 (App Router) + React 19 + TypeScript 5 + TailwindCSS v4 + shadcn/ui
- **개발 참조 문서**:
  - 프로젝트 구조: `@/docs/guides/project-structure.md`
  - 스타일링 가이드: `@/docs/guides/styling-guide.md`
  - 컴포넌트 패턴: `@/docs/guides/component-patterns.md`
  - Next.js 15 가이드: `@/docs/guides/nextjs-15.md`

## 핵심 문제 정의

프리랜서 또는 소규모 사업자가 노션(Notion)으로 견적서를 작성하면,
클라이언트에게 **고유 URL 링크**를 공유하여 웹에서 깔끔하게 확인하고
**PDF로 다운로드**할 수 있게 해주는 MVP 서비스가 필요합니다.

## 사용자 시나리오

**공급자(사업자) 플로우:**

1. 노션 데이터베이스에 견적서 항목을 입력한다
2. 노션 공유 설정 또는 Notion API 연동으로 데이터를 가져온다
3. 시스템이 고유 URL을 생성한다 (예: `/invoice/[slug]`)
4. 클라이언트에게 해당 URL을 공유한다

**클라이언트(수신자) 플로우:**

1. URL 링크를 받아 브라우저에서 연다
2. 전문적으로 디자인된 견적서를 웹에서 확인한다
3. PDF 다운로드 버튼을 클릭하여 견적서를 저장한다

## PRD 문서 작성 요구사항

다음 섹션을 포함하여 `docs/PRD.md`를 한국어로 작성해주세요.

### 필수 포함 섹션

1. **프로젝트 개요**
   - 배경 및 문제 정의
   - 목표 (MVP 범위 명확히)
   - 비목표 (MVP에서 제외할 항목)
   - 성공 지표 (KPI)

2. **사용자 페르소나**
   - 공급자 페르소나 (견적서 작성자)
   - 클라이언트 페르소나 (견적서 수신자)

3. **핵심 기능 요구사항 (MVP)**
   - 기능별 우선순위: Must Have / Should Have / Nice to Have
   - 각 기능의 사용자 스토리 형식으로 기술 (`As a [사용자], I want [기능], So that [이유]`)
   - 아래 기능 항목을 반드시 포함할 것:
     - [ ] Notion API 연동 및 데이터 파싱
     - [ ] 견적서 웹 뷰 페이지 (`/invoice/[slug]`)
     - [ ] 견적서 PDF 다운로드
     - [ ] 견적서 항목 구성 (공급자 정보, 클라이언트 정보, 품목 목록, 소계/세금/합계)
     - [ ] 링크 유효성 및 만료 처리 (선택)
     - [ ] 반응형 디자인 (모바일/데스크톱)

4. **데이터 모델 설계**
   - 견적서(Invoice) 스키마 정의 (TypeScript interface 형식)
   - 품목(LineItem) 스키마 정의
   - 노션 데이터베이스 필드 매핑 테이블

5. **페이지 및 라우팅 구조**
   - Next.js App Router 기반 라우트 설계
   - 각 라우트의 목적과 주요 컴포넌트 명시
   - 예시 구조:
     ```
     src/app/
     ├── invoice/
     │   └── [slug]/
     │       ├── page.tsx        # 견적서 뷰 페이지
     │       └── loading.tsx     # 로딩 UI
     ├── api/
     │   └── invoice/
     │       └── [slug]/
     │           └── route.ts    # Notion 데이터 fetch API
     └── not-found.tsx
     ```

6. **API 설계**
   - Notion API 연동 방식 (공식 SDK 사용)
   - 내부 API 엔드포인트 명세 (Method, Path, Request, Response)
   - 에러 처리 케이스

7. **UI/UX 요구사항**
   - 견적서 레이아웃 와이어프레임 (텍스트 기반 ASCII 또는 설명)
   - 견적서 필수 UI 요소 목록
   - 디자인 원칙 (shadcn/ui + TailwindCSS v4 기반)
   - PDF 출력 시 고려사항 (인쇄 최적화)

8. **기술 구현 가이드라인**
   - Notion API 연동 라이브러리: `@notionhq/client`
   - PDF 생성 방식 선택 근거: `react-pdf` 또는 브라우저 `window.print()` 방식 비교
   - 환경변수 목록 (`.env.local` 필요 항목)
   - 캐싱 전략 (Next.js fetch cache 활용)

9. **MVP 개발 로드맵**
   - Phase 1 ~ Phase 3 단계별 작업 항목
   - 각 Phase의 완료 조건 (Definition of Done)

10. **리스크 및 제약사항**
    - Notion API 제한사항 (Rate limit 등)
    - PDF 생성 브라우저 호환성
    - 보안 고려사항 (견적서 URL 노출 범위)

## 작성 스타일 지침

- 언어: 한국어 (코드, 기술 용어, 변수명은 영어 유지)
- 형식: GitHub Flavored Markdown
- 개발자가 바로 구현에 착수할 수 있을 정도로 구체적으로 작성
- 모호한 표현 금지 — 수치와 예시 코드를 적극 활용
- TypeScript interface, 라우트 구조, API 명세는 코드 블록으로 표현
- MVP 범위를 명확히 하여 범위 확장(scope creep) 방지

## 출력 파일

`docs/PRD.md` 파일을 생성하고, 완료 후 아래를 확인해주세요:

- [ ] 모든 섹션이 포함되었는가
- [ ] TypeScript 타입 정의가 실제 구현 가능한 수준인가
- [ ] Notion 데이터베이스 필드 매핑이 명확한가
- [ ] PDF 다운로드 구현 방식이 명시되었는가
- [ ] MVP 범위와 비목표가 명확히 구분되었는가

---END PROMPT---
