## Plan: Emphasize the Live Sessions early-bird discount in the hero section

### Goal
Make the big discount for the Live Sessions plan impossible to miss in the hero by showing the savings message in three places: the badge, a new banner under the headline, and the CTA button.

### What will change

1. **Hero badge**
   - Keep the existing pulsing accent dot and glass-pill style.
   - Change the text from the generic tagline to a savings-focused message, e.g.:
     - EN: "Save $149 — Early Bird Live Sessions"
     - RU: "Экономия $149 — Живые Занятия Early Bird"

2. **New discount banner below the headline**
   - Insert a prominent banner between the subtitle block and the social-proof row.
   - Show the crossed-out full price and the discounted price:
     - EN: "$399 → $250 — enroll now and save $149 on Live Sessions"
     - RU: "$399 → $250 — запишись сейчас и сэкономь $149 на Живых Занятиях"
   - Style it with the existing accent color and a subtle glow/shimmer so it reads as urgent.

3. **CTA button**
   - Update the button text from "Enroll Now — $399" to:
     - EN: "Enroll Now — $250 (was $399)"
     - RU: "Записаться — $250 (вместо $399)"
   - Add a short savings line directly under the button:
     - EN: "Save $149 · Limited early-bird spots"
     - RU: "Экономия $149 · Ограниченные места Early Bird"

4. **Translations**
   - Add new keys to `LanguageContext.tsx` for the updated badge, banner, CTA, and subtext in both English and Russian.
   - Keep the existing keys that are not changing.

5. **Verification**
   - Run `bun run build` to confirm no TypeScript or build errors.

### Files to edit
- `src/components/HeroSection.tsx`
- `src/contexts/LanguageContext.tsx`

### Out of scope
- No changes to pricing logic or payment flow.
- No changes to the pricing section further down the page.