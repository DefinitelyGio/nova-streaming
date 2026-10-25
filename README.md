# NOVA V2 — cinematic library demo

NOVA is a static movie/TV discovery demo built for GitHub Pages. It uses original fictional entries and an original sample MP4; it does **not** include commercial movies or TV episodes. The site's code is plain HTML, CSS, and JavaScript (no backend, account, or build system).

## What's new in V2

- Three manually selected featured stories with original landscape artwork and working previous/next controls (no automatic carousel motion).
- The first shelf is visible near the bottom of the initial desktop screen.
- Swipeable, keyboard-accessible horizontal shelves for picks, movies, and series; editorial genre collection tiles.
- More restrained branding, colors, borders, motion, and typography. The old “FRAME COLLECTION” artwork labels were removed.
- Better details panels, a saved My List, an episode display for fictional series, and a sample MP4 player.
- Responsive layout for mobile; respects `prefers-reduced-motion`.

## Publish an update to your existing GitHub Pages site

This is an **update** for `DefinitelyGio/nova-streaming`, not a new repository.

1. Download and extract `NOVA-V2-GitHub-Pages.zip`.
2. Back up or commit a copy of your existing repository first, especially if you've edited `catalog.js` since the V1 release.
3. Replace the site files at the **root** of the `nova-streaming` repository with the contents of the extracted folder. Merge the `assets/` and `media/` folders rather than placing one NOVA folder inside another.
4. Commit the update to the `main` branch; your existing `Settings → Pages → Deploy from a branch → main → / (root)` configuration remains valid.
5. After GitHub Pages completes deployment, open `https://definitelygio.github.io/nova-streaming/`. If the older version is cached, refresh the page.

Tip: GitHub Desktop works well for updating a repository containing many assets. Copy files into the checked-out local repository and commit/push your changes. Don't overwrite `.git`.

## Local development

Open `index.html` in a browser or serve this folder with `python -m http.server 8000`. For online deployment, keep the directory layout exactly as is:

```text
index.html                 Homepage, navigation and modals
styles.css                 Responsive design
app.js                     Browsing, hero, search, My List and player logic
catalog.js                 Editable demo data
assets/poster-*.svg        Original fictional cover art
assets/hero-*.svg          Original featured art
assets/favicon.svg         App icon
media/nova-demo.mp4        Short original sample video
.nojekyll                   GitHub Pages static file handling
```

## Managing permitted content

Edit `catalog.js` to add your **own**, **public-domain**, properly licensed, or otherwise authorized videos. You may also create metadata-only entries that point visitors to official streaming services rather than host the movies yourself.

A playable entry can have:

```js
video: {type: 'mp4', url: 'media/my-student-film.mp4'}
```

Or, for an authorized and appropriately shared Google Drive file:

```js
video: {type: 'drive', url: 'https://drive.google.com/file/d/YOUR_FILE_ID/view'}
```

The Google Drive embed requires each viewer to have file permissions. Google Drive is not designed as a mass-streaming/CDN backend and may enforce playback limits. GitHub Pages itself is public and does not provide secure student-only sign-in. Do not place copyrighted commercial film copies, personal student data, or secrets into this public GitHub repository.

The default `catalog.js` has **12 fictional titles**. Only **The Last Signal** has a playable short **demo clip**. The others intentionally display details without an unavailable Play button. No fictitious "Continue Watching" progress, popularity rankings, or visitor analytics are shown.

## Notes

- **My List** uses `localStorage` and reuses the V1 key `nova-saved-v1`, so saved titles are retained in the same browser as long as the catalog IDs remain unchanged.
- **Search** matches titles, descriptions, tags and genres.
- **TV shows** display seasons and episode labels but don't claim those unprovided episodes are playable.
- **Accessibility** includes keyboard navigation, dialog Escape key, button labels, reduced motion, and visible focus outlines.
