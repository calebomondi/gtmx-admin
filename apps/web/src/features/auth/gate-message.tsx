import { Button } from "@workspace/ui/components/button"

import { signOut } from "@/lib/auth"

export function GateMessage({ title, detail }: { title: string; detail: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="max-w-md text-sm text-muted-foreground">{detail}</p>
      <Button variant="outline" onClick={() => void signOut()}>
        Sign out
      </Button>
    </div>
  )
}
