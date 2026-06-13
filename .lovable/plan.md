## Redesign plan — Aurora Glass Flow

Locked taste: bg `#1a1a2e`, surface `#16213e`, green `#4ade80`, violet `#a78bfa`. Space Grotesk headings, DM Sans body. Full-width stacked sections, ample padding (py-32), large rounded glass cards (rounded-[2.5–3rem]), restrained motion (aurora drift, scroll fades).

### 1. Design tokens
- Update `src/index.css`: set background, foreground, primary (violet), accent (green), surface tokens, and add `--gradient-aurora`, `--shadow-glow-violet`, `--shadow-glow-green` matching the prototype. Replace existing purple-blue tokens.
- Update `tailwind.config.ts`: add `fontFamily.display: ['Space Grotesk']`, `fontFamily.sans: ['DM Sans']`, keep semantic color refs. Add `aurora-drift` keyframe (slow translate of blurred blobs).
- Add Google Fonts link to `index.html` for Space Grotesk + DM Sans.
- Add a global fixed Aurora background layer (two blurred blobs, violet top-left, green bottom-right) mounted once in `src/pages/Index.tsx`.

### 2. Section-by-section refactor (keep all i18n keys, only restyle)
- **HeroSection**: full-viewport centered layout. Live pulse badge, 8xl gradient headline with violet→green clip, countdown with thin separators, large violet→indigo gradient CTA with soft glow, social-proof line under it.
- **InstructorSection**: single large `rounded-[3rem]` glass card, portrait wrapped in violet→green halo, "Твой наставник" green eyebrow, 3-stat row with hairline dividers.
- **VibCoderSection**: two big cards side-by-side — "Traditional" muted/desaturated, "Vibe Coder" green-accent gradient card with subtle green glow shadow. Feature cards below: 4-up grid, restyled to match new glass card look (no more thin glass-card).
- **WhatYouGetSection**: 4-up grid using the new glass card with hover violet border.
- **CurriculumSection**: vertical timeline — numbered round node + hairline rail + glass card per chapter, alternating green/violet number color.
- **ScheduleSection**: single glass card, icon list with hairline rows.
- **PricingSection** (preserve QR + WhatsApp + Visa logic unchanged): restyle two tier cards to match prototype — recordings = muted glass, live = gradient with violet border + green glow + violet "Самый популярный" pill. Keep all dynamic price, savings, QR, buttons.
- **StickyCtaBar / Navbar**: restyled with `backdrop-blur-xl bg-[#1a1a2e]/70`, violet primary button.
- **FooterSection**: simple uppercase nav links + small copyright row, top hairline border.

### 3. Reusable primitives
Add `src/components/ui/glass-card.tsx` — `rounded-[2.5rem] bg-surface/40 border border-white/10 backdrop-blur-xl` with hover variants (`violet`, `green`). Use across sections so future tweaks happen in one place.

### 4. Cleanup
- Remove old purple/blue gradient utilities and stray `from-purple-* via-blue-*` literals.
- Replace hardcoded white/black colors with semantic tokens (per design-system rule).
- Keep all existing copy, bilingual keys, prices ($299 / $399), Mbank/WhatsApp flow, and routes intact.

### Out of scope
- No new sections, no new features, no payment changes, no copy changes beyond what's already in `LanguageContext`.

### Verification
Visual check via preview at 1440 desktop after build; spot-check mobile breakpoints for hero, pricing, curriculum timeline.