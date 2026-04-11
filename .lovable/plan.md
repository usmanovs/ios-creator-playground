

# iOS Vibe Coding Program Website

## Overview
Build a bilingual (Russian/English) landing page for an iOS vibe coding program, closely mirroring the structure and design of ai.getforce.dev but adapted for iOS app development.

## Key Details
- **Program**: iOS Vibe Coding (building iOS apps with AI)
- **Price**: $350
- **Start Date**: May 1, 2026
- **Instructor**: Seyitbek Usmanov
- **Promise**: Build an app that earns $10,000/month
- **Target**: Anyone who wants to build an iOS app using AI
- **Channels**: WhatsApp (same number: +1 202 455 4575), Telegram, Instagram

## Sections to Build

1. **Hero** -- Headline promise ($10,000/month), countdown timer to May 1, enroll CTA, student count badge, key stats (start date, goal, instructor, demo day ~May 14)
2. **Language Switcher** -- Toggle between Russian and English in the navbar
3. **Instructor Section** -- Seyitbek Usmanov bio card (placeholder photo, editable bio text)
4. **What is Vibe Coder** -- Traditional coder vs Vibe Coder comparison, 4 feature cards
5. **What You'll Get** -- 4 value props (build in 15 days, $10K goal, community, expert guidance)
6. **Curriculum** -- Adapted for iOS: Day 1-2 (AI tools + Xcode basics), Day 3-5 (SwiftUI with AI), Day 6-8 (Backend/Supabase/Auth), Day 9-11 (App development & MVP), Day 12-14 (App Store launch & monetization)
7. **Schedule** -- Live sessions 3x/week with timezone display
8. **Pricing** -- Single tier at $350, Mbank QR + Visa/Mastercard options, WhatsApp confirmation flow
9. **CTA Banner** -- Sticky bottom bar with countdown + enroll button
10. **Community Footer** -- Telegram + Instagram links, WhatsApp contact button

## Technical Approach

- **i18n**: Create a React context with `useLanguage` hook storing `'en' | 'ru'` in state; translation object with all strings
- **Countdown Timer**: Custom hook calculating days/hours/minutes/seconds to May 1, 2026
- **Components**: ~10 section components in `src/components/` plus shared LanguageContext
- **Styling**: Tailwind CSS, dark theme with gradient accents (similar to original purple/blue gradients)
- **Animations**: Subtle fade-in on scroll using Intersection Observer
- **Routing**: Single page (Index.tsx), no additional routes needed

## Files to Create/Modify
- `src/contexts/LanguageContext.tsx` -- i18n context + translations
- `src/hooks/useCountdown.ts` -- countdown timer hook
- `src/components/Navbar.tsx` -- nav with language switcher
- `src/components/HeroSection.tsx`
- `src/components/InstructorSection.tsx`
- `src/components/VibCoderSection.tsx`
- `src/components/CurriculumSection.tsx`
- `src/components/PricingSection.tsx`
- `src/components/ScheduleSection.tsx`
- `src/components/FooterSection.tsx`
- `src/components/StickyCtaBar.tsx`
- `src/pages/Index.tsx` -- compose all sections
- `src/index.css` -- dark theme custom styles

