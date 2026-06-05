# Design System & Style Guide
## SwiftDispatch

---

## Brand Identity

**App Name:** SwiftDispatch  
**Tagline:** "Deliveries, done fast."  
**Brand Personality:** Reliable, energetic, modern, trustworthy  
**Target Feel:** Professional but approachable — like Bolt or Uber but built for Lagos

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Primary (Amber) | `#F59332` | Buttons, active states, highlights, CTAs |
| Primary Dark | `#D97706` | Pressed button states, icons on light bg |
| Primary Light | `#FCD34D` | Subtle accents |
| Primary Background | `#FFF8EE` | Tinted backgrounds, active card fills |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| Secondary (Charcoal) | `#111827` | Rider dashboard bg, dark panels |
| Background | `#F9FAFB` | App background, screen bg |
| Surface | `#FFFFFF` | Cards, modals, sheets |
| Surface Alt | `#F3F4F6` | Input backgrounds, icon backgrounds |
| Border | `#E5E7EB` | Dividers, input borders |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success | `#16A34A` | Delivered status, online indicator, positive amounts |
| Success Light | `#DCFCE7` | Success badge background |
| Error | `#DC2626` | Errors, decline button, cancelled status |
| Error Light | `#FEE2E2` | Error badge background, logout button |
| Warning | `#D97706` | Caution states |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| Text (Primary) | `#111827` | Headings, body text |
| Text Secondary | `#6B7280` | Subtext, labels |
| Text Light | `#9CA3AF` | Placeholder, disabled, timestamps |
| Text White | `#FFFFFF` | Text on dark backgrounds |

---

## Typography

**Font Family:** System default (San Francisco on iOS, Roboto on Android)

| Scale Name | Size | Weight | Line Height | Usage |
|-----------|------|--------|-------------|-------|
| `xxxl` | 32px | ExtraBold (800) | 40px | Large screen titles |
| `xxl` | 26px | ExtraBold (800) | 34px | Screen headers |
| `xl` | 22px | Bold (700) | 30px | Section headers, prices |
| `lg` | 18px | Bold (700) | 26px | Card titles |
| `md` | 16px | Medium (500) | 24px | Body text, menu items |
| `sm` | 14px | SemiBold (600) | 22px | Labels, buttons |
| `xs` | 12px | Medium (500) | 18px | Captions, timestamps, badges |

### Font Weights

| Name | Value |
|------|-------|
| `regular` | 400 |
| `medium` | 500 |
| `semibold` | 600 |
| `bold` | 700 |
| `extrabold` | 800 |

---

## Spacing System

Based on a 4px grid.

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | 4px | Icon gaps, tiny padding |
| `sm` | 8px | Component internal padding |
| `md` | 16px | Standard section padding |
| `lg` | 20px | Card padding, section gaps |
| `xl` | 24px | Screen horizontal padding |
| `xxl` | 32px | Large section separators |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `sm` | 6px | Small pills, tags |
| `md` | 10px | Input fields, small cards |
| `lg` | 14px | Standard cards |
| `xl` | 20px | Large cards, modals |
| `xxl` | 28px | Bottom sheets |
| `full` | 9999px | Pill badges, avatar circles |

---

## Shadow System

| Token | Elevation | Usage |
|-------|-----------|-------|
| `sm` | 1–2 | Subtle card lift |
| `md` | 3–4 | Floating buttons, map overlays |
| `lg` | 6–8 | Bottom sheets, modals |

```js
Shadow.sm = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
}
Shadow.md = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 4,
}
Shadow.lg = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 8,
  elevation: 8,
}
```

---

## Iconography

**Library:** `@expo/vector-icons` — Ionicons set  
**Principle:** No emoji icons anywhere in the app. All icons must be Ionicons vector icons.

### Icon Size Standards

| Context | Size |
|---------|------|
| Tab bar | 24px |
| Navigation headers | 22px |
| Inline with text | 14–16px |
| Card icons | 18–22px |
| Avatar / feature icons | 26–32px |
| Empty state icons | 48px |

### Key Icon Mappings

| Purpose | Icon Name |
|---------|-----------|
| Home | `home` / `home-outline` |
| Orders | `cube` / `cube-outline` |
| Notifications | `notifications` / `notifications-outline` |
| Profile | `person` / `person-circle` |
| Earnings | `wallet` / `wallet-outline` |
| History | `receipt` / `receipt-outline` |
| Map/Dashboard | `map` / `map-outline` |
| Search | `search-outline` |
| Back | `chevron-back` |
| Forward arrow | `chevron-forward` |
| Add | `add` |
| Close | `close` |
| Confirm/Accept | `checkmark` / `checkmark-circle` |
| Logout | `log-out-outline` |
| Settings | `settings-outline` |
| Location pin | `location-sharp` |
| Phone | `call-outline` |
| Email | `mail-outline` |
| Password | `lock-closed-outline` |
| Bike (vehicle) | `bicycle` |
| Car (vehicle) | `car-outline` |
| Van (vehicle) | `bus-outline` |
| Flash/Express | `flash` |
| Star/Rating | `star` |
| Trophy/Tier | `trophy-outline` |
| Time | `time-outline` |
| Distance | `resize-outline` |
| Package | `cube-outline` |
| Share | `share-outline` |
| Edit | `pencil` |
| Card payment | `card-outline` |
| Cash payment | `cash-outline` |
| Document | `document-text-outline` |
| Chat | `chatbubble-outline` |

---

## Components

### Button

```
┌─────────────────────────────────┐
│          Sign In                │   ← Primary Button
└─────────────────────────────────┘
Background: #F59332  |  Text: #FFFFFF  |  Height: 52px
BorderRadius: 14px  |  Font: 16px SemiBold

┌─────────────────────────────────┐
│          Continue               │   ← Loading state
│     ○  (activity indicator)     │
└─────────────────────────────────┘

States: default | loading | disabled (opacity 0.6)
```

### Input

```
Label text
┌─────────────────────────────────────┐
│ 🔒  Enter your password        👁   │
└─────────────────────────────────────┘
Error text in red below

Background: #F3F4F6  |  BorderRadius: 10px  |  Height: 52px
Border: 1px #E5E7EB (default) | 1px #F59332 (focused) | 1px #DC2626 (error)
```

### Status Badge

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│ Pending  │  │ Delivered│  │Cancelled │
└──────────┘  └──────────┘  └──────────┘
Yellow bg     Green bg       Red bg
```

### Card

```
┌─────────────────────────────────────┐
│ [Icon]  ORD-1001          [Badge]   │
│         14 Jun, 2:34 PM             │
│                                     │
│ ● Pickup address                    │
│ ● Dropoff address                   │
│                                     │
│ ₦1,850         ⭐ 5.0    Track >  │
└─────────────────────────────────────┘
Shadow.sm  |  BorderRadius: 14px  |  Padding: 16px
```

---

## Screen Layout Patterns

### Map Screen (Customer Home / Rider Dashboard)

```
┌─────────────────────────────────────┐
│  SafeAreaView overlay (zIndex: 10)  │
│  ┌──────────────────────────────┐   │
│  │  Top card (greeting/status)  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Search bar / active order   │   │
│  └──────────────────────────────┘   │
│                                     │
│  [FULL-SCREEN MAP HERE]             │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  ────  (drag handle)         │   │  ← Draggable bottom sheet
│  │  Bottom sheet content        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

### List Screen (Orders / Notifications)

```
┌─────────────────────────────────────┐
│  Header (title + action button)     │
│  ┌──────────────────────────────┐   │
│  │  Tab bar (Active | History)  │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Card 1                      │   │
│  └──────────────────────────────┘   │
│  ┌──────────────────────────────┐   │
│  │  Card 2                      │   │
│  └──────────────────────────────┘   │
│  ...                                │
└─────────────────────────────────────┘
```

---

## Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use Ionicons for all icons | Use emoji as icons anywhere in the UI |
| Use `Colors.primary` (#F59332) for CTAs | Use raw hex values in components |
| Use `Shadow.sm/md/lg` for elevation | Use platform-specific shadow styles directly |
| Wrap screens in `SafeAreaView` | Use regular `View` for top-level screens |
| Use `numberOfLines` on text that may overflow | Let text clip without warning |
| Use `Spacing.md` (16px) as default padding | Use arbitrary numbers like 15, 17 |
