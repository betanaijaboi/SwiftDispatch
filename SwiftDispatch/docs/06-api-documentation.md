# API Documentation
## SwiftDispatch Backend

**Base URL (Development):** `http://<your-local-ip>:4000/api`  
**Base URL (Production):** `https://api.swiftdispatch.app/api`  
**Auth:** Bearer JWT token in `Authorization` header  
**Content-Type:** `application/json`

---

## Authentication

### POST `/auth/register`
Register a new user (customer or rider).

**Request Body:**
```json
{
  "name": "Adaeze Nwosu",
  "email": "adaeze@example.com",
  "phone": "+2348012345678",
  "password": "securepassword123",
  "role": "customer",
  "vehicleType": "bike",
  "vehiclePlate": "LSD-421-AR"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `name` | string | ✅ | Full name |
| `email` | string | ✅ | Must be valid email, unique |
| `phone` | string | ✅ | Phone number |
| `password` | string | ✅ | Minimum 6 characters |
| `role` | string | ✅ | `"customer"` or `"rider"` |
| `vehicleType` | string | If rider | `"bike"`, `"bicycle"`, `"car"`, `"van"` |
| `vehiclePlate` | string | If rider | Vehicle registration plate |

**Success Response — 201 Created:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "name": "Adaeze Nwosu",
    "email": "adaeze@example.com",
    "phone": "+2348012345678",
    "role": "customer",
    "isVerified": false,
    "rating": 5.0,
    "createdAt": "2026-06-05T14:30:00.000Z"
  }
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | VALIDATION_ERROR | "Email is required" / "Password must be at least 6 characters" |
| 409 | EMAIL_EXISTS | "An account with this email already exists" |
| 500 | SERVER_ERROR | "Internal server error" |

---

### POST `/auth/login`
Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "email": "adaeze@example.com",
  "password": "securepassword123"
}
```

**Success Response — 200 OK:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64a1f2b3c4d5e6f7a8b9c0d1",
    "name": "Adaeze Nwosu",
    "email": "adaeze@example.com",
    "role": "customer",
    "rating": 5.0,
    "totalRides": 12,
    "isVerified": true
  }
}
```

**Error Responses:**
| Status | Code | Message |
|--------|------|---------|
| 400 | MISSING_FIELDS | "Email and password are required" |
| 401 | INVALID_CREDENTIALS | "Invalid email or password" |

---

### GET `/auth/me`
Get the currently authenticated user's profile.

**Headers:** `Authorization: Bearer {token}`

**Success Response — 200 OK:**
```json
{
  "id": "64a1f2b3c4d5e6f7a8b9c0d1",
  "name": "Adaeze Nwosu",
  "email": "adaeze@example.com",
  "phone": "+2348012345678",
  "role": "customer",
  "isVerified": true,
  "rating": 4.9,
  "totalRides": 12,
  "createdAt": "2026-01-15T08:30:00.000Z"
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 401 | "No token provided" / "Token is invalid or expired" |

---

## Orders

### POST `/orders`
Create a new delivery order. Triggers a Socket.io broadcast to nearby riders.

**Headers:** `Authorization: Bearer {token}` (customer only)

**Request Body:**
```json
{
  "pickup": {
    "address": "14 Palm Close, Lekki Phase 1, Lagos",
    "latitude": 6.4354,
    "longitude": 3.4737
  },
  "dropoff": {
    "address": "Shoprite, Victoria Island, Lagos",
    "latitude": 6.4281,
    "longitude": 3.4219
  },
  "vehicleType": "bike",
  "price": 1850,
  "distance": 5.2,
  "estimatedTime": 18,
  "packageDescription": "iPhone 15 Pro — fragile",
  "note": "Please call on arrival",
  "paymentMethod": "cash"
}
```

**Success Response — 201 Created:**
```json
{
  "order": {
    "id": "64b2a3c4d5e6f7a8b9c0d3e4",
    "customerId": "64a1f2b3c4d5e6f7a8b9c0d1",
    "riderId": null,
    "pickup": { "address": "14 Palm Close, Lekki Phase 1, Lagos", "latitude": 6.4354, "longitude": 3.4737 },
    "dropoff": { "address": "Shoprite, Victoria Island, Lagos", "latitude": 6.4281, "longitude": 3.4219 },
    "vehicleType": "bike",
    "status": "searching",
    "price": 1850,
    "distance": 5.2,
    "estimatedTime": 18,
    "paymentMethod": "cash",
    "createdAt": "2026-06-05T14:30:00.000Z"
  }
}
```

---

### GET `/orders/my`
Get all orders for the authenticated user (customer gets their orders; rider gets assigned orders).

**Headers:** `Authorization: Bearer {token}`

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `status` | string | all | Filter by status |
| `limit` | number | 20 | Results per page |
| `page` | number | 1 | Page number |

**Success Response — 200 OK:**
```json
{
  "orders": [
    {
      "id": "64b2a3c4d5e6f7a8b9c0d3e4",
      "status": "delivered",
      "price": 1850,
      "vehicleType": "bike",
      "pickup": { "address": "14 Palm Close, Lekki" },
      "dropoff": { "address": "Shoprite, VI" },
      "createdAt": "2026-06-05T14:30:00.000Z",
      "rating": 5
    }
  ],
  "total": 12,
  "page": 1
}
```

---

### GET `/orders/:id`
Get a single order by ID.

**Headers:** `Authorization: Bearer {token}`

**Success Response — 200 OK:** Full order object (see POST /orders response).

**Error Responses:**
| Status | Message |
|--------|---------|
| 404 | "Order not found" |
| 403 | "Access denied" (requesting user is not the customer or rider for this order) |

---

### PATCH `/orders/:id/cancel`
Cancel an order. Only allowed before a rider has been assigned.

**Headers:** `Authorization: Bearer {token}` (customer only)

**Request Body:** _(empty)_

**Success Response — 200 OK:**
```json
{ "message": "Order cancelled successfully", "order": { "id": "...", "status": "cancelled" } }
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 400 | "Cannot cancel an order that is already in progress" |
| 403 | "Only the customer can cancel this order" |

---

### PATCH `/orders/:id/rate`
Submit a rating for a completed delivery.

**Headers:** `Authorization: Bearer {token}` (customer only)

**Request Body:**
```json
{
  "rating": 5,
  "review": "Very fast and careful. Highly recommended!"
}
```

**Success Response — 200 OK:**
```json
{ "message": "Rating submitted", "order": { "id": "...", "status": "rated", "rating": 5 } }
```

---

## Riders

### PATCH `/riders/status`
Toggle the rider's online/offline availability.

**Headers:** `Authorization: Bearer {token}` (rider only)

**Request Body:**
```json
{ "isOnline": true }
```

**Success Response — 200 OK:**
```json
{ "message": "Status updated", "isOnline": true }
```

---

### PATCH `/riders/location`
Update the rider's current GPS location (called frequently while on a delivery).

**Headers:** `Authorization: Bearer {token}` (rider only)

**Request Body:**
```json
{
  "latitude": 6.5102,
  "longitude": 3.3672,
  "orderId": "64b2a3c4d5e6f7a8b9c0d3e4"
}
```

**Success Response — 200 OK:**
```json
{ "message": "Location updated" }
```

---

### PATCH `/riders/orders/:id/accept`
Accept an incoming order.

**Headers:** `Authorization: Bearer {token}` (rider only)

**Success Response — 200 OK:**
```json
{
  "message": "Order accepted",
  "order": { "id": "...", "status": "accepted", "riderId": "..." }
}
```

**Error Responses:**
| Status | Message |
|--------|---------|
| 400 | "Order is no longer available" (another rider accepted first) |
| 403 | "Only riders can accept orders" |

---

### PATCH `/riders/orders/:id/status`
Advance the delivery status (pickup → in_transit → delivered).

**Headers:** `Authorization: Bearer {token}` (rider only)

**Request Body:**
```json
{ "status": "pickup" }
```
Valid values: `"pickup"`, `"in_transit"`, `"delivered"`

**Success Response — 200 OK:**
```json
{ "message": "Status updated", "order": { "id": "...", "status": "pickup" } }
```

---

### GET `/riders/earnings`
Get the authenticated rider's earnings summary.

**Headers:** `Authorization: Bearer {token}` (rider only)

**Query Parameters:**
| Param | Options | Default |
|-------|---------|---------|
| `period` | `today`, `week`, `month`, `all` | `week` |

**Success Response — 200 OK:**
```json
{
  "period": "week",
  "totalEarnings": 34900,
  "totalTrips": 51,
  "averagePerTrip": 685,
  "transactions": [
    { "orderId": "ORD-2041", "amount": 1850, "type": "earning", "createdAt": "..." },
    { "orderId": "Withdrawal", "amount": 5000, "type": "withdrawal", "createdAt": "..." }
  ]
}
```

---

## Socket.io Events

**Connection:** `http://{host}:4000`  
**Auth:** Pass JWT in `auth` object on connect:
```js
const socket = io('http://host:4000', {
  auth: { token: 'Bearer eyJ...' }
});
```

### Client → Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `accept_order` | `{ orderId }` | Rider accepts an order |
| `update_location` | `{ orderId, latitude, longitude }` | Rider sends GPS update |
| `update_status` | `{ orderId, status }` | Rider advances delivery status |
| `send_message` | `{ orderId, message }` | Send in-trip chat message |
| `join_order` | `{ orderId }` | Join a specific order's room |

### Server → Client Events

| Event | Payload | Sent To |
|-------|---------|---------|
| `new_order` | Full order object | All online riders |
| `order_accepted` | `{ order, rider }` | Customer of that order |
| `order_updated` | `{ orderId, status }` | Customer + Rider |
| `rider_location` | `{ latitude, longitude }` | Customer of active order |
| `new_message` | `{ senderId, senderRole, message, createdAt }` | Other party in trip |
