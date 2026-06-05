# Non-Functional Requirements
## SwiftDispatch

---

## NFR-01: Performance

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-01.1 | API response time for all REST endpoints | < 500ms (p95) |
| NFR-01.2 | API response time under load | < 2s (p99) |
| NFR-01.3 | App cold start time (first meaningful paint) | < 3 seconds |
| NFR-01.4 | Map screen render with live location | < 2 seconds after permissions granted |
| NFR-01.5 | Socket.io real-time message delivery latency | < 300ms |
| NFR-01.6 | Rider location update frequency during active delivery | Every 5 seconds |
| NFR-01.7 | Order creation end-to-end (tap confirm → tracking screen) | < 3 seconds |
| NFR-01.8 | Image/icon assets load time | < 1 second |

---

## NFR-02: Scalability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-02.1 | Concurrent active users (v1 launch) | 500 simultaneous |
| NFR-02.2 | Concurrent active users (Phase 2) | 5,000 simultaneous |
| NFR-02.3 | Concurrent Socket.io connections | 2,000 (Phase 2: 10,000) |
| NFR-02.4 | Orders processed per day | 1,000 (Phase 2: 10,000) |
| NFR-02.5 | Database read/write throughput | MongoDB Atlas M0 → M10 upgrade when needed |
| NFR-02.6 | Backend horizontal scaling | Stateless Node.js + Socket.io adapter allows multiple instances |

---

## NFR-03: Reliability & Availability

| ID | Requirement | Target |
|----|-------------|--------|
| NFR-03.1 | Backend API uptime | ≥ 99.5% monthly |
| NFR-03.2 | Database uptime (MongoDB Atlas) | ≥ 99.95% (Atlas SLA) |
| NFR-03.3 | Graceful degradation — if real-time socket drops | App continues via REST polling; reconnects automatically |
| NFR-03.4 | Order data persistence | Orders are never lost — saved to DB before Socket.io broadcast |
| NFR-03.5 | App crash rate | < 1% of sessions |
| NFR-03.6 | Ride matching re-queue on driver disconnect | If accepted rider disconnects, order reverts to "searching" |

---

## NFR-04: Usability

| ID | Requirement |
|----|-------------|
| NFR-04.1 | All primary user actions (book, track, accept, deliver) shall be reachable in 3 taps or fewer from the home screen. |
| NFR-04.2 | All input forms shall show inline validation errors without requiring a submit attempt. |
| NFR-04.3 | The app shall support both portrait orientation on phones (landscape not required for v1). |
| NFR-04.4 | All text shall meet WCAG AA minimum contrast ratio (4.5:1 for body text). |
| NFR-04.5 | The app shall not block the UI with loading spinners for more than 5 seconds without offering a retry. |
| NFR-04.6 | Error messages shall describe the problem in plain language, not technical terms. |
| NFR-04.7 | The keyboard shall never obscure an active input field. |
| NFR-04.8 | Bottom sheet panels shall be draggable to reveal the full map. |

---

## NFR-05: Compatibility

| ID | Requirement |
|----|-------------|
| NFR-05.1 | Android: Support Android 8.0 (API level 26) and above. |
| NFR-05.2 | iOS: Support iOS 14.0 and above. |
| NFR-05.3 | The app shall run on all screen sizes from 5" to 7" without layout breakage. |
| NFR-05.4 | The app shall work correctly on devices with and without notches/punch-hole cameras via SafeAreaView. |
| NFR-05.5 | The app shall function on 3G mobile connections with acceptable performance (degraded map quality is acceptable). |

---

## NFR-06: Maintainability

| ID | Requirement |
|----|-------------|
| NFR-06.1 | All source code shall use TypeScript on the frontend with strict type checking enabled. |
| NFR-06.2 | All API route handlers shall be separated from business logic (controllers vs. routes). |
| NFR-06.3 | The theme (colors, fonts, spacing) shall be defined in a single `constants/theme.ts` file. |
| NFR-06.4 | Reusable UI components (Button, Input, Card, StatusBadge) shall be in the `components/` directory. |
| NFR-06.5 | State management shall use Zustand stores in the `store/` directory. |
| NFR-06.6 | API calls shall be centralised in `services/api.ts`. |
| NFR-06.7 | Socket.io event handling shall be centralised in `services/socket.ts`. |
| NFR-06.8 | The codebase shall have no hardcoded IP addresses or secrets in source files. |

---

## NFR-07: Portability

| ID | Requirement |
|----|-------------|
| NFR-07.1 | A new developer shall be able to clone the repo, follow the README, and run the full stack locally in under 30 minutes. |
| NFR-07.2 | The backend shall require only a `.env` file to configure database and auth settings. |
| NFR-07.3 | The frontend shall auto-detect the backend IP from the Expo dev server — no manual configuration needed. |
| NFR-07.4 | The app shall work on physical Android devices connected to the same LAN as the development machine. |
