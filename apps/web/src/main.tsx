import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { Toaster } from "@workspace/ui/components/sonner"
import { TooltipProvider } from "@workspace/ui/components/tooltip"

import "@workspace/ui/globals.css"
import { App } from "@/App"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/auth"
import { initSentry } from "@/lib/sentry"

initSentry()

const root = document.getElementById("root")
if (!root) throw new Error("index.html is missing #root")

createRoot(root).render(
  <StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </StrictMode>,
)
