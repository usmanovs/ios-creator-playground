
# App Store Outcome Section

Add a new section right after the Hero that visually proves the promise: by day 15, the student's app is live on the App Store — shown as a realistic iPhone displaying an App Store product page.

## Layout

Two-column on desktop, stacked on mobile.

```text
┌───────────────────────────────┬──────────────────────────────┐
│                               │  DAY 15 · THE FINISH LINE    │
│     ┌───────────────┐         │                              │
│     │  ▓ iPhone ▓   │         │  Your app.                   │
│     │ ┌───────────┐ │         │  Live on the App Store.      │
│     │ │ 9:41  ▮▮▮ │ │         │                              │
│     │ │           │ │         │  ✓ Shipped via App Store     │
│     │ │  [icon]   │ │         │    Connect                   │
│     │ │  AppName  │ │         │  ✓ Passed Apple review       │
│     │ │  Dev · GET│ │         │  ✓ Reachable by 1.8B users   │
│     │ │  ★★★★★4.8 │ │         │  ✓ Ready to earn revenue     │
│     │ │ [scr][scr]│ │         │                              │
│     │ │ What's New│ │         │                              │
│     │ └───────────┘ │         │                              │
│     └───────────────┘         │                              │
└───────────────────────────────┴──────────────────────────────┘
```

## iPhone mockup (CSS-built)

- Outer frame: dark bezel, rounded ~3rem, subtle violet glow shadow, gentle float animation
- Dynamic Island at top
- Screen contents (light iOS App Store theme — scoped exception to the dark theme, since App Store is iconic in light mode):
  - Status bar: 9:41 · signal · wifi · battery
  - App header row: rounded app icon (gradient tile with SF-style glyph), app name "HabitFlow", developer "Force Academy", green "GET" pill
  - Rating strip: ★★★★★ · 4.8 · 1.2K Ratings · #12 Productivity
  - Horizontal screenshot carousel: 3 vertical mini phone screens (CSS-built, no AI images — cleaner, faster, always on-brand)
  - "What's New" block with version + short changelog
  - "Ratings & Reviews" preview with one review card

Using pure CSS for in-phone screenshots (instead of generated images) keeps it crisp on any DPR, avoids off-brand AI artifacts, and loads instantly.

## Right column copy

- Eyebrow: "Day 15 · The finish line" (violet, uppercase, tracked)
- Headline: "Your app. Live on the **App Store**." (gradient on "App Store")
- Subtitle: one line about shipping a real product, not a demo
- 4 checkmark rows (green check icon + label):
  1. Shipped via App Store Connect
  2. Passed Apple review
  3. Reachable by 1.8B iPhone users
  4. Ready to earn revenue

## Files

- **NEW** `src/components/AppStoreSection.tsx`
- **EDIT** `src/contexts/LanguageContext.tsx` — add `as.*` i18n keys (EN + RU) for eyebrow, title, subtitle, 4 checks, appName, appDev, GET, ratings, whatsNew, review text
- **EDIT** `src/pages/Index.tsx` — mount `<AppStoreSection />` immediately after `<HeroSection />`

## Design tokens

- Uses existing `glass-card`, `gradient-text`, `gradient-violet`, `shadow-glow-violet`, `animate-float`, `animate-fade-in` from index.css
- No new tokens needed
- In-phone light UI uses literal light colors (scoped inside the phone frame only)
