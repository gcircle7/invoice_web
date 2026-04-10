// PDF 견적서 템플릿 컴포넌트
// @react-pdf/renderer로 렌더링 — 클라이언트 사이드 전용 (SSR 불가)
// 한글 표시를 위해 맑은 고딕(MalgunGothic) 폰트 사용
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer'
import type { Invoice } from '@/types/invoice'

// 한글 폰트 등록 — 미등록 시 한글이 빈 사각형으로 표시됨
Font.register({
  family: 'MalgunGothic',
  fonts: [
    { src: '/fonts/MalgunGothic.ttf', fontWeight: 'normal' },
    { src: '/fonts/MalgunGothic-Bold.ttf', fontWeight: 'bold' },
  ],
})

const styles = StyleSheet.create({
  page: {
    fontFamily: 'MalgunGothic',
    fontSize: 10,
    padding: 48,
    color: '#111827',
  },
  // 헤더 영역
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingBottom: 20,
    borderBottom: '1pt solid #e5e7eb',
  },
  docTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  docNumber: {
    fontSize: 11,
    color: '#6b7280',
  },
  issuerBlock: {
    textAlign: 'right',
  },
  issuerName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  issuerContact: {
    fontSize: 9,
    color: '#6b7280',
    marginBottom: 1,
  },
  // 기본 정보 그리드
  infoGrid: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 28,
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: '#9ca3af',
    textTransform: 'uppercase',
    marginBottom: 3,
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  // 구분선
  divider: {
    borderBottom: '1pt solid #e5e7eb',
    marginBottom: 20,
  },
  // 섹션 제목
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  // 항목 테이블
  table: {
    marginBottom: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    borderBottom: '1pt solid #e5e7eb',
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '0.5pt solid #f3f4f6',
    paddingVertical: 7,
    paddingHorizontal: 8,
  },
  colName: { flex: 3, fontSize: 9 },
  colQty: { flex: 1, textAlign: 'right', fontSize: 9 },
  colPrice: { flex: 2, textAlign: 'right', fontSize: 9 },
  colAmount: { flex: 2, textAlign: 'right', fontSize: 9 },
  tableHeaderText: {
    fontWeight: 'bold',
    color: '#374151',
    fontSize: 9,
  },
  // 합계 영역
  totalBlock: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
    paddingTop: 12,
    borderTop: '1pt solid #e5e7eb',
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 24,
  },
  totalAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  // 푸터
  footer: {
    position: 'absolute',
    bottom: 32,
    left: 48,
    right: 48,
    textAlign: 'center',
    fontSize: 8,
    color: '#9ca3af',
    borderTop: '0.5pt solid #e5e7eb',
    paddingTop: 8,
  },
})

interface InvoicePdfProps {
  invoice: Invoice
}

export function InvoicePdf({ invoice }: InvoicePdfProps) {
  const issueDateStr = invoice.issueDate
    ? new Date(invoice.issueDate).toLocaleDateString('ko-KR')
    : '-'
  const expiryDateStr = invoice.expiryDate
    ? new Date(invoice.expiryDate).toLocaleDateString('ko-KR')
    : '-'

  const formatAmount = (n: number) => n.toLocaleString('ko-KR') + '원'

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* 헤더: 견적서 제목 + 발행자 정보 */}
        <View style={styles.header}>
          <View>
            <Text style={styles.docTitle}>견적서</Text>
            <Text style={styles.docNumber}>{invoice.title}</Text>
          </View>
          <View style={styles.issuerBlock}>
            {/* TODO: 노션 설정 연동 후 발행자 정보 동적 처리 예정 */}
            <Text style={styles.issuerName}>홍길동 디자인</Text>
            <Text style={styles.issuerContact}>contact@example.com</Text>
            <Text style={styles.issuerContact}>010-0000-0000</Text>
          </View>
        </View>

        {/* 기본 정보: 클라이언트, 발행일, 유효기간 */}
        <View style={styles.infoGrid}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>클라이언트</Text>
            <Text style={styles.infoValue}>{invoice.clientName}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>발행일</Text>
            <Text style={styles.infoValue}>{issueDateStr}</Text>
          </View>
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>유효기간</Text>
            <Text style={styles.infoValue}>{expiryDateStr}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* 견적 항목 테이블 */}
        <Text style={styles.sectionTitle}>견적 항목</Text>
        <View style={styles.table}>
          {/* 헤더 행 */}
          <View style={styles.tableHeader}>
            <Text style={[styles.colName, styles.tableHeaderText]}>항목명</Text>
            <Text style={[styles.colQty, styles.tableHeaderText]}>수량</Text>
            <Text style={[styles.colPrice, styles.tableHeaderText]}>단가</Text>
            <Text style={[styles.colAmount, styles.tableHeaderText]}>금액</Text>
          </View>
          {/* 데이터 행 */}
          {invoice.items.map(item => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={styles.colName}>{item.itemName}</Text>
              <Text style={styles.colQty}>{item.quantity}</Text>
              <Text style={styles.colPrice}>
                {formatAmount(item.unitPrice)}
              </Text>
              <Text style={styles.colAmount}>{formatAmount(item.amount)}</Text>
            </View>
          ))}
        </View>

        {/* 합계 */}
        <View style={styles.totalBlock}>
          <Text style={styles.totalLabel}>최종 합계</Text>
          <Text style={styles.totalAmount}>
            {formatAmount(invoice.totalAmount)}
          </Text>
        </View>

        {/* 페이지 푸터 */}
        <Text style={styles.footer}>
          본 견적서는 견적서 공유 서비스로 생성되었습니다.
        </Text>
      </Page>
    </Document>
  )
}
