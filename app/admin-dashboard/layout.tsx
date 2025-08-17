import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - Fast LC",
  description: "Admin dashboard for managing Letters of Credit and trade operations",
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  )
}
