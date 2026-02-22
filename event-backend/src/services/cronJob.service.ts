import cron from 'node-cron';
import { prisma } from '../lib/prisma';
import { google } from 'googleapis';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!,
);

// Run every minute
cron.schedule('* * * * *', async () => {
  console.log('Checking upcoming events...');

  const users = await prisma.user.findMany();

  for (const user of users) {
    if (!user.refreshToken) continue;

    try {
      // Create OAuth client
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
      );

      oauth2Client.setCredentials({
        refresh_token: user.refreshToken,
      });

      const calendar = google.calendar({
        version: 'v3',
        auth: oauth2Client,
      });

      const now = new Date();
      const fiveMinutesLater = new Date(now.getTime() + 5 * 60000);

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: now.toISOString(),
        timeMax: fiveMinutesLater.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.data.items;

      if (events && events.length > 0) {
        console.log(`Event found for user ${user.email}`);

        // Trigger Twilio call
        await twilioClient.calls.create({
          to: user.phoneNumber!,
          from: process.env.TWILIO_PHONE_NUMBER!,
          twiml: `<Response><Say>Hi, ${user?.name || ''}. You have an upcoming event in 5 minutes.</Say></Response>`,
        });

        console.log('Call triggered.');
      }
    } catch (error) {
      console.error('Error checking events:', error);
    }
  }
});
