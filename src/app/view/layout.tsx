// 공개 뷰어 전용 레이아웃 — Header/Footer 없음, 인쇄 친화적
export default function ViewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen bg-white">{children}</div>
}
