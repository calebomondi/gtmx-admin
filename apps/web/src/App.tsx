import { lazy, Suspense } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { Skeleton } from "@workspace/ui/components/skeleton"

import { AdminLayout } from "@/components/admin-layout"
import { AuthCallbackPage } from "@/features/auth/auth-callback-page"

// One chunk per page: recharts only loads with the overview.
const page = <K extends string>(load: () => Promise<Record<K, React.ComponentType>>, name: K) =>
  lazy(() => load().then((m) => ({ default: m[name] })))

const OverviewPage = page(() => import("@/features/overview/overview-page"), "OverviewPage")
const UsersPage = page(() => import("@/features/users/users-page"), "UsersPage")
const UserDetailPage = page(() => import("@/features/users/user-detail-page"), "UserDetailPage")
const LacesPage = page(() => import("@/features/laces/laces-page"), "LacesPage")
const LaceDetailPage = page(() => import("@/features/laces/lace-detail-page"), "LaceDetailPage")
const RunsPage = page(() => import("@/features/runs/runs-page"), "RunsPage")
const RunDetailPage = page(() => import("@/features/runs/run-detail-page"), "RunDetailPage")
const QuestionsPage = page(() => import("@/features/questions/questions-page"), "QuestionsPage")
const FeedbackPage = page(() => import("@/features/feedback/feedback-page"), "FeedbackPage")
const AuditPage = page(() => import("@/features/audit/audit-page"), "AuditPage")
const WaitlistPage = page(() => import("@/features/waitlist/waitlist-page"), "WaitlistPage")

export function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Skeleton className="m-6 h-[80svh]" />}>
        <Routes>
          <Route path="auth/callback" element={<AuthCallbackPage />} />
          <Route element={<AdminLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:userId" element={<UserDetailPage />} />
            <Route path="laces" element={<LacesPage />} />
            <Route path="laces/:laceId" element={<LaceDetailPage />} />
            <Route path="runs" element={<RunsPage />} />
            <Route path="runs/:runId" element={<RunDetailPage />} />
            <Route path="questions" element={<QuestionsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route path="waitlist" element={<WaitlistPage />} />
            <Route path="audit" element={<AuditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
