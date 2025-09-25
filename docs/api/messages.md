# Message Model

## Model Overview

The `MessageModel` represents individual messages exchanged between contacts.

| Field       | Type            | Notes                                                       |
| ----------- | --------------- | ----------------------------------------------------------- |
| `id`        | `number`        | Auto-incremented primary key                                |
| `from`      | `string`        | Sender identifier (`ContactModel.identifier`)               |
| `to`        | `string`        | Receiver identifier (`ContactModel.identifier`)             |
| `content`   | `string` (TEXT) | Message body (UTF-8 text)                                   |
| `status`    | `MessageStatus` | Enum: `STORED`, `DELIVERED`, `READ`, etc. Default: `STORED` |
| `timestamp` | `Date`          | UTC date/time of creation. Default: `NOW`                   |

### Input Contract

When creating a message, the backend will automatically fill:

- `from`: The sender’s **public key** identifier (derived from the server’s crypto keys).
- `timestamp` and `status`.

Frontend only needs to provide:

```ts
{
  to: string,        // recipient identifier
  content: string    // message text
}
```

---

## API Endpoints

### 1. Create a Message

**POST** `/api/messages`

**Request body**:

```json
{
	"to": "recipient_identifier",
	"content": "Hello world!"
}
```

**Response (200)**:

```json
{
	"status": 200,
	"data": {
		"id": 42,
		"to": "recipient_identifier",
		"status": "STORED",
		"content": "Hello world!",
		"timestamp": "2025-01-01T12:00:00.000Z"
	}
}
```

Errors return the standard error JSON with `status`, `title`, and `message`.

---

### 2. List Messages

**GET** `/api/messages` (requires auth)

**Response (200)**:

```json
{
	"status": 200,
	"data": [
		{
			"id": 42,
			"to": "recipient_identifier",
			"status": "STORED",
			"content": "Hello world!",
			"timestamp": "2025-01-01T12:00:00.000Z"
		},
		{
			"id": 41,
			"to": "recipient_identifier",
			"status": "DELIVERED",
			"content": "Earlier message",
			"timestamp": "2024-12-31T23:59:59.000Z"
		}
	]
}
```

Messages are **sorted in descending order by `timestamp`** (most recent first).

---

## Realtime Updates

Whenever a message is created, the backend emits a socket event:

**Event:** `messages:append`
**Payload:**

```json
{
	"to": "recipient_identifier",
	"from": "sender_identifier",
	"content": "Hello world!",
	"timestamp": "2025-01-01T12:00:00.000Z",
	"status": "STORED"
}
```

The frontend should subscribe to this event to update conversations in realtime.

---

⚠️ **Note for frontend**

- Always display messages using `status` to track delivery/read state.
- `from` is implicit in creation (filled by backend), but available in realtime events and DB fetches.
