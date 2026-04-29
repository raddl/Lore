# Fix: Lore Demo on GitHub Pages

## The problem you hit

Your repo had three files: `index.html`, `app.js`, `README.md`.

The original `index.html` loads `app.js` via `<script type="text/babel" src="app.js">`.
GitHub Pages serves `.js` files with strict MIME type `application/javascript`, which
Babel's in-browser compiler refuses to execute. Result: blank black screen after splash.

## The fix (1 step)

**Replace your repo's `index.html` with this folder's `index.html`.**

That's it. The new `index.html` has all the JavaScript inlined directly into the file,
so there's no separate `app.js` for Babel to choke on. It's the same exact app, just
packaged differently.

You can also **delete `app.js` from your repo** — it's no longer needed.

## Steps in GitHub

1. In your repo, click on `index.html`
2. Click the pencil icon to edit
3. Delete everything in the file
4. Open the new `index.html` from this folder in any text editor
5. Copy the entire contents
6. Paste into GitHub's editor
7. Commit
8. (Optional) Delete `app.js` from your repo — same way, just click the trash icon

GitHub Pages will rebuild in ~30 seconds. Refresh your demo URL.

## What you should see

- Loading splash with the Lore logo (1-2 seconds)
- Then the full app loads with the phone frame and home screen on the right

## If it's still black

Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows). Browsers cache the
broken version aggressively.

## Why this works

The new `index.html` is ONE file with everything inline. No external `.js` file means
no MIME type problem. React, Tailwind, and Lucide still load from public CDNs (those
work fine on GitHub Pages), and Babel compiles the JSX inline within the same HTML
document — which it's allowed to do.
