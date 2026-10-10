import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { adminApi, type UserDetail } from "@/lib/api/admin"
import { useAuth } from "@/lib/auth"

/** Role and suspension controls. The backend enforces every rule (no self-
 * revoke, never the last admin, revoke before suspend); the UI only hides
 * actions that can't apply to this user. */
export function UserActions({ user, onChanged }: { user: UserDetail; onChanged: () => void }) {
  const auth = useAuth()
  const isSelf = auth.status === "admin" && auth.me.id === user.id
  const label = user.email ?? user.id
  const done = (message: string) => () => {
    toast.success(message)
    onChanged()
  }

  return (
    <div className="flex flex-wrap gap-2">
      {user.is_admin ? (
        !isSelf && (
          <ConfirmDialog
            trigger={<Button variant="outline">Revoke admin</Button>}
            title="Revoke admin access?"
            description={`${label} will lose access to this dashboard.`}
            confirmLabel="Revoke"
            destructive
            onConfirm={() => adminApi.revokeAdmin(user.id).then(done("Admin revoked"))}
          />
        )
      ) : (
        <ConfirmDialog
          trigger={<Button variant="outline">Make admin</Button>}
          title="Grant admin access?"
          description={`${label} will be able to see every user's data and take every admin action.`}
          confirmLabel="Grant admin"
          onConfirm={() => adminApi.grantAdmin(user.id).then(done("Admin granted"))}
        />
      )}
      {user.suspended ? (
        <ConfirmDialog
          trigger={<Button variant="outline">Reactivate</Button>}
          title="Reactivate this account?"
          description={`${label} will be able to sign in and start runs again.`}
          confirmLabel="Reactivate"
          onConfirm={() => adminApi.reactivate(user.id).then(done("Account reactivated"))}
        />
      ) : (
        !user.is_admin &&
        !isSelf && (
          <ConfirmDialog
            trigger={<Button variant="destructive">Suspend</Button>}
            title="Suspend this account?"
            description={`${label} is signed out of the API immediately and their running work is cancelled.`}
            confirmLabel="Suspend"
            destructive
            withReason
            onConfirm={(reason) => adminApi.suspend(user.id, reason).then(done("Account suspended"))}
          />
        )
      )}
    </div>
  )
}
