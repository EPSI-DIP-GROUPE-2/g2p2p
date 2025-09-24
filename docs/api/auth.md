## Authentication

### Login

**Endpoint:** `POST /api/login`
**Description:** Authenticates a user and issues a JWT in a cookie.

**Request Body:**

| Field    | Type   | Required | Description          |
| -------- | ------ | -------- | -------------------- |
| username | string | Yes      | Username of the user |
| password | string | Yes      | User password        |

**Response:**

- **200 OK**

```json
{
	"status": 200
}
```

- **400 Validation Error** (Invalid password)

```json
{
	"status": 400,
	"message": "Invalid password.",
	"type": "validation",
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

- On successful login, a cookie named `accessToken` is set.
- The cookie is `httpOnly`, `secure` (based on config), and `sameSite: strict`.

---

### Get Current User

**Endpoint:** `GET /api/me`
**Description:** Returns information about the currently authenticated user. Requires a valid `accessToken` cookie.

**Headers / Cookies:**

- Must include `accessToken` cookie issued by `/api/login`.

**Response:**

- **200 OK**

```json
{
	"status": 200,
	"data": {
		"id": 1,
		"username": "admin",
		"createdAt": "2025-01-01T12:00:00.000Z",
		"updatedAt": "2025-01-02T12:00:00.000Z"
	}
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
- Only returns `id`, `username`, `createdAt`, and `updatedAt` fields; sensitive fields like `password` are omitted.
