# API Documentation

**Base URL:** `http://localhost:3000`

All protected routes require a valid JWT stored in an `httpOnly` cookie named `token`. The cookie is set automatically after a successful Google login.

---

## Authentication — `/auth`

### `GET /auth/google`

Redirects the user to Google's OAuth consent screen.

**Use:** Open this URL in a browser to begin the login flow.

---

### `GET /auth/google/callback`

Handles the redirect from Google after the user grants access.

- Exchanges the authorization code for tokens
- Creates or updates the user in the database
- Sets a JWT cookie (`token`) valid for **7 days**
- Redirects to the frontend (`http://localhost:3001`)

| Parameter | Location     | Description                                   |
| --------- | ------------ | --------------------------------------------- |
| `code`    | Query string | OAuth authorization code (provided by Google) |

**Success:** Redirects to frontend  
**Error `400`:** No code provided or no email returned from Google  
**Error `500`:** Authentication failed

---

### `GET /auth/calendar/test`

Returns upcoming Google Calendar events for the first user in the database.

> This is a test route. It does not require authentication.

**Success `200`:**

```json
[
  {
    "summary": "Team Meeting",
    "start": { "dateTime": "2024-07-15T10:00:00+05:30" },
    "end": { "dateTime": "2024-07-15T11:00:00+05:30" }
  }
]
```

**Error `400`:** No refresh token found for the user

---

## User — `/user`

All routes under `/user` require authentication (JWT cookie).

### `GET /user/me`

Returns the profile of the currently authenticated user.

**Headers / Cookies:** `token` (set automatically after login)

**Success `200`:**

```json
{
  "id": "clxyz123",
  "email": "user@example.com",
  "name": "John Doe",
  "phoneNumber": "+917890123456",
  "refreshToken": "..."
}
```

**Error `401`:** Unauthorized  
**Error `404`:** User not found

---

### `POST /user/phone`

Saves or updates the phone number for the authenticated user.

**Headers / Cookies:** `token` (set automatically after login)

**Request Body:**

```json
{
  "phoneNumber": "+917890123456"
}
```

**Success `200`:**

```json
{
  "message": "Phone number saved successfully"
}
```

**Error `400`:** Phone number required  
**Error `401`:** Unauthorized

---

## Error Format

All error responses follow this shape:

```json
{
  "message": "Description of the error"
}
```
