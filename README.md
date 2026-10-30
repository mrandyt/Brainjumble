# Psychbabble

A fridge-magnet party game for Android. Pick a themed room, and everyone gets the same question and the same pile of word magnets, builds an answer, then votes anonymously for the best one.

## Rooms

Classic, Politics, Sport, Grown-ups, Gaming, Royalty, Just for Kids, Weather, Books, Space, Paranormal, and After Dark (18+, asks players to confirm their age). Each room has its own questions and its own magnets mixed in with the general word bank (about 1,500 words in all). Just for Kids only uses kid-safe words. Rooms, questions and words live in `www/words.js`.

## Install on a phone

1. On your Android phone, open this repo's **Releases** page and tap **Psychbabble (latest build)**.
2. Download `Psychbabble.apk` and open it.
3. If Android asks, allow installs from your browser ("Install unknown apps"), then tap **Install**.

New builds install over the old one, so updating is the same three steps.

## How it's built

- `www/` is the game itself (HTML/JS). `www/words.js` holds the rooms, questions and word bank. `www/net.js` connects players through Firebase Realtime Database.
- Every push to `main` makes GitHub Actions wrap `www/` in an Android app with Capacitor and publish the APK as the `latest` release.
- `signing/debug.keystore` keeps the signing key the same between builds so updates install cleanly. It's a standard debug key, not a secret.

## Firebase setup (one time)

1. In the Firebase console, enable **Authentication → Anonymous**.
2. Create a **Realtime Database**, then paste the contents of `database.rules.json` into its **Rules** tab and **Publish**.
3. Put your web app config into `www/firebase-config.js`.

Without a config the app still runs, in solo practice mode.

## Scoring

10 points per vote, 20 bonus for the round's top answer, 5 for voting for it. You can't vote for your own answer.
