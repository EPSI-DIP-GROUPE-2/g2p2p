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
			"identifier": "abc123hash",
			"createdAt": "2025-01-01T12:00:00.000Z",
			"updatedAt": "2025-01-02T12:00:00.000Z"
		},
		{
			"id": 2,
			"username": "bob",
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
- Each contact object includes `id`, `username`, `identifier`, `createdAt`, and `updatedAt`.
- Sensitive fields (if any) are omitted.
- Returned data is scoped to the authenticated user’s accessible contacts.

---

### Create Contact

**Endpoint:** `POST /api/contacts`
**Description:** Creates a new contact for the authenticated user. Requires a valid `accessToken` cookie.

**Headers / Cookies:**

- Must include `accessToken` cookie issued by `/api/login`.

**Request Body:**

| Field      | Type   | Required | Description          |
| ---------- | ------ | -------- | -------------------- |
| username   | string | Yes      | Username of contact  |
| public_key | string | Yes      | Contact's public key |

**Response:**

- **200 OK**

```json
{
	"status": 200,
	"data": {
		"username": "alice",
		"identififier": "abc123hash",
		"createdAt": "2025-01-01T12:00:00.000Z",
		"updatedAt": "2025-01-02T12:00:00.000Z"
	}
}
```

- **400 Validation Error** (missing fields)

```json
{
	"status": 400,
	"message": "Validation failed.",
	"type": "validation",
	"errors": [
		{
			"field": "username",
			"message": "Username is required."
		},
		{
			"field": "public_key",
			"message": "Public key is required."
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
- The server automatically generates a hashed `identifier` from the public key.
- Only returns non-sensitive fields: `username`, `identifier`, `createdAt`, `updatedAt`.
