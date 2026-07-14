## Goal

Make lessons in the course page (`/course/:courseId`) more visually distinct from each other, instead of the current flat list of near-identical rows.

## Changes (in `src/pages/Course.tsx`)

Redesign each lesson row inside a chapter card so items feel like discrete cards rather than a bare list:

- **Numbered index badge** on the left: a rounded square (e.g. `w-9 h-9 rounded-lg`) with the lesson number (1, 2, 3…) in the display font, primary-tinted background (`bg-primary/10 text-primary`, border `border-primary/20`).
- **Lesson type icon** next to the title (Play icon for `video`, FileText for `text`, HelpCircle for `quiz`) so different lesson kinds are instantly distinguishable.
- **Two-line layout**: title on top (medium weight), small muted subtitle beneath showing the lesson type label (e.g. "Video lesson", "Reading").
- **Card treatment per lesson**: subtle bordered surface (`border border-border/40 bg-card/20`), rounded-xl, with clear separation via `space-y-3` between rows.
- **Hover state**: lift with `hover:border-primary/40 hover:bg-card/40`, chevron slides right (`group-hover:translate-x-0.5`), and the number badge brightens.
- **Divider between chapters** stays as-is (chapters are already in glass cards).

No changes to data fetching, admin, or other pages. Purely presentational.

## Result

Each lesson becomes a scannable card with a number, type icon, title, and type label — making the sequence and the kind of each lesson obvious at a glance.