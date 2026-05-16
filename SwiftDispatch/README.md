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
SwiftDispatch/
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

---

## Setting Up on a New Computer

Follow every step in order. This covers a completely fresh install from GitHub.

### Prerequisites

Install these before anything else:

| Tool | Version | Download |
|------|---------|----------|
| Node.js | 18 or later | https://nodejs.org |
| Git | any | https://git-scm.com |
| Expo Go (phone) | latest | App Store / Play Store |

> **MongoDB**: You do **not** need to install MongoDB locally if you use MongoDB Atlas (cloud). See the database section below.

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/SwiftDispatch.git
cd SwiftDispatch
```

---

### Step 2 — Set up the backend

#### 2a. Install dependencies

```bash
cd backend
npm install
```

#### 2b. Create the `.env` file

Copy the example file and fill it in:

```bash
# Mac / Linux
cp .env.example .env

# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Open `.env` in any text editor and configure each value:

```env
PORT=4000
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=pick_any_long_random_string_here
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:8081
```

#### 2c. Configure your database

**Option A — MongoDB Atlas (recommended, no local install needed)**

1. Go to https://cloud.mongodb.com and create a free account.
2. Create a free **M0** cluster (any region).
3. In **Database Access**, create a user with a username and password.
   - Avoid special characters like `@`, `#`, `$` in your password, or URL-encode them if you must (e.g. `!` is fine, `@` becomes `%40`).
4. In **Network Access**, click **Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect → Drivers** and copy the connection string. It looks like:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

6. Paste it as `MONGODB_URI` in your `.env`. Make sure there are no `<angle brackets>` left over and no duplicate `?` characters.

**Option B — Local MongoDB**

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community.
2. Start the service (`mongod` or via MongoDB Compass).
3. Set `MONGODB_URI=mongodb://localhost:27017/swiftdispatch`.

#### 2d. Start the backend

```bash
npm run dev
```

You should see:

```
[nodemon] starting...
Server running on port 4000
MongoDB connected
```

Leave this terminal open. The backend must stay running while you use the app.

---

### Step 3 — Set up the mobile app

Open a **new terminal window** (keep the backend terminal running).

#### 3a. Install dependencies

```bash
cd ../app        # from the backend folder
npm install
```

#### 3b. Start the Expo dev server

```bash
npx expo start
```

A QR code will appear in the terminal.

#### 3c. Open the app on your phone

1. Make sure your **phone and computer are on the same Wi-Fi network**.
2. Open the **Expo Go** app on your phone.
3. Tap **Scan QR Code** and scan the code from the terminal.

The app will load in a few seconds. The backend URL is detected automatically — the app reads the IP address from Expo's dev server and connects to port 4000 on the same machine.

> **Tip:** If you want to use an Android Emulator instead of a physical phone, press `a` in the Expo terminal. For iOS Simulator (Mac only), press `i`.

---

### Step 4 — Firewall (Windows only — required for physical phones)

If you're on **Windows** and connecting from a real phone, you must allow port 4000 through the Windows Firewall, otherwise the phone cannot reach the backend.

**Automatic (run once in PowerShell as Administrator):**

```powershell
New-NetFirewallRule -DisplayName "SwiftDispatch Backend" -Direction Inbound -Protocol TCP -LocalPort 4000 -Action Allow
```

**Manual (via GUI):**

1. Open **Windows Defender Firewall** → **Advanced Settings**.
2. Click **Inbound Rules** → **New Rule**.
3. Choose **Port** → **TCP** → enter `4000`.
4. Choose **Allow the connection** → apply to all profiles.
5. Name it `SwiftDispatch Backend` and finish.

You only need to do this once per computer.

---

## Daily Development Commands

Once everything is installed, you only need two commands each session:

**Terminal 1 — Backend:**
```bash
cd SwiftDispatch/backend
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd SwiftDispatch/app
npx expo start
```

### Useful Expo keyboard shortcuts (in the frontend terminal)

| Key | Action |
|-----|--------|
| `a` | Open on Android Emulator |
| `i` | Open on iOS Simulator (Mac only) |
| `r` | Reload the app |
| `m` | Toggle menu |
| `j` | Open React DevTools |

---

## Demo Mode (No Backend Needed)

If you just want to explore the UI without a running backend:

1. Start only the frontend (`npx expo start`).
2. On the **Login screen**, tap **Customer Demo** or **Rider Demo**.
3. You get full UI access with mock data — no server or database required.

---

## API Reference

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register a new user (customer or rider) |
| `POST` | `/api/auth/login` | Log in, returns JWT token |
| `GET` | `/api/auth/me` | Get the current logged-in user |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Create a new order |
| `GET` | `/api/orders/my` | Get all orders for current user |
| `GET` | `/api/orders/:id` | Get a single order by ID |
| `PATCH` | `/api/orders/:id/cancel` | Cancel an order |
| `PATCH` | `/api/orders/:id/rate` | Rate a completed order |

### Riders

| Method | Endpoint | Description |
|--------|----------|-------------|
| `PATCH` | `/api/riders/status` | Toggle online / offline |
| `PATCH` | `/api/riders/location` | Update current GPS location |
| `PATCH` | `/api/riders/orders/:id/accept` | Accept an incoming order |
| `PATCH` | `/api/riders/orders/:id/status` | Advance delivery status |
| `GET` | `/api/riders/earnings` | Get earnings summary |

### Socket.io Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `new_order` | Server → Riders | Broadcast new order to available riders |
| `order_accepted` | Server → Customer | Notify customer that a rider accepted |
| `order_updated` | Server → Both | Push order status changes |
| `rider_location` | Server → Customer | Stream rider GPS coordinates |
| `update_location` | Rider → Server | Rider sends location update |
| `send_message` | Client → Both | In-trip chat message |

---

## Pricing

| Vehicle | Base Price | Per km | Capacity |
|---------|-----------|--------|----------|
| SwiftBike | ₦300 | ₦80/km | Up to 10 kg |
| EcoCycle | ₦150 | ₦50/km | Up to 5 kg |
| SwiftCar | ₦500 | ₦120/km | Up to 30 kg |
| SwiftVan | ₦1,000 | ₦180/km | Up to 200 kg |

Prices are rounded to the nearest ₦10.

---

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | Yes | Port the backend listens on (default: `4000`) |
| `MONGODB_URI` | Yes | MongoDB connection string (local or Atlas) |
| `JWT_SECRET` | Yes | Secret key used to sign tokens — make it long and random |
| `JWT_EXPIRES_IN` | Yes | How long tokens stay valid (e.g. `30d`, `7d`) |
| `CLIENT_URL` | No | Allowed CORS origin (default: `http://localhost:8081`) |

---

## Troubleshooting

### "Cannot reach server" when registering/logging in on a physical phone

- Make sure your phone and PC are on the **same Wi-Fi network** (not mobile data).
- Check that the backend is running (`npm run dev` shows no errors).
- On Windows, confirm the firewall rule for port 4000 is in place (see Step 4).
- Try opening `http://<your-pc-ip>:4000/api/auth/me` in your phone's browser — you should get a JSON response, not a timeout.

### "Network Error" immediately on app open

The app auto-detects the backend IP from Expo's dev server. If you stopped and restarted Expo and the IP changed (e.g. you switched networks), just close and reopen the app to reconnect.

### MongoDB connection fails

- **Atlas**: confirm the IP `0.0.0.0/0` is in Network Access, the username/password are correct, and there are no `<>` brackets or double `?` in the URI.
- **Local**: confirm `mongod` is running and listening on port 27017.

### "Something went wrong" on Android emulator

Android emulators use `10.0.2.2` to reach the host machine's `localhost`. This is handled automatically — no changes needed.

### Metro bundler port 8081 already in use

Find and stop the process holding port 8081:

```bash
# Mac / Linux
lsof -ti:8081 | xargs kill

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 8081).OwningProcess -Force
```

Then re-run `npx expo start`.

### nodemon "port 4000 already in use"

```bash
# Mac / Linux
lsof -ti:4000 | xargs kill

# Windows (PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 4000).OwningProcess -Force
```

Then re-run `npm run dev`. Alternatively, if nodemon is running but stalled, type `rs` and press Enter in its terminal to restart.

---

## Production Checklist

Before deploying publicly:

- [ ] Replace `JWT_SECRET` with a long, random, secret value (never commit it to Git)
- [ ] Use MongoDB Atlas (not local) for a hosted database
- [ ] Add a real Google Maps API key in `app/app.json` under `android.config.googleMaps`
- [ ] Enable Stripe or Paystack for real card payments
- [ ] Set up Expo Notifications for push alerts
- [ ] Add OTP verification for phone numbers on register
- [ ] Configure rate limiting on API routes (`express-rate-limit`)
- [ ] Run the backend behind HTTPS (e.g. via Nginx + Let's Encrypt, or Railway/Render)
- [ ] Remove or restrict the `0.0.0.0/0` Atlas IP allowlist to your server's IP

---

Built with React Native + Expo + Node.js + Socket.io + MongoDB
