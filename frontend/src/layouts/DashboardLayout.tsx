import { Outlet } from "react-router-dom"
import Sidebar from "@/components/Sidebar"
import Header from "@/components/Header"

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        
        {/* Main scrollable area */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 bg-muted/20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
