// Takes the README screenshots in a headless phone-sized browser.
// The real network layer (www/net.js) is swapped for a fake one with three
// pretend friends, so the vote and results screens look like a real game.
// Run by .github/workflows/screenshots.yml; needs the www/ folder served on :8080.
import { chromium } from "playwright";
import { mkdirSync } from "fs";

const OUT = "docs/screenshots";
const URL = "http://localhost:8080/index.html";
mkdirSync(OUT, { recursive: true });

const FAKE_NET = String.raw`
const BOTS = [["sam", "Sam", 3], ["priya", "Priya", 7], ["jo", "Jo", 5]];
const OPEN = [
  { hosting: "KZTB", n: "Priya", np: 4, ph: "build", t: "space" },
  { hosting: "MRPL", n: "Dave", np: 6, ph: "vote", t: "classic" },
  { hosting: "QWDX", n: "Leah", np: 3, ph: "lobby", t: "gaming" },
  { hosting: "HNVB", n: "Tom", np: 5, ph: "build", t: "sport" },
  { hosting: "TGZS", n: "Mo", np: 4, ph: "lobby", t: "paranormal" },
  { hosting: "BCLF", n: "Kat", np: 2, ph: "lobby", t: "kids" }
];
const glue = new Set(["i","you","my","the","a","is","and","of","to","in","not","me","it","your"]);
const label = w => w.replace(/(?<=\S)-(?=\S)/g, " ");
function compose(ws) { let o = ""; for (const w of ws) { if (w.startsWith("-") && o) o += w.slice(1); else o += (o ? " " : "") + label(w); } return o; }
function botAnswer(tiles, n) {
  const big = tiles.filter(t => !t.startsWith("-") && !glue.has(t.toLowerCase()));
  const has = w => tiles.includes(w);
  const forms = [
    ["my", big[n * 3], "is", big[n * 3 + 1]],
    ["the", big[n * 3 + 2], big[n * 3 + 3], "and", "my", big[n * 3 + 4], has("-s") ? "-s" : null],
    ["I", big[n * 3 + 5], "your", big[n * 3 + 6], has("-ly") ? "-ly" : null]
  ];
  const w = forms[n % forms.length].filter(Boolean);
  return { w, t: compose(w) };
}

export async function connect() {
  const lobby = {
    presence() { return Promise.resolve(); },
    onPeers(h) { queueMicrotask(() => h({ peers: OPEN.map(p => ({ peer: p.hosting, sameTab: false, presence: p })) })); return () => {}; },
    onConnection(h) { queueMicrotask(() => h(true)); return () => {}; },
    join(name) { return Promise.resolve(makeRoom(name.replace(/^pb-/, "").toUpperCase())); }
  };
  return { uid: "me", offset: () => 0, lobby };
}

function makeRoom(code) {
  const pres = { me: {} };
  BOTS.forEach(([id, n, c]) => { pres[id] = { n, c }; });
  const handlers = new Set();
  let lastKey = null, lastVote = null;
  const snap = () => Object.entries(pres).map(([id, p]) => ({ peer: id, isMe: id === "me", sameTab: id === "me", kind: "viewer", guest: false, presence: { ...p }, updatedAt: Date.now() }));
  const fire = () => { const s = snap(); handlers.forEach(h => h({ peers: s })); };
  function react(g) {
    if (!g) return;
    const key = g.gid + "." + g.round;
    if (g.phase === "build" && lastKey !== key) {
      lastKey = key;
      BOTS.forEach(([id], i) => setTimeout(() => { pres[id] = { ...pres[id], a: { k: key, ...botAnswer(g.tiles, i) } }; fire(); }, 600 + i * 400));
    }
    if (g.phase === "vote" && lastVote !== key) {
      lastVote = key;
      // Wait until the player has voted, then the bots vote (mostly for the player).
      const tryVote = () => {
        if (!(pres.me.v && pres.me.v.k === key)) { setTimeout(tryVote, 300); return; }
        BOTS.forEach(([id], i) => { const pick = i < 2 ? "me" : "sam"; pres[id] = { ...pres[id], v: { k: key, p: pick } }; });
        fire();
      };
      setTimeout(tryVote, 500);
    }
  }
  return {
    name: code,
    async presence(patch) {
      for (const k in patch) { if (patch[k] === null) delete pres.me[k]; else pres.me[k] = patch[k]; }
      fire(); react(pres.me.g);
    },
    peers: snap,
    onPeers(h) { handlers.add(h); queueMicrotask(() => h({ peers: snap() })); return () => handlers.delete(h); },
    connected() { return true; },
    async leave() { handlers.clear(); }
  };
}
`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function phone(browser, scheme) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 892 }, deviceScaleFactor: 2, colorScheme: scheme, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    localStorage.setItem("pb.name", "Andy");
    localStorage.setItem("pb.color", "5");
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => { console.error("PAGE ERROR:", e.message); process.exitCode = 1; });
  await page.route("**/net.js", r => r.fulfill({ contentType: "text/javascript", body: FAKE_NET }));
  await page.goto(URL);
  await page.evaluate(() => document.fonts.ready);
  await sleep(600);
  return { ctx, page };
}
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

// Click tray magnets by word, falling back to the first coloured (non-glue) magnet.
async function placeWords(page, plan) {
  for (const want of plan) {
    const ok = await page.evaluate(want => {
      const mags = [...document.querySelectorAll('.tray [data-act="place"]')];
      const glue = ["I", "you", "my", "the", "a", "is", "and", "of", "to", "in", "not", "me", "it", "your"];
      let el = want === "*" ? mags.find(m => !m.classList.contains("glue")) : mags.find(m => m.textContent === want);
      if (!el) return false;
      el.click(); return true;
    }, want);
    if (ok) await sleep(120);
  }
}

const browser = await chromium.launch();

// 1-2: home screen, light mode (Space room picked)
{
  const { ctx, page } = await phone(browser, "light");
  await page.click('[data-room="space"]');
  await sleep(500);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await shot(page, "01-home");
  await page.evaluate(() => document.querySelector("#rooms").closest(".card").scrollIntoView({ block: "start" }));
  await page.evaluate(() => window.scrollBy(0, -12));
  await sleep(300);
  await shot(page, "02-rooms");

  // 3: lobby
  await page.click('[data-act="hostHere"]');
  await sleep(900);
  await shot(page, "03-lobby");

  // 4: building an answer
  await page.click('[data-act="start"]');
  await sleep(900);
  await placeWords(page, ["my", "*", "is", "*", "-s", "and", "*"]);
  await sleep(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await shot(page, "04-build");

  // 5: voting
  await page.click('[data-act="submit"]');
  await page.waitForSelector('.strip[data-act="vote"]', { timeout: 15000 });
  await sleep(700);
  await page.click('.strip[data-act="vote"]:not([disabled])');
  await sleep(250);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "05-vote");

  // 6: results
  await page.waitForSelector(".badge.gold", { timeout: 15000 });
  await sleep(700);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "06-results");
  await ctx.close();
}

// 7: dark mode, in the Paranormal room
{
  const { ctx, page } = await phone(browser, "dark");
  await page.click('[data-room="paranormal"]');
  await page.click('[data-act="hostHere"]');
  await sleep(700);
  await page.click('[data-act="start"]');
  await sleep(900);
  await placeWords(page, ["the", "*", "*", "is", "*"]);
  await sleep(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "07-dark");
  await ctx.close();
}

// 8: the 18+ check on After Dark
{
  const { ctx, page } = await phone(browser, "light");
  await page.click('[data-room="afterdark"]');
  await sleep(400);
  await page.evaluate(() => document.querySelector("#roomPanel").scrollIntoView({ block: "center" }));
  await sleep(300);
  await shot(page, "08-after-dark");
  await ctx.close();
}

await browser.close();
console.log("Screenshots saved to", OUT);
