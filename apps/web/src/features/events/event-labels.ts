import type { EventName } from "@/lib/api/admin"

/** How each event reads in the dashboard. */
export const EVENT_LABEL: Record<EventName, string> = {
  page_viewed: "Viewed a page",
  setup_phase: "Lace setup reached",
  lace_settings_opened: "Opened a Lace's settings",
  lace_people_opened: "Opened a Lace's people",
  chat_thread_switched: "Switched chat",
  quick_ask_used: "Used a quick ask",
  contact_opened: "Opened a contact",
  search_opened: "Opened search",
  feedback_opened: "Opened feedback",
}

export function eventLabel(name: string): string {
  return EVENT_LABEL[name as EventName] ?? name.replaceAll("_", " ")
}
