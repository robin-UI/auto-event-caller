// ── Helpers ────────────────────────────────────────────────────────────────────

export function formatEventDate(dateTime?: string, date?: string): string {
  const raw = dateTime ?? date;
  if (!raw) return "TBD";
  const d = new Date(raw);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(dateTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  });
}
