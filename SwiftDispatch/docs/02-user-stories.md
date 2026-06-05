# User Stories & Use Cases
## SwiftDispatch

**Format:** `As a [persona], I want to [action] so that [benefit].`  
**Priority:** 🔴 Must Have | 🟡 Should Have | 🟢 Could Have

---

## Authentication

| ID | Story | Priority |
|----|-------|----------|
| AUTH-01 | As a new user, I want to register as either a customer or a dispatch rider so that I can access the right experience for my role. | 🔴 |
| AUTH-02 | As a customer, I want to provide my name, email, phone, and password during registration so that my account is identifiable. | 🔴 |
| AUTH-03 | As a rider, I want to provide my vehicle type and plate number during registration so that customers know what to expect. | 🔴 |
| AUTH-04 | As a registered user, I want to log in with my email and password so that I can securely access my account. | 🔴 |
| AUTH-05 | As a user, I want to stay logged in between sessions so that I don't have to sign in every time I open the app. | 🔴 |
| AUTH-06 | As a user, I want to reset my password via email so that I can regain access if I forget it. | 🟡 |
| AUTH-07 | As a new user, I want a demo mode so that I can explore the app without creating an account. | 🟡 |

---

## Customer — Booking a Delivery

| ID | Story | Priority |
|----|-------|----------|
| BOOK-01 | As a customer, I want to enter a pickup address so that the rider knows where to collect the package. | 🔴 |
| BOOK-02 | As a customer, I want to enter a drop-off address so that the rider knows where to deliver. | 🔴 |
| BOOK-03 | As a customer, I want to see my current location auto-filled as the pickup point so that I don't have to type it manually. | 🔴 |
| BOOK-04 | As a customer, I want to search for addresses by name so that I can find places I don't know the exact address of. | 🔴 |
| BOOK-05 | As a customer, I want to see all available vehicle types with their prices so that I can choose what fits my package and budget. | 🔴 |
| BOOK-06 | As a customer, I want to see an estimated delivery time for each vehicle type so that I can plan accordingly. | 🔴 |
| BOOK-07 | As a customer, I want to see the price calculated from distance so that I know exactly what I'll pay before confirming. | 🔴 |
| BOOK-08 | As a customer, I want to describe my package (weight, fragile, etc.) so that the rider handles it appropriately. | 🟡 |
| BOOK-09 | As a customer, I want to select a payment method (cash, card, wallet) so that I can pay in my preferred way. | 🟡 |
| BOOK-10 | As a customer, I want to review and confirm my order before it is placed so that I don't accidentally send wrong details. | 🔴 |
| BOOK-11 | As a customer, I want to use saved addresses (Home, Office) for quick booking so that I save time on repeat deliveries. | 🟡 |

---

## Customer — Tracking & Delivery

| ID | Story | Priority |
|----|-------|----------|
| TRACK-01 | As a customer, I want to see my order status update in real time so that I know where my package is. | 🔴 |
| TRACK-02 | As a customer, I want to see the assigned rider's name, rating, and vehicle on a map so that I feel confident about my delivery. | 🔴 |
| TRACK-03 | As a customer, I want to see the rider's live location move on a map so that I know exactly when they'll arrive. | 🔴 |
| TRACK-04 | As a customer, I want to receive push notifications at key milestones (rider accepted, rider at pickup, package delivered) so that I don't have to keep the app open. | 🟡 |
| TRACK-05 | As a customer, I want to cancel an order before a rider is assigned so that I'm not charged if my plans change. | 🔴 |
| TRACK-06 | As a customer, I want to rate my rider and leave a review after delivery so that other customers benefit from my experience. | 🔴 |

---

## Customer — History & Profile

| ID | Story | Priority |
|----|-------|----------|
| HIST-01 | As a customer, I want to see all my past orders with status, date, and price so that I have a complete delivery history. | 🔴 |
| HIST-02 | As a customer, I want to see my active order from any screen so that I can always get back to tracking quickly. | 🔴 |
| PROF-01 | As a customer, I want to view and edit my profile (name, email, phone) so that my details stay up to date. | 🟡 |
| PROF-02 | As a customer, I want to see my referral code and share it so that I can earn rewards for inviting friends. | 🟡 |
| PROF-03 | As a customer, I want to see my wallet balance and transaction history so that I know how my credits are being used. | 🟡 |

---

## Rider — Availability & Receiving Orders

| ID | Story | Priority |
|----|-------|----------|
| RIDER-01 | As a rider, I want to toggle my availability (online/offline) so that I only receive orders when I'm ready to work. | 🔴 |
| RIDER-02 | As a rider, I want to see incoming orders with pickup address, drop-off address, distance, price, and package description so that I can make an informed decision. | 🔴 |
| RIDER-03 | As a rider, I want a 30-second countdown on incoming orders so that I don't keep customers waiting too long. | 🔴 |
| RIDER-04 | As a rider, I want to accept an order so that I can start earning. | 🔴 |
| RIDER-05 | As a rider, I want to decline an order with a confirmation prompt so that I'm not accidentally penalised. | 🔴 |
| RIDER-06 | As a rider, I want my location to update automatically while I'm on a delivery so that the customer can track me. | 🔴 |

---

## Rider — Completing a Delivery

| ID | Story | Priority |
|----|-------|----------|
| DELIV-01 | As a rider, I want to mark that I've arrived at the pickup location so that the customer is notified. | 🔴 |
| DELIV-02 | As a rider, I want to mark that I've picked up the package so that the order status advances to "in transit". | 🔴 |
| DELIV-03 | As a rider, I want to mark the delivery as complete so that the order is closed and earnings are recorded. | 🔴 |
| DELIV-04 | As a rider, I want to see turn-by-turn navigation to the pickup and drop-off address so that I can reach unfamiliar locations. | 🟡 |

---

## Rider — Earnings & Profile

| ID | Story | Priority |
|----|-------|----------|
| EARN-01 | As a rider, I want to see today's earnings, total trips, and rating at a glance so that I can track my performance. | 🔴 |
| EARN-02 | As a rider, I want to see a daily earnings breakdown chart so that I can identify my best days. | 🟡 |
| EARN-03 | As a rider, I want to see all my completed transactions so that I can reconcile my income. | 🟡 |
| EARN-04 | As a rider, I want to withdraw my earnings to my bank account so that I get paid. | 🟡 |
| EARN-05 | As a rider, I want to see my tier (Bronze, Silver, Gold) so that I'm motivated to improve. | 🟡 |
| EARN-06 | As a rider, I want to see my acceptance rate and completion rate so that I understand my performance score. | 🟡 |

---

## Admin (Internal)

| ID | Story | Priority |
|----|-------|----------|
| ADMIN-01 | As an admin, I want to view all registered users and riders so that I can manage the platform. | 🟡 |
| ADMIN-02 | As an admin, I want to verify or reject rider documents so that only legitimate riders are active. | 🟡 |
| ADMIN-03 | As an admin, I want to view all orders and their statuses so that I can resolve disputes. | 🟡 |
| ADMIN-04 | As an admin, I want to set the platform fee percentage so that revenue is correctly calculated. | 🟡 |

---

## Use Cases (Detailed)

### UC-01: Customer Books a Delivery

**Actor:** Customer  
**Precondition:** Customer is logged in and has location permissions granted.

**Main Flow:**
1. Customer opens the app and sees the map home screen.
2. Customer taps "Where are you sending to?" search bar.
3. Customer enters or selects drop-off address from suggestions.
4. Customer confirms pickup address (auto-filled from location or edited).
5. System displays available vehicle types with prices and ETAs.
6. Customer selects a vehicle type.
7. Customer optionally adds package description and notes.
8. Customer selects payment method.
9. Customer reviews summary and taps "Confirm Booking".
10. System creates order and begins searching for a nearby rider.
11. Customer is taken to the tracking screen.

**Alternative Flow — No riders available:**
- At step 10, if no riders accept within 5 minutes, the system notifies the customer and cancels the order automatically.

---

### UC-02: Rider Accepts and Completes a Delivery

**Actor:** Rider  
**Precondition:** Rider is logged in and online.

**Main Flow:**
1. Rider sees the map dashboard with online status active.
2. An incoming order modal slides up with a 30-second timer.
3. Rider reviews order details (customer, addresses, package, price).
4. Rider taps "Accept".
5. System assigns the rider and notifies the customer.
6. Rider navigates to pickup address.
7. Rider taps "Arrived at Pickup".
8. Rider collects package and taps "Package Collected".
9. Rider navigates to drop-off address.
10. Rider delivers and taps "Delivered".
11. Order is marked complete; earnings are credited.
12. Customer receives delivery confirmation and rating prompt.

**Alternative Flow — Rider declines:**
- At step 4, rider taps "Decline"; order is re-queued to the next available rider.
