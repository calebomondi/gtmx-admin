import type { ComponentProps } from "react"
import { NavLink } from "react-router-dom"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar"
import {
  BellIcon,
  ChartLineIcon,
  FoldersIcon,
  LightningIcon,
  ScrollIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UsersIcon,
} from "@phosphor-icons/react"

import { NavUser } from "@/components/nav-user"
import type { Me } from "@/lib/api/admin"

const NAV = [
  { to: "/", label: "Overview", icon: ChartLineIcon, end: true },
  { to: "/users", label: "Users", icon: UsersIcon },
  { to: "/runs", label: "Runs", icon: LightningIcon },
  { to: "/workspaces", label: "Workspaces", icon: FoldersIcon },
  { to: "/signals", label: "Signals", icon: BellIcon },
  { to: "/waitlist", label: "Waitlist", icon: UserPlusIcon },
  { to: "/audit", label: "Audit log", icon: ScrollIcon },
]

export function AppSidebar({ me, ...props }: ComponentProps<typeof Sidebar> & { me: Me }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="data-[slot=sidebar-menu-button]:p-1.5!">
              <ShieldCheckIcon className="size-5!" />
              <span className="text-base font-semibold">GTMX Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <SidebarMenuItem key={to}>
                  <NavLink to={to} end={end}>
                    {({ isActive }) => (
                      <SidebarMenuButton isActive={isActive} tooltip={label}>
                        <Icon />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    )}
                  </NavLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser me={me} />
      </SidebarFooter>
    </Sidebar>
  )
}
