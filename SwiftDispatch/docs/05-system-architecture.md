# System Architecture Diagram
## SwiftDispatch

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT LAYER                               │
│                                                                     │
│  ┌──────────────────────────┐  ┌──────────────────────────────┐    │
│  │   Customer Mobile App    │  │    Rider Mobile App          │    │
│  │   React Native + Expo    │  │    React Native + Expo       │    │
│  │                          │  │                              │    │
│  │  • Expo Router (nav)     │  │  • Expo Router (nav)         │    │
│  │  • Zustand (state)       │  │  • Zustand (state)           │    │
│  │  • React Native Maps     │  │  • React Native Maps         │    │
│  │  • Socket.io-client      │  │  • Socket.io-client          │    │
│  │  • Expo Location         │  │  • Expo Location             │    │
│  └──────────┬───────────────┘  └──────────────┬───────────────┘    │
│             │                                 │                     │
└─────────────┼─────────────────────────────────┼─────────────────────┘
              │  HTTPS REST + WebSocket          │
              │                                 │
┌─────────────▼─────────────────────────────────▼─────────────────────┐
│                         BACKEND LAYER                                │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                 Node.js + Express Server                      │   │
│  │                      Port 4000                                │   │
│  │                                                               │   │
│  │  ┌──────────────────┐  ┌──────────────────┐                  │   │
│  │  │   REST API       │  │  Socket.io Server │                  │   │
│  │  │                  │  │                   │                  │   │
│  │  │  /api/auth       │  │  Events:          │                  │   │
│  │  │  /api/orders     │  │  • new_order      │                  │   │
│  │  │  /api/riders     │  │  • order_accepted │                  │   │
│  │  │                  │  │  • order_updated  │                  │   │
│  │  └────────┬─────────┘  │  • rider_location │                  │   │
│  │           │            │  • send_message   │                  │   │
│  │  ┌────────▼─────────┐  └──────────────────┘                  │   │
│  │  │   Middleware      │                                         │   │
│  │  │  • JWT Auth       │                                         │   │
│  │  │  • CORS           │                                         │   │
│  │  │  • Rate Limiter   │                                         │   │
│  │  └────────┬─────────┘                                         │   │
│  │           │                                                    │   │
│  │  ┌────────▼─────────┐                                         │   │
│  │  │  Mongoose ODM     │                                         │   │
│  │  │  • User model     │                                         │   │
│  │  │  • Order model    │                                         │   │
│  │  └────────┬─────────┘                                         │   │
│  └───────────┼──────────────────────────────────────────────────┘   │
│              │                                                        │
└──────────────┼────────────────────────────────────────────────────────┘
               │
┌──────────────▼────────────────────────────────────────────────────────┐
│                        DATA LAYER                                      │
│                                                                        │
│  ┌───────────────────────────────────────────────────────────────┐    │
│  │                   MongoDB Atlas (Cloud)                        │    │
│  │                                                                │    │
│  │  Collections:                                                  │    │
│  │  • users          • orders                                     │    │
│  │  • notifications  • messages (Phase 2)                        │    │
│  └───────────────────────────────────────────────────────────────┘    │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘
```

---

## Real-Time Communication Flow

```
Customer App                  Backend (Socket.io)              Rider App
     │                               │                              │
     │── POST /orders ──────────────►│                              │
     │                               │── emit('new_order') ────────►│
     │                               │   to all online riders       │
     │                               │                              │
     │                               │◄─ emit('accept_order') ─────│
     │                               │                              │
     │◄─ emit('order_accepted') ─────│                              │
     │                               │                              │
     │                               │◄─ emit('update_location') ──│
     │                               │   {lat, lng, orderId}        │
     │◄─ emit('rider_location') ─────│                              │
     │   {lat, lng}                  │                              │
     │                               │                              │
     │                               │◄─ emit('status_update') ────│
     │                               │   "in_transit" / "delivered" │
     │◄─ emit('order_updated') ──────│                              │
```

---

## Data Flow — Order Creation

```
Customer taps [Confirm & Book]
        │
        ▼
Zustand (useOrderStore)
.createOrder(payload)
        │
        ▼
services/api.ts
POST https://{host}:4000/api/orders
  Authorization: Bearer {jwt}
  Body: { pickup, dropoff, vehicleType, price, paymentMethod, ... }
        │
        ▼
Express Router /api/orders
        │
        ▼
JWT Middleware
  • Verifies token
  • Attaches req.user
        │
        ▼
Order Controller
  1. Validate request body
  2. Create Order document in MongoDB
  3. Emit 'new_order' via Socket.io to all online riders
  4. Return 201 { order }
        │
        ▼
Customer receives order object
  → Navigate to Tracking screen
  → Connect Socket.io room: order._id
  → Listen for: order_accepted, order_updated, rider_location
```

---

## Technology Stack Detail

### Mobile App (`/app`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| React Native | 0.81.5 | Cross-platform mobile framework |
| Expo SDK | 54 | Development toolchain + native APIs |
| Expo Router | v6 | File-based navigation |
| Zustand | v5 | Lightweight state management |
| React Native Maps | latest | Google Maps integration |
| Socket.io-client | v4 | Real-time WebSocket communication |
| Expo Location | latest | GPS location access |
| @expo/vector-icons | latest | Ionicons icon set |
| React Native Reanimated | v4 | Smooth animations (bottom sheet, etc.) |
| React Native Safe Area Context | latest | Safe area insets |

### Backend (`/backend`)

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 18+ | JavaScript runtime |
| Express | 4.x | HTTP server framework |
| Socket.io | 4.x | Real-time bidirectional communication |
| Mongoose | 8.x | MongoDB object modelling |
| JSON Web Token (jsonwebtoken) | 9.x | Authentication tokens |
| bcryptjs | 2.x | Password hashing |
| dotenv | 16.x | Environment variable loading |
| cors | 2.x | Cross-Origin Resource Sharing |
| nodemon | 3.x | Dev auto-restart |

### Infrastructure

| Service | Provider | Purpose |
|---------|---------|---------|
| Database | MongoDB Atlas (M0 Free) | Cloud-hosted MongoDB |
| Backend Hosting (Phase 2) | Railway / Render | Node.js server deployment |
| App Distribution | Expo Go | Development testing |
| App Store (Phase 2) | Google Play + App Store | Production distribution |
| Maps | Google Maps Platform | Address search + map tiles |
| Push Notifications (Phase 2) | Expo Notifications | FCM + APNs integration |

---

## Security Architecture

```
Client                    Transport               Server
   │                          │                      │
   │── HTTPS (TLS 1.3) ──────►│── Verified cert ────►│
   │                          │                      │
   │── Bearer JWT ────────────────────────────────────►│
   │   Header: Authorization  │                       │── Verify signature
   │                          │                       │── Check expiry
   │                          │                       │── Extract userId
   │                          │                       │
   │                          │                       │── bcrypt verify password
   │                          │                       │   (on login only)
```

**JWT Payload:**
```json
{
  "userId": "64a1f2b3c4d5e6f7a8b9c0d1",
  "role": "customer",
  "iat": 1717584000,
  "exp": 1720176000
}
```

---

## Deployment Architecture (Phase 2 — Production)

```
                    ┌──────────────────┐
                    │   Cloudflare CDN  │
                    │   (DNS + DDoS)    │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │    Railway.app    │
                    │  Node.js Server   │
                    │  Port 4000        │
                    │  Auto-deploy from │
                    │  GitHub main      │
                    └────────┬─────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
   ┌──────────▼───────────┐    ┌────────────▼────────────┐
   │   MongoDB Atlas       │    │   Expo Application      │
   │   M10 Production      │    │   Services (EAS)        │
   │   Cluster             │    │   OTA updates           │
   └──────────────────────┘    └─────────────────────────┘
```
