# Task 010: 배포 및 환경 설정

## 개요

Vercel에 프로젝트를 배포하고, 프로덕션 환경변수를 설정하며, 빌드 성공을 검증한다. 로컬에서 프로덕션 빌드를 먼저 확인한 후 배포한다.

## 관련 파일

- `next.config.ts` — Next.js 설정 (필요 시 수정)
- `.env.local` — 로컬 환경변수 (Vercel 등록 참고용)
- `package.json` — 빌드 스크립트

## 수락 기준

- [ ] `npm run build` 로컬 빌드 성공 (에러/경고 없음)
- [ ] Vercel 프로젝트 연결 완료 (`vercel link` 또는 대시보드)
- [ ] Vercel 환경변수 3개 등록 완료:
  - `NOTION_TOKEN`
  - `NOTION_DATABASE_ID`
  - `NOTION_ITEMS_DATABASE_ID`
  - `NEXT_PUBLIC_APP_URL` (배포 도메인 주소)
- [ ] Vercel 배포 성공 및 프로덕션 URL에서 목록 페이지 정상 로딩
- [ ] 공개 뷰어 (`/view/[id]`) 외부 접속 확인

## 구현 단계

### 단계 1: 로컬 프로덕션 빌드 검증

```bash
npm run build
```

빌드 출력에서 확인:
- 에러 없음
- TypeScript 타입 오류 없음
- ESLint 경고/오류 없음
- 각 페이지의 번들 크기 확인

### 단계 2: Vercel CLI 설치 및 로그인 (미설치 시)

```bash
npm install -g vercel
vercel login
```

### 단계 3: Vercel 프로젝트 연결

프로젝트 루트에서:
```bash
vercel link
```

또는 Vercel 대시보드(vercel.com)에서 GitHub 연동으로 프로젝트 생성

### 단계 4: Vercel 환경변수 등록

Vercel 대시보드 → Project Settings → Environment Variables에서 등록:

| 변수명 | 환경 | 비고 |
|--------|------|------|
| `NOTION_TOKEN` | Production, Preview | 노션 Integration 토큰 |
| `NOTION_DATABASE_ID` | Production, Preview | 견적서 DB ID |
| `NOTION_ITEMS_DATABASE_ID` | Production, Preview | 항목 DB ID |
| `NEXT_PUBLIC_APP_URL` | Production | 배포된 도메인 (예: https://invoice.vercel.app) |

CLI로 등록하는 경우:
```bash
vercel env add NOTION_TOKEN
vercel env add NOTION_DATABASE_ID
vercel env add NOTION_ITEMS_DATABASE_ID
vercel env add NEXT_PUBLIC_APP_URL
```

### 단계 5: 프로덕션 배포

```bash
vercel --prod
```

또는 GitHub 연동 시 `main` 브랜치에 푸시하면 자동 배포

### 단계 6: 배포 후 검증

배포된 URL에서 확인:
- `/` — 목록 페이지 로딩 및 노션 데이터 표시
- `/invoices/[id]` — 상세 페이지 및 링크 복사
- `/view/[id]` — 공개 뷰어 및 PDF 다운로드

### 단계 7: NEXT_PUBLIC_APP_URL 업데이트 (필요 시)

배포 후 실제 도메인이 확정되면 `NEXT_PUBLIC_APP_URL`을 정확한 값으로 업데이트하고 재배포:

```bash
vercel env rm NEXT_PUBLIC_APP_URL production
vercel env add NEXT_PUBLIC_APP_URL
vercel --prod
```

## 주의사항

- `NOTION_TOKEN`은 서버 전용 변수이므로 `NEXT_PUBLIC_` 접두어를 붙이지 않음
- `NEXT_PUBLIC_APP_URL`은 클라이언트에서 링크 생성에 사용되므로 `NEXT_PUBLIC_` 필수
- Vercel의 자동 생성 도메인 형식: `https://[project-name].vercel.app`
- 커스텀 도메인 연결 시 DNS 전파에 수 분~수 시간 소요될 수 있음

## 테스트 체크리스트

- [ ] 로컬 `npm run build` 성공
- [ ] Vercel 배포 로그에 에러 없음
- [ ] 배포 URL에서 목록 페이지 노션 실데이터 표시 확인
- [ ] 배포 URL에서 링크 복사 버튼 — 복사된 URL이 프로덕션 도메인 기반인지 확인
- [ ] 배포 URL에서 PDF 다운로드 동작 확인
