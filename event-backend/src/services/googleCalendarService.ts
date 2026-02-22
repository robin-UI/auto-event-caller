import { google } from 'googleapis';
import { oauth2Client } from '../config/google';

export const getUpcomingEvents = async (refreshToken: string) => {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  // Automatically refreshes access token
  const calendar = google.calendar({
    version: 'v3',
    auth: oauth2Client,
  });

  //   console.log(calendar);

  const now = new Date();
  const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000);

  console.log(fiveMinutesLater);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    timeMax: fiveMinutesLater.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items;
};
