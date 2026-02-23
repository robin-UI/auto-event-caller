export interface User {
  id: string;
  email: string;
  phoneNumber: string | null;
  name: string | null;
  picture: string | null;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  location?: string;
  htmlLink?: string;
}
