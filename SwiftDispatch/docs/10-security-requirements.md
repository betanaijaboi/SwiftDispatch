# Security Requirements
## SwiftDispatch

---

## SR-01: Authentication

| ID | Requirement |
|----|-------------|
| SR-01.1 | All passwords shall be hashed using bcrypt with a minimum cost factor of 10 before storage. Plaintext passwords shall never be stored or logged. |
| SR-01.2 | Authentication tokens shall be JSON Web Tokens (JWT) signed with HS256 using a secret key of at least 32 characters. |
| SR-01.3 | JWT tokens shall expire after 30 days. Expired tokens shall be rejected with a 401 response. |
| SR-01.4 | The JWT secret shall be loaded from environment variables only. It shall never be committed to version control. |
| SR-01.5 | All protected API routes shall validate the JWT token on every request before processing. |
| SR-01.6 | Failed login attempts shall return a generic "Invalid email or password" message — the system shall not reveal whether the email exists. |

---

## SR-02: Authorisation

| ID | Requirement |
|----|-------------|
| SR-02.1 | Role-based access control (RBAC) shall be enforced at the API route level. |
| SR-02.2 | Customer-only routes (e.g., `/orders`, `/orders/:id/cancel`) shall reject requests from riders with a 403 response. |
| SR-02.3 | Rider-only routes (e.g., `/riders/status`, `/riders/orders/:id/accept`) shall reject requests from customers with a 403 response. |
| SR-02.4 | A customer shall only be able to access their own orders. Attempting to access another customer's order shall return 403. |
| SR-02.5 | A rider shall only be able to update the status of an order they are assigned to. |
| SR-02.6 | Admin functions (user management, platform config) shall be accessible only to users with `role: 'admin'`. |

---

## SR-03: Data Transmission

| ID | Requirement |
|----|-------------|
| SR-03.1 | All API traffic in production shall use HTTPS (TLS 1.2 minimum, TLS 1.3 preferred). |
| SR-03.2 | All Socket.io connections in production shall use WSS (WebSocket Secure). |
| SR-03.3 | CORS shall be configured to allow only the known frontend origin(s). Wildcard `*` origins shall not be permitted in production. |
| SR-03.4 | All API responses shall include appropriate security headers (X-Content-Type-Options, X-Frame-Options). |

---

## SR-04: Input Validation & Injection Prevention

| ID | Requirement |
|----|-------------|
| SR-04.1 | All user-supplied input shall be validated on the server side before processing. |
| SR-04.2 | Mongoose schema validation shall enforce field types, required fields, and enum constraints. |
| SR-04.3 | MongoDB queries shall use Mongoose's parameterised query methods — raw string interpolation into queries shall not be used. |
| SR-04.4 | The `email` field shall be normalised to lowercase before storage and querying. |
| SR-04.5 | API endpoints shall reject payloads that exceed 1 MB in size (Express `body-parser` limit). |
| SR-04.6 | No user-supplied data shall be executed as code (no `eval()`, no dynamic `require()`). |

---

## SR-05: Secrets Management

| ID | Requirement |
|----|-------------|
| SR-05.1 | All secrets (JWT secret, MongoDB URI, API keys) shall be stored in environment variables. |
| SR-05.2 | A `.env` file shall never be committed to version control. The `.gitignore` shall explicitly exclude `.env`. |
| SR-05.3 | A `.env.example` file (with placeholder values only) shall be committed to guide developers. |
| SR-05.4 | In production, secrets shall be injected via the hosting platform's environment variable interface (e.g., Railway, Render), not via files. |

---

## SR-06: Rate Limiting (Phase 2)

| ID | Requirement |
|----|-------------|
| SR-06.1 | The `/auth/login` and `/auth/register` endpoints shall be rate-limited to 10 requests per IP per minute. |
| SR-06.2 | All other API endpoints shall be rate-limited to 100 requests per IP per minute. |
| SR-06.3 | Rate limit responses shall return HTTP 429 with a `Retry-After` header. |

---

## SR-07: Data Privacy

| ID | Requirement |
|----|-------------|
| SR-07.1 | User passwords shall never be returned in any API response. Mongoose `select: false` shall be applied to the `password` field. |
| SR-07.2 | User phone numbers shall only be visible to admins and the user themselves — not exposed in public order responses. |
| SR-07.3 | Rider GPS coordinates shall only be broadcast to the customer of the active order — not to all connected clients. |
| SR-07.4 | The app shall request location permission from the user before accessing GPS data. Location access shall be used only for delivery functionality. |

---

## SR-08: Backup & Recovery

| ID | Requirement |
|----|-------------|
| SR-08.1 | MongoDB Atlas shall be used for all production data. Atlas provides automated backups and point-in-time recovery (available on M10+ clusters). |
| SR-08.2 | The production database shall be backed up at least daily. |
| SR-08.3 | A recovery procedure shall be documented and tested before public launch. |
| SR-08.4 | The `.env` file (containing MongoDB credentials) shall be securely backed up outside the codebase. |

---

## SR-09: Dependency Security

| ID | Requirement |
|----|-------------|
| SR-09.1 | npm dependencies shall be audited regularly using `npm audit`. |
| SR-09.2 | Dependencies with known critical vulnerabilities shall be updated or replaced before production deployment. |
| SR-09.3 | The `package-lock.json` file shall be committed to lock dependency versions. |
