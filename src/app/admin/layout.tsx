import { SiteHeader } from "@/components/SiteHeader"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
    </>
  )
} 