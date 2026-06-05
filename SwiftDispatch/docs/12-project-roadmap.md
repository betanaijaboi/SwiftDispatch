# Project Roadmap & Milestones
## SwiftDispatch

---

## Overview

```
Phase 1 — MVP         Phase 2 — Beta        Phase 3 — Launch      Phase 4 — Scale
Jan – Mar 2026    →   Apr – Jun 2026    →   Jul – Sep 2026    →   Oct 2026+
Core booking &        Payments, push,        Public launch,         Business tier,
real-time tracking    saved places,          marketing, Web         multi-city,
                      admin dashboard        admin                  analytics
```

---

## Phase 1 — MVP (Completed)
**Goal:** Working end-to-end delivery app usable by internal testers.  
**Target:** February 2026

### Deliverables

| Feature | Status |
|---------|--------|
| Splash screen with onboarding | ✅ Done |
| Customer registration (3-step flow) | ✅ Done |
| Rider registration with vehicle details | ✅ Done |
| JWT login / logout / session persistence | ✅ Done |
| Demo mode (Customer + Rider) | ✅ Done |
| Customer home screen with live map | ✅ Done |
| 4-step booking flow with live pricing | ✅ Done |
| Vehicle selection (Bike, Bicycle, Car, Van) | ✅ Done |
| Distance calculation (Haversine formula) | ✅ Done |
| Order creation via REST API | ✅ Done |
| Socket.io order broadcast to online riders | ✅ Done |
| Incoming order modal (30-second countdown) | ✅ Done |
| Accept / Decline order | ✅ Done |
| Real-time rider location tracking on customer map | ✅ Done |
| Order status progression (accepted → pickup → transit → delivered) | ✅ Done |
| Post-delivery rating screen | ✅ Done |
| Order history (active + past tabs) | ✅ Done |
| In-app notifications screen | ✅ Done |
| Customer profile screen | ✅ Done |
| Rider earnings dashboard with bar chart | ✅ Done |
| Rider profile with performance stats | ✅ Done |
| MongoDB Atlas integration | ✅ Done |
| Draggable bottom sheet on map screens | ✅ Done |
| Ionicons design system (no emoji) | ✅ Done |
| README + full documentation suite | ✅ Done |
| GitHub repository (betanaijaboi/SwiftDispatch) | ✅ Done |

---

## Phase 2 — Beta
**Goal:** Feature-complete app ready for real users and initial go-to-market.  
**Target:** June 2026

### Features to Build

| Feature | Priority | Notes |
|---------|----------|-------|
| Push notifications (FCM + APNs via Expo) | 🔴 High | Rider accepted, delivered, promo alerts |
| In-trip rider–customer chat | 🔴 High | Socket.io messaging |
| Paystack card payment integration | 🔴 High | Nigerian card payments |
| Swift Wallet top-up and spend | 🟡 Medium | In-app credits system |
| Saved addresses (Home, Office, etc.) | 🟡 Medium | Quick booking |
| Rider tier system (Bronze → Silver → Gold) | 🟡 Medium | Based on trips + rating |
| Admin web dashboard | 🔴 High | Manage users, orders, disputes |
| Rider document upload + verification | 🟡 Medium | ID + licence photos |
| Google Maps Places API integration | 🔴 High | Real address autocomplete |
| Google Maps directions (routing on map) | 🟡 Medium | Route polyline on tracking screen |
| OTP phone verification on registration | 🟡 Medium | SMS via Termii or Twilio |
| Performance testing + load testing | 🔴 High | Target 500 concurrent users |
| Backend deployment on Railway | 🔴 High | Live URL for beta testers |

### Milestone: Beta Launch
- 50 beta testers (25 customers + 25 riders)
- At least 200 successful test deliveries
- Zero data loss incidents
- Average rating from testers: ≥ 4.0 / 5.0

---

## Phase 3 — Public Launch
**Goal:** Open app to the public in Lagos. Listed on Google Play Store and Apple App Store.  
**Target:** September 2026

### Features to Build

| Feature | Priority | Notes |
|---------|----------|-------|
| EAS Build (Expo Application Services) | 🔴 High | Production .apk and .ipa |
| Google Play Store submission | 🔴 High | Android launch |
| App Store submission | 🟡 Medium | iOS launch (requires Mac/Xcode) |
| Marketing landing page | 🟡 Medium | swiftdispatch.app |
| Referral system with rewards | 🟡 Medium | ₦500 per referral credited to wallet |
| Shareable delivery tracking link | 🟡 Medium | Recipient can track without the app |
| In-app promo code system | 🟡 Medium | Discount vouchers |
| Scheduled/future deliveries | 🟢 Low | Book 2 hours in advance |
| Night Owl service (10 PM – 6 AM) | 🟢 Low | Surcharge pricing |
| Analytics dashboard (internal) | 🔴 High | Orders, GMV, retention metrics |

### Milestone: Public Launch
- App live on Play Store
- 500 registered customers in first month
- 100 active verified riders
- ₦1M GMV in first month
- Support email and WhatsApp line operational

---

## Phase 4 — Scale
**Goal:** Expand to Abuja and Port Harcourt. Introduce business accounts.  
**Target:** Q1 2027

### Features to Build

| Feature | Notes |
|---------|-------|
| Business accounts | Bulk deliveries, invoicing, API access |
| Multi-city support | City-based rider pools and pricing |
| Multi-stop deliveries | One order, 2–3 dropoff points |
| Delivery insurance | Per-order coverage for high-value packages |
| Stripe integration | International card support |
| Enterprise dashboard (B2B) | Account managers, usage reports |
| Rider mobile app standalone (React Native CLI) | Separate, optimised rider app |
| Package photo on pickup/delivery | Proof of collection and delivery |
| Automated payouts (bank transfers) | Weekly auto-payout to riders |
| ML-based rider matching | Match order to nearest + highest-rated rider |

### Milestone: Scale
- Active in 3 Nigerian cities
- 5,000 monthly active customers
- 1,000 active riders
- ₦15M GMV per month
- Series A fundraising readiness

---

## Sprint Breakdown (Phase 2 — 6 Weeks)

| Sprint | Duration | Focus |
|--------|----------|-------|
| Sprint 1 | Week 1–2 | Google Maps API integration (real autocomplete + routing) |
| Sprint 2 | Week 2–3 | Push notifications + in-trip chat |
| Sprint 3 | Week 3–4 | Paystack payment integration + Swift Wallet |
| Sprint 4 | Week 4–5 | Admin dashboard (web, React) |
| Sprint 5 | Week 5–6 | Performance testing + bug fixes + beta prep |

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Google Maps API cost overrun | Medium | High | Implement request caching; set billing alerts |
| Riders slow to onboard | High | High | Partner with rider unions; referral incentives |
| Socket.io scaling issues | Low | High | Add Redis adapter before hitting 500 concurrent sockets |
| Payment gateway delays (Paystack approval) | Medium | Medium | Apply early; have cash-only fallback |
| App Store review rejection | Low | Medium | Follow Apple guidelines strictly; test on real devices |
| Data breach | Low | Critical | Full security audit before Phase 3 |
