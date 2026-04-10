# Task 011: Next.js 16 업그레이드 (DEP0169 url.parse 경고 수정)

## 개요

Node.js v24에서 추가된 `DEP0169: url.parse()` 경고가 콘솔 오류로 발생한다.  
원인은 Next.js 15.5.3이 내부적으로 `url.parse()`를 사용하기 때문이며,  
**Next.js 16.x로 업그레이드**하면 WHATWG URL API를 사용하도록 교체되어 해결된다.

## 오류 상세

```
(node:2540) [DEP0169] DeprecationWarning: `url.parse()` behavior is not standardized
and prone to errors that have security implications. Use the WHATWG URL API instead.
    at InvoiceDetailPage (<anonymous>:null:null)
```

**환경:**
- Node.js: v24.13.0 (v24에서 DEP0169 추가됨)
- Next.js: 15.5.3 → 16.2.3으로 업그레이드 대상

## 관련 파일

- `package.json` — `next`, `eslint-config-next` 버전 변경
- `next.config.ts` — v16 Breaking Change 대응 필요 시 수정
- `src/app/**/*.tsx` — v16 Breaking Change 대응 필요 시 수정

## 수락 기준

- [ ] `next` 버전이 `^16.2.3`으로 업그레이드됨
- [ ] `eslint-config-next` 버전도 동일하게 맞춤
- [ ] `npm run dev` 실행 시 DEP0169 경고 없음
- [ ] 모든 페이지 (`/`, `/invoices/[id]`, `/view/[id]`) 정상 동작
- [ ] `npm run check-all` 전체 통과
- [ ] `npm run build` 성공

## 구현 단계

### 단계 1: 변경 사항 사전 확인

Next.js 15 → 16 마이그레이션 가이드에서 Breaking Change 확인:
- App Router API 변경 여부
- `params` / `searchParams` Promise 처리 방식 변경 여부
- Server Actions 변경 여부

### 단계 2: 패키지 업그레이드

```bash
npm install next@^16.2.3 eslint-config-next@^16.2.3
```

> 주의: `react@19.1.0`, `react-dom@19.1.0`은 Next.js 16과 호환 확인 필요

### 단계 3: Breaking Change 대응

업그레이드 후 빌드 에러/경고 기준으로 수정:

- `next.config.ts` — 제거된 옵션 정리 (예: `experimental.*` 등)
- 페이지 컴포넌트 — API 변경 사항 반영

### 단계 4: 동작 검증

```bash
npm run dev        # DEP0169 경고 없는지 확인
npm run check-all  # 타입/린트/포맷 통과 확인
npm run build      # 프로덕션 빌드 성공 확인
```

## 임시 회피 방법 (업그레이드 전)

업그레이드가 즉시 어려운 경우 `package.json`의 `dev` 스크립트에 환경변수 추가:

```json
"dev": "NODE_NO_WARNINGS=1 next dev --turbopack"
```

> ⚠️ 이 방법은 모든 Node.js 경고를 숨기므로 임시 방편이다. 업그레이드가 우선.

## 테스트 체크리스트

- [ ] `npm run dev` 후 터미널에 DEP0169 경고 없음
- [ ] `/` 목록 페이지 — 노션 데이터 정상 로딩
- [ ] `/invoices/[id]` 상세 페이지 — 항목 테이블 정상 표시
- [ ] `/view/[id]` 공개 뷰어 — PDF 다운로드 정상 동작
- [ ] 새로고침 버튼 — 캐시 무효화 정상 동작
- [ ] `npm run check-all` 전체 통과
- [ ] `npm run build` 성공
