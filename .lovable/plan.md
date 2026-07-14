## Plan: Subtle lesson row borders

The lesson row currently has a visible white-ish border (`border border-border/40`) that stands out too much on the dark background. Make it less prominent while keeping the row structure.

### Changes
1. In `src/pages/Course.tsx`, update the lesson `Link` styling:
   - Reduce border opacity from `border-border/40` to `border-border/20` (or `border-border/15`) so it reads as a hairline rather than a frame.
   - Lower the hover border opacity to match, e.g. `hover:border-border/30` or `hover:border-primary/20`.
   - Keep the background (`bg-card/20`), hover lift (`hover:bg-card/40`), number badge, icon, and chevron interactions unchanged.

2. Optionally, if the border still dominates, remove it entirely and use a slightly stronger background (`bg-card/40`) or an inner `ring-1 ring-border/10` to separate rows.

### Files to change
- `src/pages/Course.tsx` (the lesson row `Link` on line 76).

### Verification
- Preview the `/course/:courseId` route and confirm the lesson rows blend more naturally into the dark page while still being distinguishable.