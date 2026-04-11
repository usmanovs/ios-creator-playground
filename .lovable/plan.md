

# Add App Store Support URL Page

## What
Create a `/support` page that serves as the Support URL for your App Store listing. Apple requires a support URL during app submission — this page will provide contact info and basic support details.

## Implementation

1. **Create `src/pages/Support.tsx`** — A clean, simple support page with:
   - App name and brief description
   - Contact email / WhatsApp link (reusing existing channels)
   - FAQ-style common questions (optional)
   - Links to Telegram/Instagram
   - Professional, minimal design matching the existing dark theme

2. **Update `src/App.tsx`** — Add route: `<Route path="/support" element={<Support />} />`

## Result
Your Support URL for the App Store listing will be:
**`https://ios-creator-playground.lovable.app/support`**

