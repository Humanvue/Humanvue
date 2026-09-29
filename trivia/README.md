# Squad Trivia

Pass-and-play trivia for a group of friends on one phone or laptop.

- 2 to 8 players (or solo), 13 color-coded categories (108 questions), optional 15/20/30 second timer.
- 100 points for a right answer plus up to 50 for speed.
- Add your own questions in the **Question bank**; they join the mix in their category.
- Recent games are kept as a simple history.
- **Daily Challenge:** everyone gets the same 10 questions each day (3 rotating categories), plays once,
  and copies a Wordle-style result into the group chat. It needs no server: the date seeds the pick
  (`js/daily.js`), so every copy of the app on the same version agrees. Custom questions are left out.

## Run it

It is a static site with no build step. Open `index.html` in a browser, or serve the folder:

```sh
cd trivia && python3 -m http.server 8000
```

To make the single-file version used for the shareable Artifact:

```sh
sh tools/build-single-file.sh > squad-trivia.html
```

## Hosting

`.github/workflows/trivia-pages.yml` publishes this folder to GitHub Pages on every push.
Turn it on once under **Settings > Pages > Source: GitHub Actions** (Pages on the free plan needs a public repo).

## Where data lives

Everything is saved in the browser (`localStorage`) through `js/store.js`, so scores and custom
questions stay on the device that played them. There are no accounts yet.

## Adding a database later

`js/store.js` is the only file that knows about storage. Every method already returns a Promise,
so a hosted version can swap it for one that calls an API (for example Netlify Functions or
Supabase) with the same method names:

| Method | Later backed by |
| --- | --- |
| `listCustomQuestions`, `addCustomQuestion`, `deleteCustomQuestion` | A shared question bank for the whole group |
| `listGames`, `saveGame`, `clearGames` | A shared leaderboard / game history per user |
| `getLastSetup`, `saveLastSetup` | Per-user preferences |

Players are plain names today. When accounts arrive, each player entry can gain a `userId`
without changing the game flow in `js/app.js`.

## Files

- `index.html` – page shell
- `styles.css` – look and feel, light and dark themes
- `js/questions.js` – built-in categories and questions
- `js/daily.js` – Daily Challenge question pick, share text and streaks
- `js/store.js` – storage layer (swap this for a database)
- `js/app.js` – game screens and rules
