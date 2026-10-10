import { Link } from "react-router-dom"
import { ArrowLeftIcon } from "@phosphor-icons/react"

export function BackLink({ to, label }: { to: string; label: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
      <ArrowLeftIcon className="size-3.5" />
      {label}
    </Link>
  )
}
