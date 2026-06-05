# Deployment & Maintenance Plan
## SwiftDispatch

---

## 1. Environments

| Environment | Purpose | Backend URL | Database |
|-------------|---------|-------------|----------|
| **Local (Dev)** | Active development | `http://localhost:4000` | MongoDB Atlas (shared dev cluster) |
| **Staging** | Pre-release testing | `https://staging-api.swiftdispatch.app` | MongoDB Atlas (staging cluster) |
| **Production** | Live users | `https://api.swiftdispatch.app` | MongoDB Atlas (M10 production cluster) |

---

## 2. Backend Deployment

### Platform: Railway.app (Recommended)

Railway supports Node.js natively, auto-deploys from GitHub, and provides a free tier for prototyping.

**Initial Setup (one-time):**
1. Go to https://railway.app and sign up with GitHub.
2. Click **New Project → Deploy from GitHub Repo**.
3. Select `betanaijaboi/SwiftDispatch`.
4. Set the **Root Directory** to `SwiftDispatch/backend`.
5. Set the **Start Command** to `npm start`.
6. Add environment variables under **Variables**:

```
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=https://your-expo-app-url
```

7. Railway will assign a URL like `https://swiftdispatch-backend.up.railway.app`.
8. Update `CLIENT_URL` to match your Expo production URL.

**Subsequent Deployments:**
- Every push to the `main` branch on GitHub automatically triggers a new Railway deployment.
- No manual steps required.

### Alternative: Render.com

1. Go to https://render.com → **New Web Service**.
2. Connect GitHub repo, root dir = `SwiftDispatch/backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables in the Render dashboard.

---

## 3. Frontend Deployment

### Phase 1–2: Expo Go (Development)

Developers and testers run the app directly via Expo Go:
```bash
cd SwiftDispatch/app
npx expo start
```
No build step required. Testers scan the QR code.

### Phase 3: Production Build via EAS (Expo Application Services)

**Install EAS CLI:**
```bash
npm install -g eas-cli
eas login
```

**Configure EAS:**
```bash
cd SwiftDispatch/app
eas build:configure
```

This creates an `eas.json` file. A basic configuration:

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }
    },
    "production": {
      "android": { "buildType": "app-bundle" },
      "ios": { "simulator": false }
    }
  }
}
```

**Build Android APK (for internal testing):**
```bash
eas build --platform android --profile preview
```

**Build Production App Bundle (for Play Store):**
```bash
eas build --platform android --profile production
```

**Submit to Google Play Store:**
```bash
eas submit --platform android
```

**Over-the-Air (OTA) Updates (after initial install):**
```bash
eas update --branch production --message "Fix booking flow"
```
Users get the update on next app open — no store re-submission needed for JS-only changes.

---

## 4. Environment Variables Reference

### Backend `.env`

```env
# Server
PORT=4000

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>?retryWrites=true&w=majority

# Auth
JWT_SECRET=replace_with_minimum_32_char_random_string
JWT_EXPIRES_IN=30d

# CORS
CLIENT_URL=https://your-expo-or-frontend-url
```

**How to generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 5. CI/CD Pipeline (Phase 2)

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Backend

on:
  push:
    branches: [main]
    paths:
      - 'SwiftDispatch/backend/**'

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd SwiftDispatch/backend && npm install
      - run: cd SwiftDispatch/backend && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Railway
        run: |
          curl -X POST ${{ secrets.RAILWAY_DEPLOY_WEBHOOK }}
```

**Flow:**
```
Push to main
    │
    ▼
GitHub Actions triggers
    │
    ▼
Run tests (npm test)
    │
    ├──[Tests pass]───────────────────────────────────────┐
    │                                                     │
    ├──[Tests fail]                                       ▼
    │    └──→ Deployment blocked                Railway auto-deploy
    │         Slack/email alert                 (from GitHub webhook)
    │                                                     │
    └─────────────────────────────────────────────────────▼
                                              Live backend updated
```

---

## 6. Database Management

### Backups (MongoDB Atlas)

| Cluster Tier | Backup Type | Retention |
|-------------|-------------|-----------|
| M0 (Free) | No automated backups | Manual export only |
| M10 (Production) | Continuous backup | 1 day point-in-time |
| M20+ | Continuous backup | Up to 7 days |

**Manual export (M0 fallback):**
```bash
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/swiftdispatch" --out ./backup
```

**Restore:**
```bash
mongorestore --uri "mongodb+srv://user:pass@cluster.mongodb.net/swiftdispatch" ./backup/swiftdispatch
```

### Database Indexes (apply in Atlas or via Mongoose)

```js
// Apply on startup in src/index.js
await User.createIndexes();
await Order.createIndexes();
```

Defined in Mongoose schemas:
```js
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ isOnline: 1 });
OrderSchema.index({ customerId: 1 });
OrderSchema.index({ riderId: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });
```

---

## 7. Monitoring

### Phase 2+: Recommended Tools

| Tool | Purpose | Free Tier |
|------|---------|-----------|
| **UptimeRobot** | Backend uptime monitoring | ✅ 50 monitors |
| **Railway Metrics** | CPU, memory, response times | ✅ Built-in |
| **Sentry** | Error tracking (app crashes + API errors) | ✅ 5k events/month |
| **MongoDB Atlas Monitoring** | Query performance, slow queries | ✅ Built-in |
| **LogDNA / Logtail** | Centralised log streaming | ✅ Free tier |

**Set up UptimeRobot:**
1. Add a HTTP(s) monitor for `https://api.swiftdispatch.app/api/auth/me`.
2. Set check interval: every 5 minutes.
3. Add email + WhatsApp alert contact.

---

## 8. Maintenance Schedule

| Task | Frequency | Responsibility |
|------|-----------|----------------|
| `npm audit` — check for vulnerabilities | Weekly | Developer |
| Update dependencies to latest patch versions | Monthly | Developer |
| Review MongoDB Atlas slow query log | Weekly | Developer |
| Review error logs (Sentry) | Daily | Developer/Ops |
| Backup verification (restore test) | Monthly | Developer |
| Security review of new endpoints | Per PR | Developer |
| Check UptimeRobot alerts | Daily (automated) | Automated |
| Review and respond to user reviews (Play Store) | Weekly | Product |

---

## 9. Rollback Procedure

### Backend Rollback (Railway)

1. Go to Railway dashboard → Deployments.
2. Find the last working deployment.
3. Click **Redeploy** on that version.
4. Takes ~2 minutes to go live.

### Frontend Rollback (EAS OTA)

```bash
# Roll back to previous OTA update
eas update --branch production --message "Rollback to previous version" --republish
```

### Database Rollback (M10+)

1. Go to MongoDB Atlas → Backup.
2. Select a point-in-time before the issue occurred.
3. Restore to a new cluster.
4. Update `MONGODB_URI` in backend environment variables.
5. Redeploy backend.

---

## 10. Launch Checklist

Before going live:

- [ ] Backend deployed to Railway/Render with production environment variables
- [ ] MongoDB Atlas upgraded to M10 (automated backups enabled)
- [ ] UptimeRobot monitoring configured with alert contacts
- [ ] Sentry error tracking integrated in both app and backend
- [ ] All `.env` secrets are strong, unique, and not in version control
- [ ] Google Maps API key added and billing alerts set
- [ ] CORS configured to allow only the production app URL
- [ ] Rate limiting enabled on auth endpoints
- [ ] EAS production build submitted to Google Play Store
- [ ] Privacy policy page live (required for Play Store)
- [ ] Support email and WhatsApp number operational
- [ ] Final E2E test completed on production environment
- [ ] All P0 (Critical) and P1 (High) bugs resolved
