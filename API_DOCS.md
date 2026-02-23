# API Documentation

**Base URL:** `http://localhost:3000`

Most protected routes require a valid JWT stored in an `httpOnly` cookie named `token`. This cookie is set automatically after a successful Google OAuth login.

---

## Authentication — `/auth`

### `GET /auth/google`

Redirects the user to Google's OAuth consent screen.

---

### `GET /auth/google/callback`

Handles the redirect from Google.

- Exchanges the authorization code for tokens.
- Creates/updates the user in MongoDB.
- Sets the `token` cookie (JWT).
- Redirects to `FRONTEND_URL`.

---

### `GET /auth/logout`

Clears the `token` cookie.

**Response (200):**

```json
{ "message": "Logged out successfully" }
```

---

### `GET /auth/calendar/test`

Test route to fetch calendar events for the first user in the database.

---

## User — `/user`

All routes under `/user` require the `token` cookie.

### `GET /user/me`

Returns the currently authenticated user's profile.

**Success Response (200):**

```json
{
  "_id": "65...",
  "name": "User Name",
  "email": "user@example.com",
  "picture": "https://...",
  "phoneNumber": "+91...",
  "refreshToken": "...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### `POST /user/phone`

Saves the user's initial phone number.

**Body:**

```json
{ "phoneNumber": "+91..." }
```

---

### `POST /user/update-phone`

Updates the user's phone number. Can be used to remove the number by sending an empty string.

**Body:**

```json
{ "phoneNumber": "+91..." }
```

---

### `GET /user/upcoming-events`

Fetches upcoming events from Google Calendar for the currently logged-in user.

**Success Response (200):**

```json
[
  {
    "id": "...",
    "summary": "Meeting",
    "start": { "dateTime": "2024-02-23T10:00:00Z" },
    "end": { "dateTime": "2024-02-23T11:00:00Z" }
  }
]
```

---

## Error Handling

All errors return a single `message` field.

**Example (401 Unauthorized):**

```json
{ "message": "Unauthorized" }
```
