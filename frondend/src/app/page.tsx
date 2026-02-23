"use client";

import { useEffect, useState } from "react";
import PhoneForm from "@/components/phone-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import { CalendarEvent, User } from "@/types";
import Header from "@/components/layout/header";
import UpdatePhoneDialog from "@/components/update-phone-dialog";
import DeletePhoneDialog from "@/components/delete-phone-dialog";
import EventCard from "@/components/event-card";

export default function Home() {
  const [userData, setUserData] = useState<User | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);

  // Fetch logged-in user
  const fetchUser = async () => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_BASE_URL + "/user/me", {
        credentials: "include",
      });
      if (!res.ok) {
        setUserData(null);
        return;
      }
      const data = await res.json();
      setUserData(data);
    } catch {
      setUserData(null);
    }
  };

  // Fetch upcoming events from Google Calendar
  const fetchEvents = async () => {
    setEventsLoading(true);
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + "/user/upcoming-events",
        {
          credentials: "include",
        },
      );
      if (res.ok) {
        setEvents(await res.json());
      }
    } catch {
      /* ignore */
    }
    setEventsLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Once we know the user has a phone number, fetch events
  useEffect(() => {
    if (userData?.phoneNumber) fetchEvents();
  }, [userData?.phoneNumber]);

  // Refresh user data (after phone update / delete)
  const refresh = () => {
    fetchUser();
    setEvents([]);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <Header user={userData} />

      {/* ── Main content ── */}
      <main className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {userData?.phoneNumber ? (
          <>
            {/* Phone number info card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Your Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <p className="text-xl font-semibold">
                    {userData.phoneNumber}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    SMS event reminders will be sent to this number.
                  </p>
                </div>
                <div className="flex gap-2">
                  <UpdatePhoneDialog onDone={refresh} />
                  <DeletePhoneDialog onDone={refresh} />
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Upcoming events */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Upcoming Events</h2>

              {eventsLoading ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardHeader className="pb-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2 mt-1" />
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              ) : events.length > 0 ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              ) : (
                <Card className="py-10">
                  <CardContent className="flex flex-col items-center gap-2 text-center">
                    <p className="text-2xl">📭</p>
                    <p className="text-sm text-muted-foreground">
                      No upcoming events found in your Google Calendar.
                    </p>
                  </CardContent>
                </Card>
              )}
            </section>
          </>
        ) : (
          /* No phone number yet → show form */
          <div className="flex min-h-[60vh] items-center justify-center">
            <Card className="w-full max-w-sm">
              <CardHeader>
                <CardTitle>Add Your Phone Number</CardTitle>
                <CardDescription>
                  We'll send you SMS reminders for your upcoming Google Calendar
                  events.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PhoneForm />
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
