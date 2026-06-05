# Test Plan
## SwiftDispatch

---

## 1. Overview

This test plan covers all testing activities for SwiftDispatch across the mobile app (React Native/Expo) and the backend API (Node.js/Express). Testing is divided into four levels: unit, integration, end-to-end (manual UAT), and performance.

---

## 2. Test Levels

### 2.1 Unit Tests
**Scope:** Individual functions and utilities  
**Tool:** Jest  
**Location:** `__tests__/` directories alongside source files  

#### Backend Unit Tests

| Test | Function | Expected |
|------|----------|----------|
| Price calculation | `calculatePrice('bike', 5)` | Returns `700` (₦300 + 5×₦80, rounded) |
| Price calculation | `calculatePrice('van', 10)` | Returns `2800` (₦1000 + 10×₦180, rounded) |
| Price rounding | `calculatePrice('bike', 3.7)` | Returns `600` (rounds to nearest ₦10) |
| Distance calculation | `calculateDistance(6.52, 3.37, 6.54, 3.39)` | Returns approximately 3.1 km |
| Format price | `formatPrice(1850)` | Returns `"₦1,850"` |
| Format distance | `formatDistance(0.5)` | Returns `"500m"` |
| Format distance | `formatDistance(5.2)` | Returns `"5.2km"` |
| Password hashing | `bcrypt.hash('password', 10)` | Returns hashed string, not plaintext |
| JWT generation | `jwt.sign({userId, role}, secret)` | Returns valid token |
| JWT verification | `jwt.verify(token, secret)` | Returns decoded payload |

#### Frontend Unit Tests

| Test | Function | Expected |
|------|----------|----------|
| Price display | `formatPrice(0)` | Returns `"₦0"` |
| Duration format | `formatDuration(90)` | Returns `"1h 30min"` |
| Duration format | `formatDuration(25)` | Returns `"25 min"` |
| Status badge color | `getStatusColor('delivered')` | Returns success green |
| Status badge color | `getStatusColor('cancelled')` | Returns error red |

---

### 2.2 Integration Tests
**Scope:** API endpoint request/response cycles  
**Tool:** Jest + Supertest  
**Location:** `backend/__tests__/`  

#### Auth Routes

| Test Case | Method + Path | Input | Expected Response |
|-----------|--------------|-------|-------------------|
| Register customer | `POST /api/auth/register` | Valid customer payload | 201 + `{ token, user }` |
| Register rider | `POST /api/auth/register` | Valid rider payload with vehicleType | 201 + `{ token, user }` |
| Register — duplicate email | `POST /api/auth/register` | Existing email | 409 + error message |
| Register — missing fields | `POST /api/auth/register` | No password | 400 + validation error |
| Login — success | `POST /api/auth/login` | Correct credentials | 200 + `{ token, user }` |
| Login — wrong password | `POST /api/auth/login` | Wrong password | 401 + error |
| Get profile — authenticated | `GET /api/auth/me` | Valid JWT | 200 + user object |
| Get profile — no token | `GET /api/auth/me` | No header | 401 |
| Get profile — expired token | `GET /api/auth/me` | Expired JWT | 401 |

#### Order Routes

| Test Case | Method + Path | Input | Expected Response |
|-----------|--------------|-------|-------------------|
| Create order | `POST /api/orders` | Valid order body + customer JWT | 201 + order |
| Create order — rider token | `POST /api/orders` | Rider JWT | 403 |
| Create order — no token | `POST /api/orders` | No auth | 401 |
| Get my orders | `GET /api/orders/my` | Customer JWT | 200 + array |
| Get order by ID — owner | `GET /api/orders/:id` | JWT of order's customer | 200 + order |
| Get order by ID — wrong user | `GET /api/orders/:id` | Different customer JWT | 403 |
| Cancel order | `PATCH /api/orders/:id/cancel` | Customer JWT + pending order | 200 |
| Cancel in-progress order | `PATCH /api/orders/:id/cancel` | Customer JWT + in_transit order | 400 |
| Rate order | `PATCH /api/orders/:id/rate` | `{ rating: 5 }` + delivered order | 200 |

#### Rider Routes

| Test Case | Method + Path | Input | Expected Response |
|-----------|--------------|-------|-------------------|
| Go online | `PATCH /api/riders/status` | `{ isOnline: true }` + rider JWT | 200 |
| Go online — customer token | `PATCH /api/riders/status` | Customer JWT | 403 |
| Update location | `PATCH /api/riders/location` | Coordinates + rider JWT | 200 |
| Accept order | `PATCH /api/riders/orders/:id/accept` | Rider JWT + available order | 200 |
| Accept — already taken | `PATCH /api/riders/orders/:id/accept` | Another rider JWT | 400 |
| Update status — pickup | `PATCH /api/riders/orders/:id/status` | `{ status: 'pickup' }` + assigned rider JWT | 200 |
| Get earnings | `GET /api/riders/earnings` | Rider JWT | 200 + earnings summary |

---

### 2.3 Manual End-to-End Tests (UAT)
**Scope:** Full user journeys on physical devices  
**Devices:** Android phone (physical) + Android emulator  
**Test Environment:** Backend running locally with MongoDB Atlas  

#### Test Scenarios

**E2E-01: New Customer Journey**
1. Install app on Android phone via Expo Go
2. Navigate to Register → complete 3-step form as customer
3. Confirm redirect to Customer Home
4. Verify name appears in greeting
5. Verify map loads with current location
6. Tap "Where are you sending to?" and enter an address
7. Complete booking flow — select SwiftBike
8. Confirm price is calculated correctly
9. Submit order — verify "Searching for rider..." screen appears
10. Check backend database: order document created with correct fields

**E2E-02: Full Delivery (Requires Two Devices)**
1. Device A: Logged in as customer, order placed and waiting
2. Device B: Logged in as rider, toggle online
3. Device B: Verify incoming order modal appears with correct details
4. Device B: Accept the order
5. Device A: Verify tracking screen shows rider name and moving map pin
6. Device B: Tap "Arrived at Pickup" → verify Device A status updates
7. Device B: Tap "Package Collected" → verify Device A status updates
8. Device B: Tap "Delivered" → verify Device A sees delivery notification
9. Device A: Rate the delivery (5 stars) → verify order status = "rated"
10. Device B: Open Earnings → verify trip added and earnings updated

**E2E-03: Cancellation Flow**
1. Customer places an order
2. Before a rider accepts, customer navigates to History → Active
3. Tap order and cancel it
4. Verify order status = "cancelled"
5. Verify rider does NOT see the order as available

**E2E-04: Demo Mode**
1. Open app without an account
2. Tap "Customer Demo" on Login screen
3. Verify Customer Home loads with mock data
4. Tap "Rider Demo" on Login screen
5. Verify Rider Dashboard loads with mock data
6. Verify no API calls are made to backend

**E2E-05: Draggable Sheet**
1. Open Customer Home or Rider Dashboard
2. Swipe bottom sheet down — verify panel minimises
3. Map should be fully visible
4. Swipe up — verify panel springs back up

---

### 2.4 Performance Tests
**Tool:** k6 or Artillery  
**Target:** Backend API under load  

| Test | Load | Pass Criteria |
|------|------|---------------|
| Login endpoint | 50 concurrent requests/s for 30s | p95 < 500ms, 0% error rate |
| Order creation | 20 concurrent requests/s for 30s | p95 < 800ms, 0% error rate |
| Order listing (GET /orders/my) | 100 concurrent requests/s for 60s | p95 < 400ms |
| Socket.io connections | 200 simultaneous connections | All connected, no timeouts |
| Socket.io broadcast (new_order) | 1 order broadcast to 100 riders | All 100 receive within 500ms |

---

## 3. Bug Severity Classification

| Severity | Description | SLA to Fix |
|----------|-------------|-----------|
| 🔴 Critical | App crashes, data loss, security breach | Same day |
| 🟠 High | Feature completely broken, blocks user flow | 1–2 days |
| 🟡 Medium | Feature broken but has workaround | 3–5 days |
| 🟢 Low | Minor UI issue, cosmetic bug | Next sprint |

---

## 4. Test Checklist Before Each Release

- [ ] All unit tests passing (`npm test`)
- [ ] All integration tests passing
- [ ] E2E-01 and E2E-02 completed manually on physical Android device
- [ ] No critical or high bugs open
- [ ] `npm audit` shows no critical vulnerabilities
- [ ] `.env` values are not present in any committed file
- [ ] Backend connects to MongoDB Atlas successfully
- [ ] App loads within 3 seconds on a mid-range Android device
