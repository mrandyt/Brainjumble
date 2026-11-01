## Brain Jumble 1.4 — What's new

- **Update needed: everyone must be on 1.4 to play together.** Older versions can't join or run 1.4 games. If you're on a previous version, download the latest build from this repo (github.com/mrandyt/Brainjumble) and install it over the old one.
- **AI players.** With fewer than 6 people in a game, computer players (marked 🤖) join to fill the room up to 6. They build answers from the same magnets, vote and score points. The host can switch them off in the lobby.
- **10 seconds more to vote.** Voting time is now 30 seconds plus 5 per answer (up to 70).
- **New words: on and under.** Both are always in the pile of joining words.
- **Weekly scoreboard.** The home screen has a "This week's top players" board that starts again every Monday (UTC). Votes you win in games with 2 or more real people count; AI players don't.
- **Halo for the top three.** Whoever is top three this week wears a halo around their name in the lobby, on answers and in the scores until the board resets.

### Installing 1.4

Download `BrainJumble.apk` below on your Android phone and open it. It installs over your old Brain Jumble (1.2 or later) and keeps your nickname and colour.

**Coming from 1.1 or earlier?** Uninstall the old Brain Jumble first, just this once, then install this one.

Everyone playing together needs the latest version.

**Game owner:** the weekly scoreboard needs the new `database.rules.json` published in the Firebase console (Realtime Database → Rules). Without it the game still works, but the scoreboard stays empty.
