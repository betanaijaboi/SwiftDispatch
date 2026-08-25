# Privacy Policy — SwiftDispatch

Last updated: 2026-08-25

## What we collect

- **Account info:** name, email/phone, password (bcrypt-hashed, never
  stored in plaintext).
- **Order data:** pickup/dropoff addresses, item description, order
  status/history.
- **Live location data:** shared in real time during an active order
  (customer pickup/dropoff points; rider's live position) via WebSocket
  (Socket.io) for order tracking and dispatch matching.

## Why we collect it

To match orders with available riders, provide live tracking during
delivery, and maintain order history for support/disputes.

## Location data specifically

Live location sharing is active only during an active order. We don't
track a rider's or customer's location outside the context of an active
delivery.

## Who we share it with

- **The matched rider/customer for that specific order** — pickup/dropoff
  location and order details are necessarily shared between the two
  parties to complete the delivery.
- We do not sell your personal or location data to third parties.

## Data retention

Order history (including addresses used) is retained for support and
dispute-resolution purposes. Live location data is not retained beyond
what's needed to complete and later reference the order.

## Your rights (Nigeria Data Protection Act 2023)

You can request access to, correction of, or deletion of your account
data at any time. Some order records may be retained for a limited period
for dispute-resolution purposes even after a deletion request.

## Security

Passwords are bcrypt-hashed. Authenticated requests use JWT tokens.

## Contact

Budoessien2331@outlook.com
