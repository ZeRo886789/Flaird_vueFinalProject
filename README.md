# FLAIRD — Anime & Manga Tracker

A Vue 3 + Vite + Pinia + Vue Router school-project foundation for a local anime/manga tracking platform.

## Quick start

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Architecture

Vue → Pinia → localStorage

Core stores:
- `authStore.js`
- `libraryStore.js`
- `socialStore.js`
- `appStore.js`

CSS is intentionally split into:
- base
- layout
- components
- pages
- auth
- animations
- themes
- responsive

See `FLAIRD_BUILD_GUIDE.docx` for the full start-to-finish implementation guide.
