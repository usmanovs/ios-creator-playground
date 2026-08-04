# Retro KPI Strip — Tie KPIs to the Retro Items

## Problem
The current KPI strip shows abstract metrics (Total notes, Win rate %, Balance %) that read as generic dashboards rather than as a live readout of the two retro columns ("What went well" / "What to improve").

## Goal
Make the KPI strip visibly mirror the two columns so it is obvious each KPI maps to the retro notes below.

## Change
Replace the current three-card KPI strip in `src/pages/Retro.tsx` with a strip that has exactly two KPI cards — one per column — plus a split bar visualizing their proportion:

```text
┌──────────────┐  ┌──────────────┐
│  ✦ Wins      │  │  ✦ Improves   │
│   4          │  │   6          │
│  What went   │  │  What to      │
│   well       │  │   improve     │
└──────────────┘  └──────────────┘
┌──────────────────────────────────┐
│ well ▓▓▓▓░░░░░░  improve  40/60 │
└──────────────────────────────────┘
```

### Details
- **Two KPI cards** (replacing the three):
  - "Wins" card — accent/blue styling, shows `well.length`, label "What went well". Clicking a card is out of scope; it stays informational.
  - "Improves" card — amber styling, shows `improve.length`, label "What to improve".
- **One split bar** below the two cards: a single horizontal bar split into a blue segment (well) and an amber segment (improve), proportional to their counts. Right side shows `well/improve` counts (e.g. `4/6`). When total is 0, show an empty muted bar.
- Remove the `StickyNote`, `Scale` icon imports if unused; keep `ThumbsUp` and `Lightbulb` for the two cards.
- Drop the `winRate` and `balance` fields from the `useMemo` `stats`; keep only what the new UI needs (well count, improve count, total). Keep `useMemo` for cleanliness.
- No backend or data model changes — everything stays local state.

## Files
- `src/pages/Retro.tsx` — update `stats` memo (lines ~108-116) and the KPI strip JSX (lines ~148-191).

## Verification
- Dev server renders `/retro` with two KPI cards + a split bar.
- Adding/removing a note in either column updates the counts and the bar proportions live.
