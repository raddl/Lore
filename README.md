# Lore. — Demo

A standalone, deployable demo of the Lore. fandom companion app.

## What's in this folder

- `index.html` — the entry page (loads React, Tailwind, Lucide via CDN)
- `app.js` — the full application (~3,400 lines, JSX compiled in-browser via Babel)

That's it. No build step. No `npm install`. Just static files.

## Quickest deploy: Netlify Drop (60 seconds, no account)

1. Go to https://app.netlify.com/drop
2. Drag this entire `lore-demo` folder onto the page
3. Done. Netlify gives you a public URL like `https://random-name-12345.netlify.app`

Optional: claim the site (free Netlify account) to keep the URL permanently and customize it.

## Alternative: Vercel (1 minute, free tier)

If you have a Vercel account:
1. `cd` into this folder
2. `npx vercel` (it will walk you through deploying)
3. You get a URL like `https://lore-demo.vercel.app`

## Alternative: GitHub Pages

1. Create a public GitHub repo
2. Drop these two files in
3. Settings → Pages → Source = main branch
4. URL: `https://yourusername.github.io/repo-name`

## Alternative: just open it locally

Most modern browsers will run it from the file system, but some block CDN scripts on `file://`. If you hit issues, run a tiny local server:

```bash
cd lore-demo
python3 -m http.server 8000
# open http://localhost:8000
```

## Browser support

- **Chrome / Edge / Safari (latest):** full support, including voice recognition
- **Firefox:** works visually, but voice input isn't supported by Firefox (Web Speech API limitation)

The app gracefully detects this and lets users type instead.

## What works in this demo

✅ All UI: home screen, episode picker, community feed, reviews, lists, profile pages, vault/diary, activity feed, character maps, trivia cards, voice quiz UI, studio analytics dashboard
✅ Voice recognition (in supported browsers)
✅ Voice commands ("rate this 5 stars", "show character map", "go home", etc.)
✅ Text-to-speech (Lore speaks back)
✅ Quiz: speak your answer, hear the explanation
✅ All ratings, lists, profile data, follows persist for the session

## What's mocked vs. live

The original code calls Anthropic's Claude API for chat answers, recap generation, and voice question handling. In this static demo, those API calls are replaced with **canned responses** keyed off keywords in the user's input. The app feels intelligent without needing a backend — perfect for investor demos, link sharing, or quick previews.

For the production version with live AI, you'd add a small server proxy (e.g., a Vercel serverless function) that holds your Anthropic API key and forwards requests. That's a 30-line addition.

## Common questions

**Why does it take 1-2 seconds to load?**
Babel compiles the JSX in your browser on first visit. Subsequent loads are cached and instant.

**Can I customize the responses?**
Yes — search `CANNED_CHAT_RESPONSES` and `CANNED_RECAPS` in `app.js`. Add keywords, edit text, ship.

**Why does the mic icon do nothing on Firefox?**
Web Speech API isn't supported. Use Chrome, Edge, or Safari for voice. The demo detects this and shows a fallback notice.

---

Lore. — Where fandoms live.
