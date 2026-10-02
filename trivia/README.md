# Squad Trivia

Pass-and-play trivia for a group of friends on one phone or laptop.

- 2 to 8 players (or solo), 13 color-coded categories (758 questions, about 60 per category), optional 15/20/30 second timer.
- Scoring: Easy 100, Medium 200, Hard 300, plus up to 25% for speed. Three right in a row
  scores x1.5, five or more x2. The category of the day scores x2 in every mode (`js/scoring.js`).
- Category rewards: 5, 15, 30, 60 and 100 right answers in a category unlock five objects, each
  better than the last (Nursing & Health goes Penlight, Pulse Oximeter, Stethoscope, Crash Cart,
  Nightingale Lamp). See the ladders in `js/rewards.js` and your progress in the Trophy case.
- Theme picker (top of every screen): match device, light or dark, plus five accent colors. Saved per device.
- Avatars: a shaded head-and-shoulders portrait you build (skin, eyes, hair, expression, headwear, shirt, background, glasses, and one of 55 objects to hold). You can also be one of those objects instead of a person, still with a face, hair, glasses and a hat and show off up to three unlocked rewards.
- Players: everyone's avatar and trophies, plus a category-strength chart (right answers and accuracy per category).
- Trash talk (online only): one public board for the whole group with @mentions. There are no private messages.
- Leaderboard: today's Daily Challenge results, this week's and this season's totals, and all-time Daily Challenge points.
- Seasons: each calendar month is a season that starts everyone at zero. Last month's winner is the reigning champion and wears a 🏆 on their avatar.
- Hall of Fame: every past season champion and weekly crown, newest first.
- Weekly crown: whoever scores the most Daily Challenge points Monday to Sunday wears a 👑 on their avatar all the next week.
- Add your own questions in the **Question bank**; they join the mix in their category.
- Recent games are kept as a simple history.
- Sharing: **Invite friends** on the home screen opens the phone's share sheet (or copies the link) and shows a QR code to scan. A live game lobby has its own invite link and QR that drop friends straight into that game after they sign in (`?join=CODE`). Daily Challenge results can go out through the share sheet too.
- Installable: `manifest.webmanifest` and `icons/` let players add it to their home screen (Safari: Share, Add to Home Screen; Chrome: menu, Add to Home screen).
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

## Online mode (Firebase)

The GitHub Pages build loads the Firebase SDK, `js/firebase-config.js` and `js/cloud.js`. With them:

- Players sign in with Google.
- Daily Challenge results and custom questions are shared, so the leaderboard shows the whole group.
- **Live Game**: a host gets a 4-letter code, friends join on their own phones, and everyone answers
  the same question at the same time. The host's phone moves the game along.

Firestore access is controlled by `firestore.rules`. Paste it into Firebase console >
Firestore Database > Rules whenever it changes. Add `humanvue.github.io` under
Authentication > Settings > Authorized domains so Google sign-in works on Pages.

The single-file Artifact build leaves Firebase out, so it always stays on the device.

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
| `listDailyResults`, `saveDailyResult` | The group leaderboard (today and all time) |
| `getProfile`, `saveProfile` | The signed-in user |
| `getLastSetup`, `saveLastSetup` | Per-user preferences |

Players are plain names today. When accounts arrive, each player entry can gain a `userId`
without changing the game flow in `js/app.js`.

## Files

- `index.html` – page shell
- `styles.css` – look and feel, light and dark themes
- `js/questions.js` – built-in categories and questions
- `js/scoring.js` – point values, streak multiplier, category-of-the-day bonus
- `js/rewards.js` – category reward ladders and unlock thresholds
- `js/avatar.js` – avatar options and the SVG drawing
- `js/daily.js` – Daily Challenge question pick, share text and streaks
- `js/store.js` – on-device storage (the default)
- `js/cloud.js`, `js/firebase-config.js` – Firebase sign-in, shared scores and live games
- `firestore.rules` – who can read and write what online
- `js/app.js` – game screens and rules
- `js/vendor/qrcode.js` – QR code generator (qrcode-generator 1.4.4, MIT, Kazuhiko Arase)
- `manifest.webmanifest`, `icons/` – home-screen install name and icons
