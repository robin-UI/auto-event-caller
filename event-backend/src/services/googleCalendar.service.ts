import { google } from 'googleapis';
import { oauth2Client } from '../config/google';

export const getUpcomingEvents = async (
  refreshToken: string,
  // nextTime?: string,
) => {
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
  // const fiveMinutesLater = new Date(Date.now() + 5 * 60 * 1000);

  const response = await calendar.events.list({
    calendarId: 'primary',
    timeMin: now.toISOString(),
    // timeMax: nextTime || fiveMinutesLater.toISOString(),
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 50,
  });

  return response.data.items;
};
