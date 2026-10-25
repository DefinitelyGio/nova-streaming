# NOVA — Movie & TV streaming website starter

A cinematic, static website prototype with search, movie/series browsing, genre filtering, details panels, episode lists, a personal watchlist (stored per browser), and a video player. No build tools, paid services, API keys or accounts are needed to test it.

> **Content rights:** All 12 catalog entries are fictional placeholders. The short MP4 bundled with this project is original test footage generated for this demo, not a commercial movie. Add only videos you own, that are public domain, that carry a compatible redistribution license, or that you have explicit permission to distribute. Do not republish the Marvel-movie links from the referenced document.

## Quick start

1. Download and unzip the folder.
2. Open `index.html` in a modern browser. The movie search, filters, details and My List work even without an internet connection (the website uses optional online fonts).
3. Select **The Last Signal** and **Play sample** to test the short bundled MP4 player.

## File layout

```
index.html             Site layout, search, modals
styles.css             Full responsive design
app.js                 Search, categories, watchlist and player logic
catalog.js             Movie/TV catalog: edit this to add your titles
assets/                Original SVG cover images and hero artwork
media/nova-demo.mp4   Original short video used to test playback
```

## Add an authorized movie or school production

Open `catalog.js`, find an item, and replace its `video: null` with one of:

**Video file uploaded with your site or on a licensed video host:**

```js
video: { type: 'mp4', url: 'media/my-school-film.mp4' }
```

For maximum compatibility, use MP4 with H.264 video and AAC audio. Add the actual file under the `media/` directory when testing locally. **GitHub Pages isn't a good host for large video files.** For scale, use a dedicated streaming host with permission to distribute the content.

**Google Drive preview for an authorized file:**

```js
video: {
  type: 'drive',
  url: 'https://drive.google.com/file/d/YOUR_FILE_ID/view'
}
```

The code changes this into Google's preview embed. You must configure sharing so every intended viewer has access to **the individual video file**; an accessible website does not override Drive file permissions. School Google Workspace policies can also block sharing or embeds. Google Drive is not a robust mass-streaming backend and may apply viewer/playback restrictions.

If you have no video for a listing, leave `video: null`. The player will explain it is not yet available.

## Add another title

In `catalog.js`, copy an existing entry and give it a unique `id`:

```js
{
  id: 'my-school-film',
  title: 'Our School Film',
  type: 'movie',           // 'movie' or 'series'
  year: 2026,
  age: 'PG',
  length: '12m',
  genres: ['Drama'],
  tag: 'STUDENT FILM',
  description: 'An original movie made by students.',
  art: 'coast',           // choose from existing poster names
  accent: '#56a7e0',
  video: {type:'mp4',url:'media/my-school-film.mp4'}
}
```

Posters supplied are abstract, original placeholder illustrations. They are not film posters for actual copyrighted movies. Replace images under `assets/` if you have rights to your alternatives.

## Publish a demo via GitHub Pages

1. Use **your personal GitHub account**, not a school account, to retain access after graduation.
2. Create a new repository, for example `nova-library`.
3. Upload the **contents** of this folder to the root of the repository (not the zip itself). `index.html` must be at the repository root.
4. In GitHub repository **Settings → Pages**, choose **Deploy from a branch**, then `main` and `/ (root)`, and save.
5. GitHub will show the published URL in the Pages settings.

GitHub Pages is **public**. It does not provide private school-only sign-in. If you want student-only access, use school-approved hosting with actual server-side authentication and authorization; client-side password prompts are not secure. Also, do not commit confidential files, school-user data, or unlicensed videos to a public repository.

## Things this demo does / doesn't do

**Works:** browse, search titles and genres, filter movies/series, open details and episode lists, save items locally, play sample MP4, embed an accessible permitted Drive video, mobile layout, close player to stop playback.

**Not included yet:** backend accounts, shared watchlists, multi-user analytics, uploads, watch-history synchronization, DRM, payments, school-login integration, cloud video encoding, automatic Google Drive indexing, or guaranteed streaming throughput.

## Suggested next phase

- Pick the final name, color palette and brand.
- Replace demo titles with rights-cleared real films and school productions.
- Store catalog data in a shared database or editable Google Sheet rather than hand-editing JavaScript.
- Add real secure authentication if access must be restricted to students.
- Move large video delivery to an approved video streaming service.
