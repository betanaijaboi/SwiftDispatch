# Functional Requirements
## SwiftDispatch

**Version:** 1.0  
**Status:** MVP Scope

---

## FR-01: Authentication & Accounts

| ID | Requirement |
|----|-------------|
| FR-01.1 | The system shall allow new users to register with name, email, phone, password, and role (customer or rider). |
| FR-01.2 | The system shall prevent duplicate registrations using the same email address. |
| FR-01.3 | The system shall hash all passwords using bcrypt before storing them. |
| FR-01.4 | The system shall return a signed JWT token upon successful registration or login. |
| FR-01.5 | The system shall allow users to log in with email and password. |
| FR-01.6 | The system shall maintain user sessions across app restarts using stored JWT tokens. |
| FR-01.7 | The system shall allow users to log out, which clears the stored token from the device. |
| FR-01.8 | The system shall require riders to provide vehicle type and plate number during registration. |
| FR-01.9 | The system shall provide a demo mode allowing unauthenticated users to explore the app with mock data. |

---

## FR-02: Customer — Booking

| ID | Requirement |
|----|-------------|
| FR-02.1 | The system shall display the customer's current GPS location as the default pickup point. |
| FR-02.2 | The system shall allow customers to search for and select addresses using a text search field. |
| FR-02.3 | The system shall allow customers to manually edit or override the auto-detected pickup address. |
| FR-02.4 | The system shall display all available vehicle types (SwiftBike, EcoCycle, SwiftCar, SwiftVan) with their base price, per-km rate, capacity, and estimated arrival time. |
| FR-02.5 | The system shall calculate and display the delivery price based on the selected vehicle type and the calculated distance between pickup and dropoff. |
| FR-02.6 | The system shall round all calculated prices to the nearest ₦10. |
| FR-02.7 | The system shall allow customers to add a package description and optional notes for the rider. |
| FR-02.8 | The system shall allow customers to select a payment method (cash in v1; card and wallet in Phase 2). |
| FR-02.9 | The system shall present a full order summary screen before final confirmation. |
| FR-02.10 | The system shall submit the order to the backend upon confirmation and navigate the customer to the tracking screen. |

---

## FR-03: Rider Matching & Assignment

| ID | Requirement |
|----|-------------|
| FR-03.1 | The system shall broadcast new orders to all riders who are currently online via Socket.io. |
| FR-03.2 | The system shall display incoming orders to riders as a modal overlay showing: customer name, rating, pickup address and distance, dropoff address and trip distance, package description, and price. |
| FR-03.3 | The system shall show a 30-second countdown on the incoming order modal. |
| FR-03.4 | The system shall auto-decline the order if the rider does not respond within 30 seconds. |
| FR-03.5 | The system shall allow a rider to accept an order, which assigns them to that order and notifies the customer. |
| FR-03.6 | The system shall prevent two riders from accepting the same order (first-come-first-served). |
| FR-03.7 | The system shall allow a rider to decline an order after a confirmation prompt. |
| FR-03.8 | The system shall allow riders to toggle their availability status between online and offline. |
| FR-03.9 | The system shall require a confirmation alert when a rider tries to go offline. |

---

## FR-04: Real-Time Tracking

| ID | Requirement |
|----|-------------|
| FR-04.1 | The system shall display the assigned rider's current GPS location on a map visible to the customer. |
| FR-04.2 | The system shall update the rider's map position in near-real-time (at least every 5 seconds) while a delivery is in progress. |
| FR-04.3 | The system shall display the rider's name, rating, vehicle type, and plate number on the tracking screen. |
| FR-04.4 | The system shall show the current order status on the tracking screen (Searching / Accepted / At Pickup / In Transit / Delivered). |
| FR-04.5 | The system shall allow the customer to see an active delivery banner on the home screen while an order is in progress. |

---

## FR-05: Delivery Lifecycle (Rider Actions)

| ID | Requirement |
|----|-------------|
| FR-05.1 | The system shall provide the rider with step-by-step action buttons: [Arrived at Pickup] → [Package Collected] → [Delivered]. |
| FR-05.2 | The system shall update the order status and notify the customer when each step is completed. |
| FR-05.3 | The system shall credit the rider's earnings when the delivery is marked as delivered. |
| FR-05.4 | The system shall increment the rider's trip count upon successful delivery. |

---

## FR-06: Ratings & Reviews

| ID | Requirement |
|----|-------------|
| FR-06.1 | The system shall prompt the customer to rate the delivery after it is marked as delivered. |
| FR-06.2 | The system shall accept a star rating from 1 to 5. |
| FR-06.3 | The system shall accept optional quick-tag selections (e.g., Fast, Careful, Professional). |
| FR-06.4 | The system shall accept an optional text review. |
| FR-06.5 | The system shall update the rider's average rating after each new rating is submitted. |
| FR-06.6 | The system shall mark the order status as "rated" after a review is submitted. |

---

## FR-07: Order History

| ID | Requirement |
|----|-------------|
| FR-07.1 | The system shall display all active orders (pending, searching, accepted, pickup, in_transit) in an "Active" tab. |
| FR-07.2 | The system shall display all historical orders (delivered, cancelled, rated) in a "History" tab. |
| FR-07.3 | The system shall show order ID, date, vehicle type icon, addresses, status badge, and price for each order card. |
| FR-07.4 | The system shall allow customers to tap an active order to navigate to the tracking screen. |

---

## FR-08: Notifications

| ID | Requirement |
|----|-------------|
| FR-08.1 | The system shall display an in-app notification centre accessible from the home screen. |
| FR-08.2 | The system shall categorise notifications as: Order, Promo, or System. |
| FR-08.3 | The system shall show an unread count badge on the notification icon. |
| FR-08.4 | The system shall allow users to mark individual notifications as read by tapping them. |
| FR-08.5 | The system shall allow users to mark all notifications as read at once. |

---

## FR-09: Rider Earnings

| ID | Requirement |
|----|-------------|
| FR-09.1 | The system shall display today's earnings, total trips today, and average rating on the rider dashboard. |
| FR-09.2 | The system shall display a daily bar chart of earnings for the current week. |
| FR-09.3 | The system shall allow the rider to switch between Today, This Week, and This Month views. |
| FR-09.4 | The system shall display a list of recent transactions with order ID, time, and amount. |
| FR-09.5 | The system shall differentiate earning entries (green) from withdrawal entries (red) visually. |

---

## FR-10: Profile & Settings

| ID | Requirement |
|----|-------------|
| FR-10.1 | The system shall display the user's name, email, avatar, and verified status on the profile screen. |
| FR-10.2 | The system shall display the customer's delivery count, average rating, and member duration. |
| FR-10.3 | The system shall display a unique referral code per user. |
| FR-10.4 | The system shall allow the rider to view their vehicle information (type, plate). |
| FR-10.5 | The system shall provide menu items for: Edit Profile, Phone Number, Change Password, Saved Addresses, Payment Methods, Help & Support, Terms & Privacy, Rate the App. |
| FR-10.6 | The system shall allow users to log out, which clears auth state and redirects to the splash screen. |

---

## FR-11: Draggable Bottom Sheet (UI)

| ID | Requirement |
|----|-------------|
| FR-11.1 | The system shall allow users to drag the bottom sheet panel down to minimise it, revealing the full map. |
| FR-11.2 | The system shall allow users to drag the panel back up to restore the normal view. |
| FR-11.3 | The panel shall snap to either fully expanded or minimised positions (no partial stops). |
| FR-11.4 | The system shall leave only the drag handle visible when the panel is in the minimised position. |
