import { Link } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@workspace/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"

import { ConfirmDialog } from "@/components/confirm-dialog"
import { adminApi, type LaceDetail } from "@/lib/api/admin"
import { formatDateTime } from "@/lib/format"

/** A Lace made before one Lace per startup, sharing its website's domain
 * with an older one: who holds the domain, and the two ways to fix it. The
 * backend refuses either when it can't apply (a Lace still working, an
 * archived holder) and says why. */
export function DomainClashCard({ lace, onChanged }: { lace: LaceDetail; onChanged: () => void }) {
  const holder = lace.clashes_with
  const domain = domainOf(lace.website)
  const done = (message: string) => () => {
    toast.success(message)
    onChanged()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shares its domain with another Lace</CardTitle>
        <CardDescription>
          {holder ? (
            <>
              <Link className="underline-offset-4 hover:underline" to={`/laces/${holder.id}`}>
                {holder.name}
              </Link>{" "}
              ({holder.user_email ?? holder.user_id}, created {formatDateTime(holder.created_at)}
              {holder.status === "archived" && ", archived"}) holds {domain}. A startup has one
              Lace, so this one has none of its own.
            </>
          ) : (
            <>No Lace holds {domain} now. Give it to this one.</>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {holder && holder.status !== "archived" && (
          <ConfirmDialog
            trigger={<Button variant="outline">Fold into {holder.name}</Button>}
            title={`Fold ${lace.name} into ${holder.name}?`}
            description={`Its people join ${holder.name} (its owner as an admin) and ${lace.name} is archived. Its facts and finds stay on the archived Lace; they aren't merged.`}
            confirmLabel="Fold in"
            onConfirm={() => adminApi.foldLace(lace.id).then(done(`${lace.name}'s people joined ${holder.name}`))}
          />
        )}
        <ConfirmDialog
          trigger={<Button variant="outline">Give it {domain}</Button>}
          title={`Make ${lace.name} the startup's Lace?`}
          description={
            holder
              ? `${lace.name} takes ${domain}. ${holder.name} loses it and shows as the duplicate instead.`
              : `${lace.name} takes ${domain}.`
          }
          confirmLabel={`Give it ${domain}`}
          onConfirm={() => adminApi.takeLaceDomain(lace.id).then(done(`${lace.name} now holds ${domain}`))}
        />
      </CardContent>
    </Card>
  )
}

/** The host a website is known by, as the backend keys Laces (no "www."). */
function domainOf(website: string): string {
  try {
    return new URL(website).hostname.replace(/^www\./, "")
  } catch {
    return website
  }
}
