import { SiteHeader } from "@/components/SiteHeader"
import { SiteFooter } from "@/components/SiteFooter"
import { ScrollProgressBar } from "@/components/ScrollProgressBar"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScrollProgressBar />
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  )
} 