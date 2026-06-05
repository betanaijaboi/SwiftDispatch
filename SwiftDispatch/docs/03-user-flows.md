# User Flow Diagrams
## SwiftDispatch

---

## Flow 1 — New User Onboarding

```
App Launch
    │
    ▼
Splash Screen
(logo + tagline + animated entry)
    │
    ├──[Has saved session]──────────────────────────────────────────────────┐
    │                                                                       │
    ▼                                                                       ▼
Choose Role Screen                                               Auto-redirect to
"I am a..." [Customer] [Rider]                                  Customer Home
    │                                                            OR Rider Dashboard
    ▼
Register Screen — Step 1: Personal Info
  • Full name
  • Email address
  • Phone number
  • Role (Customer / Rider) — pre-selected
    │
    ▼
Register Screen — Step 2: Set Password
  • Password
  • Confirm password
    │
    ▼
Register Screen — Step 3: Role-Specific Details
  ┌─────────────────────────┬──────────────────────────────┐
  │ IF Customer             │ IF Rider                     │
  │ "You're all set!" card  │ Vehicle type selection       │
  │                         │ Plate number entry           │
  └─────────────────────────┴──────────────────────────────┘
    │
    ▼
[Create Account] → API POST /register
    │
    ├──[Success]──────────────────────────────────────────┐
    │                                                     │
    ▼                                                     ▼
Error Alert                                    Customer Home Screen
("Check details / server error")               OR Rider Dashboard
```

---

## Flow 2 — Customer: Book a Delivery

```
Customer Home Screen
(map + bottom sheet: Quick Send, Services, Promos)
    │
    ├──[Tap "Where are you sending to?" search bar]
    ├──[Tap any Quick Send card]
    └──[Tap any Service card]
    │
    ▼
Booking Screen — Step 1: Locations
  • Drop-off address search
  • Address suggestions list
  • Pickup address (auto-filled or editable)
  • [Confirm Locations] button
    │
    ▼
Booking Screen — Step 2: Vehicle Selection
  • List of vehicle types
    - SwiftBike (₦300 base + ₦80/km, ~5 min ETA)
    - EcoCycle  (₦150 base + ₦50/km, ~12 min ETA)
    - SwiftCar  (₦500 base + ₦120/km, ~8 min ETA)
    - SwiftVan  (₦1,000 base + ₦180/km, ~10 min ETA)
  • Distance shown
  • [Continue] button
    │
    ▼
Booking Screen — Step 3: Package Details
  • Package description (optional text)
  • Package notes for rider (optional)
  • [Continue] button
    │
    ▼
Booking Screen — Step 4: Payment & Confirm
  • Payment method selection
    - Cash on Delivery
    - Card (Phase 2)
    - Swift Wallet (Phase 2)
  • Order summary (addresses, vehicle, price)
  • [Confirm & Book] button
    │
    ▼
API POST /orders
    │
    ├──[Error]──────────────────────────────────────────────────┐
    │                                                           │
    ▼                                                           ▼
Tracking Screen                                       Error Alert (stay on booking)
Status: "Searching for a rider..."
    │
    ├──[Rider found & accepted]
    │
    ▼
Tracking Screen
  • Rider name, rating, vehicle
  • Rider location on map (live)
  • Status: Accepted → At Pickup → In Transit → Delivered
    │
    ├──[Status: Delivered]
    │
    ▼
Rate Order Screen
  • Star rating (1–5)
  • Quick tags (Fast, Careful, Professional…)
  • Optional text review
  • [Submit Rating]
    │
    ▼
Customer Home Screen
```

---

## Flow 3 — Rider: Receiving and Completing a Delivery

```
Rider Dashboard (map)
  • Online/Offline toggle
  • Bottom panel: Earnings, Trips, Rating, Status
    │
    ├──[Toggle to OFFLINE]──────────────────────────────────────────────────┐
    │                                                                       │
    ├──[Toggle to ONLINE]                                         No orders received
    │
    ▼
Waiting State
(status: "You are online and receiving orders")
    │
    ├──[Order received — modal slides up]
    │
    ▼
Incoming Order Modal (30-second countdown)
  • Customer name & rating
  • Pickup address + distance to pickup
  • Drop-off address + trip distance
  • Package description
  • Price (₦X,XXX)
  • [✕ Decline] [✓ Accept]
    │
    ├──[Decline]────────────────────────────────────────────────────────────┐
    │                                                                       │
    ├──[Accept] / [Timer expires → auto-decline]                 Back to waiting state
    │
    ▼
Active Order Screen
  • Map with route to pickup
  • Step buttons:
    1. [Arrived at Pickup]
    2. [Package Collected]
    3. [Delivered]
    │
    ▼
[Delivered] tapped → API PATCH /orders/:id/status
    │
    ▼
Delivery Complete
  • Earnings credited (₦X,XXX)
  • Back to Rider Dashboard
  • Trip count +1, Earnings updated
```

---

## Flow 4 — Login (Returning User)

```
Splash Screen
    │
    ├──[No saved session]
    │
    ▼
Login Screen
  • Email input
  • Password input (show/hide toggle)
  • [Sign In] button
  • [Forgot Password?] link
  • [Customer Demo] / [Rider Demo] buttons
  • [Don't have an account? Sign up] link
    │
    ▼
API POST /auth/login
    │
    ├──[Invalid credentials]────────────────────────────────────┐
    │                                                           │
    ├──[Success]                                       Error alert + stay on login
    │
    ▼
[role === 'rider'] → Rider Dashboard
[role === 'customer'] → Customer Home
```

---

## Flow 5 — Notifications

```
Any Screen
    │
    ├──[Tap notification bell icon (top-right)]
    │
    ▼
Notifications Screen
  • List of notifications (newest first)
  • Unread count badge
  • [Mark all read] button
  • Notification types:
    - Order: "Rider on the way" (cube icon, purple)
    - Promo: "50% off your next ride!" (pricetag icon, amber)
    - System: "Welcome to SwiftDispatch" (flash icon, orange)
    │
    ├──[Tap a notification]
    │
    ▼
Mark as read → navigate to relevant screen
(e.g., order notification → tracking screen)
```

---

## Flow 6 — Rider Earnings

```
Rider Bottom Tab → [Earnings]
    │
    ▼
Earnings Screen
  • Summary card: Total earnings, period, trip count
  • [Withdraw] button (Phase 2: links to bank account)
  • Period tabs: [Today] [This Week] [This Month]
  • Bar chart: Daily earnings breakdown
  • Stats: Avg per trip, Online hours, Acceptance rate
  • Recent transactions list
    - Earning entries (green +₦)
    - Withdrawal entries (red -₦)
```

---

## Flow 7 — Profile & Settings (Customer)

```
Customer Bottom Tab → [Profile]
    │
    ▼
Profile Screen
  • Avatar + name + email
  • Verified badge
  • Stats: Deliveries, Rating, Member since
  • Referral code + Share button
  • Menu sections:
    Account:   Edit Profile | Phone | Password | Saved Addresses
    Payments:  Payment Methods | Swift Wallet | Transaction History
    Support:   Help | Terms | Rate the App
  • [Log out] button
    │
    ├──[Log out confirmed]
    │
    ▼
Splash Screen
```

---

## Flow 8 — Order History (Customer)

```
Customer Bottom Tab → [Orders]
    │
    ▼
Orders Screen
  • [Active] tab — orders in: pending / searching / accepted / pickup / in_transit
  • [History] tab — orders in: delivered / cancelled / rated
    │
    ├──[Tap active order]
    │    └──→ Tracking Screen
    │
    ├──[History tab, tap order]
    │    └──→ Order detail (read-only view)
    │
    └──[Active tab, no orders]
         └──→ Empty state: "Book a Rider" button → Home Screen
```
