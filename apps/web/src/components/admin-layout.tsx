import type { CSSProperties } from "react"
import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@workspace/ui/components/sidebar"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { AppSidebar } from "@/components/app-sidebar"
import { GateMessage } from "@/features/auth/gate-message"
import { LoginPage } from "@/features/auth/login-page"
import { useAuth } from "@/lib/auth"

// Tablets start with the offcanvas sidebar closed so tables get the width;
// the header's trigger opens it.
const SIDEBAR_EXPANDED_FROM = 1024
const sidebarOpenByDefault = () => typeof window === "undefined" || window.innerWidth >= SIDEBAR_EXPANDED_FROM

/** Every admin route renders through here: signed out shows the login,
 * a non-admin is turned away, only a verified admin sees the console. */
export function AdminLayout() {
  const auth = useAuth()
  if (auth.status === "loading") return <Skeleton className="m-6 h-[80svh]" />
  if (auth.status === "signed-out") return <LoginPage />
  if (auth.status === "forbidden") {
    return <GateMessage title="Not an admin" detail={`${auth.email ?? "This account"} doesn't have admin access. Ask an existing admin to grant it.`} />
  }
  if (auth.status === "error") return <GateMessage title="Can't reach the API" detail={auth.message} />
  return (
    <SidebarProvider
      defaultOpen={sidebarOpenByDefault()}
      style={{ "--sidebar-width": "calc(var(--spacing) * 64)", "--header-height": "calc(var(--spacing) * 12)" } as CSSProperties}
    >
      <AppSidebar variant="inset" me={auth.me} />
      <SidebarInset className="min-w-0">
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
