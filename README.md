# NOVA V2.1 — Library Studio

Adds a catalog-management UI to the existing NOVA V2 static GitHub Pages site. The original cinematic homepage, search, saved list, and sample video remain intact.

## What you can do

- Open `studio.html` (Library Studio) to create and edit movie metadata, ages, descriptions, genres, and art.
- Create TV series and add episodes organized by season, each with an optional independently playable video link.
- Paste an authorized Google Drive **file** URL (not a folder link), or a hosted MP4 HTTPS URL; `media/*.mp4` relative paths also work if the actual files are hosted.
- Import an MP4 filename list, select local MP4s to read their names, or play one locally as a temporary preview.
- Export `imports.js`, which you then upload to GitHub alongside the NOVA code. Imported listings become visible in **Library additions**, Movies or TV Series, and search. Play buttons appear only when a source is supplied.
- Import earlier exported `imports.js` files or JSON to resume catalog editing on another browser/device.

## Install to current GitHub Pages site

Keep the existing `assets/` folder and `media/` folder untouched. To update `https://github.com/DefinitelyGio/nova-streaming`:

1. Download and extract `NOVA-V2.1-Library-Studio-Update.zip`.
2. In the repository's root (not a new subfolder), replace/update these 5 files:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `imports.js` (new file)
   - `studio.html` (new file)
3. Commit the change to `main`. Existing `Settings > Pages > main / (root)` remains unchanged.
4. Visit `https://definitelygio.github.io/nova-streaming/studio.html` or use the **Library Studio** link in the footer.
5. Add one authorized test title and click **Save title locally**, then **Export imports.js**.
6. Replace only the repo's root `imports.js` with the downloaded file, and commit. The new title will appear to all visitors after deployment.

When uploading, GitHub may not preserve folders when dragged incorrectly. For this patch, there are no new art folders to upload. Do not overwrite an existing imports.js containing your real custom titles with the blank starter copy; back it up first.

## What this doesn't do

This site runs on **GitHub Pages**, which is static hosting. There is no server, database, signed-in admin role, or Google Drive OAuth uploader.

- Local MP4 file selection **does not upload a video** or make it available to other students. It can only read filenames and preview in the local browser.
- Saving in Library Studio updates browser storage only. Public changes occur only after the repo owner exports and commits `imports.js`.
- Although `studio.html` is publicly accessible on GitHub Pages, **visitors cannot modify the site's shared catalog**; they could only make their own local drafts. Do not call this a secure admin login. A truly private dashboard requires a backend and authentication.
- Google Drive preview works only if viewers have the required file access. Drive can impose streaming limits, and MKVs may not preview reliably.
- Directly hosting movie-length MP4s in the GitHub Pages repository is generally unsuitable due to file and bandwidth limits.
- A public GitHub Pages site isn't a school-only private site.

## Content rights

Only add playable links for films, shows, school recordings, or other content you own or have permission to distribute. A file existing in your personal/school Drive doesn't grant public redistribution permission. For commercial titles without distribution rights, you can provide informational catalog listings and official viewing links separately.

## Existing catalog and layout

`catalog.js` still holds the 12 fictional demonstration entries. `imports.js` adds records alongside them without changing any default entries or IDs. The saved-list key `nova-saved-v1` is preserved.

## Structure

```
index.html          public browsing home
styles.css          existing V2 layout with episode controls
catalog.js          fictional V2 starter records (unchanged)
imports.js          published custom records (starts empty)
app.js              V2 UI with published imports and per-episode playback
studio.html         local-draft catalog editor (publicly viewable, not an authenticated backend)
assets/             original V2 artwork (unchanged)
media/              original sample MP4 (unchanged)
```
