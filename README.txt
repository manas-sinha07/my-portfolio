# Manas AI — Gemini portfolio integration

Files:
- api/chat.js
- ai-bot.css
- ai-bot.js
- index-snippet.html

Integration:
1. Copy `api/chat.js` into the portfolio root as `api/chat.js`.
2. Copy `ai-bot.css` and `ai-bot.js` into the portfolio root.
3. In `index.html`, paste the contents of `index-snippet.html` immediately before the existing `<script src="script.js"></script>`.
4. Keep `GEMINI_API_KEY` only in Vercel Environment Variables.
5. Deploy to Vercel.

The backend uses the Gemini REST API, so no npm package is required for this version.
