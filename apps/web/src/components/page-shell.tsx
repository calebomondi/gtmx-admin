import type { ReactNode } from "react"

import { SiteHeader } from "@/components/site-header"

export function PageShell({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <>
      <SiteHeader title={title} />
      <div className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        {children}
      </div>
    </>
  )
}
