# Product Requirements Document (PRD)
## SwiftDispatch — Dispatch Rider Hiring App

**Version:** 1.0  
**Date:** June 2026  
**Owner:** betanaijaboi  
**Status:** Active Development

---

## 1. Problem Statement

In Nigerian cities like Lagos, Abuja, and Port Harcourt, individuals and businesses frequently need to send physical packages across town — documents, food, items sold online, electronics, and more. The current options are:

- Calling an informal dispatch rider whose number was saved from a previous encounter
- Using general-purpose ride-hailing apps not optimised for package delivery
- Relying on untracked, uninsured, and unreliable courier services

This creates three core problems:

1. **For customers:** No reliable, on-demand way to find a trusted dispatch rider, get an upfront price, and track the delivery in real time.
2. **For riders:** No structured platform to receive consistent delivery jobs, build reputation, or track earnings professionally.
3. **For the market:** No transparent pricing, no accountability layer, and no digital record of deliveries.

SwiftDispatch solves this by providing a two-sided marketplace — connecting customers who need things delivered with verified dispatch riders who earn by delivering.

---

## 2. Target Users

### Primary Users

| Persona | Description |
|---------|-------------|
| **Urban Customer** | Lagos/Abuja resident aged 22–45. Sends packages weekly — small business owner, office worker, or active online shopper. Owns a smartphone, comfortable with apps. Values speed, price transparency, and peace of mind. |
| **Dispatch Rider** | Commercial rider aged 20–40. Owns or rents a motorcycle, bicycle, car, or van. Currently works informally or with a small courier company. Wants steady income, fair pay, and flexible hours. |

### Secondary Users

| Persona | Description |
|---------|-------------|
| **Small Business Owner** | Runs an online store or service business. Needs daily or weekly deliveries at scale. |
| **Admin / Ops** | Internal SwiftDispatch team managing the platform, disputes, and rider verification. |

---

## 3. User Goals

### Customer Goals
- Book a delivery in under 60 seconds
- Know the exact price before confirming
- Watch the rider move on a map in real time
- Rate the experience and build a trusted rider shortlist
- Have a clear record of all past deliveries

### Rider Goals
- Receive clear, well-paying job offers instantly
- Accept or decline jobs without penalty for reasonable declines
- See exactly how much they earn per trip and in total
- Build a rating/tier that unlocks better jobs
- Withdraw earnings easily to a bank account

---

## 4. Business Goals

| Goal | Metric | Target (12 months) |
|------|--------|-------------------|
| Grow active users | Monthly Active Users (MAU) | 10,000 customers |
| Grow supply | Active verified riders | 1,500 riders |
| Drive transaction volume | Orders per month | 30,000 |
| Monetise | Take rate per order | 15% platform fee |
| Retain users | 30-day retention | > 40% |

---

## 5. Success Metrics

### North Star Metric
> **Successful deliveries per month** — a delivery is "successful" when it is rated ≥ 3 stars by the customer.

### Supporting KPIs

| Category | Metric | Target |
|----------|--------|--------|
| Acquisition | New customer signups / week | 500 |
| Activation | % users who complete first booking | > 60% |
| Engagement | Bookings per active customer / month | ≥ 3 |
| Supply | Average rider utilisation (hours online vs. orders accepted) | > 50% |
| Quality | Average order rating | ≥ 4.5 / 5 |
| Speed | Median time from booking to rider acceptance | < 3 min |
| Reliability | Order cancellation rate (rider-initiated) | < 5% |
| Revenue | Monthly Gross Merchandise Value (GMV) | ₦15M by month 12 |

---

## 6. Feature Prioritization

### Must Have (MVP — Phase 1)
- [ ] Customer registration and login
- [ ] Rider registration with vehicle details
- [ ] Address search and pickup/dropoff selection
- [ ] Vehicle type selection with live pricing
- [ ] Order creation and confirmation
- [ ] Real-time rider matching and acceptance
- [ ] Live tracking of rider on map
- [ ] Order status updates (accepted → pickup → transit → delivered)
- [ ] Post-delivery rating system
- [ ] Rider earnings dashboard
- [ ] Basic in-app notifications

### Should Have (Phase 2)
- [ ] Saved addresses (Home, Office, etc.)
- [ ] In-trip rider–customer chat
- [ ] Order history with receipts
- [ ] Rider tier/badge system (Bronze, Silver, Gold)
- [ ] Push notifications (Expo Notifications)
- [ ] Referral code and rewards
- [ ] Admin dashboard (web)
- [ ] Multiple payment methods (cash, card, wallet)

### Could Have (Phase 3+)
- [ ] Scheduled/future deliveries
- [ ] Business accounts with bulk delivery
- [ ] Night Owl service (10 PM–6 AM)
- [ ] Package insurance
- [ ] Delivery tracking link shareable with recipient
- [ ] OTP verification on delivery
- [ ] Multi-stop deliveries
- [ ] Stripe/Paystack integration for card payments

### Won't Have (Out of Scope for v1)
- Food delivery
- Intercity logistics
- Driver background checks beyond self-declaration
- Customer-to-customer marketplace

---

## 7. Constraints and Assumptions

- App targets Android first (majority of Nigerian smartphone market); iOS support via Expo
- Network connectivity: assumes 3G minimum; app should degrade gracefully on poor networks
- Maps: uses React Native Maps (Google Maps on Android); requires Google Maps API key in production
- Payments v1: cash on delivery only; card/wallet in Phase 2
- Language: English only in v1
- Currency: Nigerian Naira (₦) only in v1
