# SwiftDispatch — Dispatch Rider Hiring App

A full-stack mobile app for hiring dispatch riders, built like Bolt/Uber. Features real-time tracking, multi-vehicle types, and separate customer and rider experiences.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Mobile App | React Native 0.81 + Expo SDK 54   |
| Navigation | Expo Router v6 (file-based)       |
| State      | Zustand v5                        |
| Real-time  | Socket.io                         |
| Backend    | Node.js + Express                 |
| Database   | MongoDB (Mongoose)                |
| Auth       | JWT                               |

---

## Project Structure

```
SwiftDispatch/                  # project root inside this repo
├── app/                        # React Native / Expo frontend
│   ├── app/
│   │   ├── (auth)/             # Splash, Login, Register
│   │   ├── (customer)/         # Home, Booking, Tracking, Orders, Profile, Notifications
│   │   └── (rider)/            # Home, Active Order, Earnings, History, Profile
│   ├── components/             # Shared UI components (Button, Input, Card, etc.)
│   ├── constants/              # Theme, colors, typography
│   ├── services/               # API client, Socket, Pricing helpers
│   ├── store/                  # Zustand stores (auth, orders)
│   └── types/                  # TypeScript interfaces
└── backend/
    └── src/
        ├── models/             # User, Order (Mongoose schemas)
        ├── routes/             # Auth, Orders, Riders REST endpoints
        ├── middleware/         # JWT authentication
        └── socket/             # Socket.io real-time event handlers
```

---

## Features

### Customer
- Register / Login (3-step flow) with demo mode
- Map home screen with live location
- 4-step booking: addresses → vehicle → package details → payment
- Vehicle selection: SwiftBike, EcoCycle, SwiftCar, SwiftVan (live pricing)
- Real-time delivery tracking on map
- Post-delivery star rating
- Order history (active + past)
- In-app notifications
- Profile with stats, wallet balance, referral code

### Rider
- Online/offline toggle
- Incoming order modal with 30-second countdown (accept or decline)
- Step-by-step delivery flow (pickup → in transit → delivered)
- Earnings dashboard with bar chart and transaction history
- Trip history
- Performance stats and tier badge

### Backend
- JWT register / login
- Full order lifecycle (create → accept → pickup → deliver → rate)
- Real-time Socket.io events for order updates and rider location
- MongoDB persistence via Mongoose

## Getting started

```bash
git clone https://github.com/betanaijaboi/SwiftDispatch.git
cd SwiftDispatch/SwiftDispatch

# backend
cd backend && npm install && cp .env.example .env   # set MONGODB_URI and JWT_SECRET
npm run dev

# mobile app (new terminal)
cd ../app && npm install && npx expo start
```

The app also has a **demo mode** that runs without the backend. For full
setup (MongoDB, running on a physical phone, Windows firewall), the API
reference, Socket.io events, pricing and troubleshooting, see
**[SwiftDispatch/README.md](SwiftDispatch/README.md)**.

## Documentation

- [Product requirements](SwiftDispatch/docs/01-PRD.md)
- [User stories](SwiftDispatch/docs/02-user-stories.md)
- [User flows](SwiftDispatch/docs/03-user-flows.md)
- [Database ERD](SwiftDispatch/docs/04-database-erd.md)
- [System architecture](SwiftDispatch/docs/05-system-architecture.md)
- [API documentation](SwiftDispatch/docs/06-api-documentation.md)
- [Design system](SwiftDispatch/docs/07-design-system.md)
- [Functional requirements](SwiftDispatch/docs/08-functional-requirements.md)
- [Non-functional requirements](SwiftDispatch/docs/09-non-functional-requirements.md)
- [Security requirements](SwiftDispatch/docs/10-security-requirements.md)
- [Acceptance criteria](SwiftDispatch/docs/11-acceptance-criteria.md)
- [Project roadmap](SwiftDispatch/docs/12-project-roadmap.md)
- [Test plan](SwiftDispatch/docs/13-test-plan.md)
- [Deployment & maintenance](SwiftDispatch/docs/14-deployment-maintenance.md)

## Legal

[Terms](TERMS.md) · [Privacy](PRIVACY.md)
