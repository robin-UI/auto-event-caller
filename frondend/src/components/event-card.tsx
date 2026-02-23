// ── Event Card ─────────────────────────────────────────────────────────────────

import { CalendarEvent } from "@/types";
import { formatEventDate } from "@/lib/helper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

export default function EventCard({ event }: { event: CalendarEvent }) {
  const startLabel = formatEventDate(event.start.dateTime, event.start.date);
  const endLabel = formatEventDate(event.end.dateTime, event.end.date);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-base leading-snug line-clamp-2">
          {event.summary || "Untitled Event"}
        </CardTitle>
        <CardDescription className="text-xs">
          {startLabel} → {endLabel}
        </CardDescription>
      </CardHeader>
      {(event.location || event.description) && (
        <CardContent className="pt-0 space-y-1">
          {event.location && (
            <p className="text-xs text-muted-foreground flex gap-1 items-center">
              <span>📍</span> {event.location}
            </p>
          )}
          {event.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
