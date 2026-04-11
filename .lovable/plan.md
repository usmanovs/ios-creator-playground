

# Create App Store Marketing Page

## What
Create a marketing page at `/marketing` for your classic games iOS app, to be used as the App Store Marketing URL: **https://ios.getforce.org/marketing**

## App Details
- **App**: Classic Games collection (Pacman, Hangman, Snake, Tetris)
- **Tagline**: "Rediscover the games you grew up with — now in your pocket."

## Implementation

1. **Create `src/pages/Marketing.tsx`** — A polished marketing page with:
   - App name + hero section with tagline
   - Game showcase (4 cards for Pacman, Hangman, Snake, Tetris with icons)
   - Features list (4 games in one, simple controls, lightweight, quick play)
   - Call-to-action (App Store download button/badge)
   - Clean dark theme matching the existing site

2. **Update `src/App.tsx`** — Add route: `<Route path="/marketing" element={<Marketing />} />`

## Result
**Marketing URL**: `https://ios.getforce.org/marketing`

