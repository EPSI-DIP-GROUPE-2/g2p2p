## Contacts

### Get All Contacts

**Endpoint:** `GET /api/contacts`
**Description:** Retrieves a list of all contacts for the authenticated user. Requires a valid `accessToken` cookie.

**Headers / Cookies:**

- Must include `accessToken` cookie issued by `/api/login`.

**Response:**

- **200 OK**

```json
{
	"status": 200,
	"data": [
		{
			"id": 1,
			"username": "alice",
			"public_key": "-----BEGIN PUBLIC KEY-----...",
			"identifier": "abc123hash",
			"createdAt": "2025-01-01T12:00:00.000Z",
			"updatedAt": "2025-01-02T12:00:00.000Z"
		},
		{
			"id": 2,
			"username": "bob",
			"public_key": "-----BEGIN PUBLIC KEY-----...",
			"identifier": "def456hash",
			"createdAt": "2025-01-03T12:00:00.000Z",
			"updatedAt": "2025-01-04T12:00:00.000Z"
		}
	]
}
```

- **401 Unauthorized** (missing or invalid token)

```json
{
	"status": 401,
	"message": "Unauthorized Request",
	"type": "unauthorized",
	"errors": []
}
```

- **500 Unexpected Error**

```json
{
	"status": 500,
	"message": "Unexpected Error.",
	"type": "unexpected",
	"errors": []
}
```

**Notes:**

- Uses `authMiddleware` to verify JWT.
- Each contact object includes `id`, `username`, `public_key`, `identifier`, `createdAt`, and `updatedAt`.
- Sensitive fields (if any) are omitted.
- Returned data is scoped to the authenticated user’s accessible contacts.
