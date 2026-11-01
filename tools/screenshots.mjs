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
import { CONNECT } from "./words.js";
const BOTS = [["sam", "Sam", 3], ["priya", "Priya", 7], ["jo", "Jo", 5]];
const OPEN = [
  { hosting: "KZTB", n: "Priya", np: 4, ph: "build", t: "space" },
  { hosting: "MRPL", n: "Dave", np: 6, ph: "vote", t: "classic" },
  { hosting: "QWDX", n: "Leah", np: 3, ph: "lobby", t: "gaming" },
  { hosting: "HNVB", n: "Tom", np: 5, ph: "build", t: "sport" },
  { hosting: "TGZS", n: "Mo", np: 4, ph: "lobby", t: "paranormal" },
  { hosting: "BCLF", n: "Kat", np: 2, ph: "lobby", t: "kids" }
];
const glue = new Set(["i","you","my","the","a","is","and","of","to","in","not","me","it","your", ...CONNECT.map(x => x.toLowerCase())]);
const label = w => w.replace(/(?<=\S)-(?=\S)/g, " ");
function compose(ws) { let o = ""; for (const w of ws) { if (w.startsWith("-") && o) o += w.slice(1); else o += (o ? " " : "") + label(w); } return o; }
// Scripted answers for the screenshot rooms (see FORCE below), so the
// vote and results screens read like a real game.
const LINES = {
  space: [
    ["earthling", "-s", "are", "basically", "sweaty", "sausage", "-s"],
    ["they", "invent", "-ed", "Monday", "-s", "and", "nobody", "complain", "-ed"],
    ["avoid", "the", "pigeon", "-s", "they", "know", "everything"]
  ],
  paranormal: [
    ["garlic", "and", "regret"],
    ["moisturise", "with", "fog"],
    ["no", "mirror", "-s", "no", "problem", "-s"]
  ]
};
function botAnswer(tiles, n, theme) {
  const lines = LINES[theme];
  if (lines) { const w = lines[n % lines.length]; return { w, t: compose(w) }; }
  const big = tiles.filter(t => !t.startsWith("-") && !glue.has(t.toLowerCase()));
  const w = ["my", big[n * 2], "is", big[n * 2 + 1]].filter(Boolean);
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
      BOTS.forEach(([id], i) => setTimeout(() => { pres[id] = { ...pres[id], a: { k: key, ...botAnswer(g.tiles, i, g.theme) } }; fire(); }, 600 + i * 400));
    }
    if (g.phase === "vote" && lastVote !== key) {
      lastVote = key;
      // Wait until the player has voted, then the bots vote (mostly for the player).
      const tryVote = () => {
        if (!(pres.me.v && pres.me.v.k === key)) { setTimeout(tryVote, 300); return; }
        BOTS.forEach(([id], i) => { const pick = i < 2 ? "me" : "sam"; /* Sam and Priya back the player; Jo backs Sam */ pres[id] = { ...pres[id], v: { k: key, p: pick } }; });
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

// Pins the question and makes sure the words for the player's answer are dealt.
const FORCE_JS = String.raw`
const FORCE = {
  space: { prompt: "What aliens say about us", words: ["planet", "smell", "soggy", "toast"] },
  paranormal: { prompt: "The vampire's skincare routine", words: ["moist", "garlic", "cucumber", "sad"] }
};
for (const [id, f] of Object.entries(FORCE)) { const r = ROOMS.find(x => x.id === id); r.prompts.splice(0, r.prompts.length, f.prompt); }
export function deal(id, rnd) {
  const d = _deal(id, rnd); const f = FORCE[id]; if (!f) return d;
  const missing = f.words.filter(w => !d.includes(w));
  const slots = d.map((x, i) => i).filter(i => !GLUE.includes(d[i]) && !PUNCT.includes(d[i]) && !f.words.includes(d[i]));
  missing.forEach((w, j) => { d[slots[(j * 7 + 3) % slots.length]] = w; });
  return d;
}
`;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function phone(browser, scheme) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 892 }, deviceScaleFactor: 2, colorScheme: scheme, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => {
    localStorage.setItem("pb.name", "Andy");
    localStorage.setItem("pb.color", "5");
    // The real game pauses 15 seconds when starting, joining and finishing; shorten it here.
    window.PB_DELAY_MS = 400;
  });
  const page = await ctx.newPage();
  page.on("pageerror", e => { console.error("PAGE ERROR:", e.message); process.exitCode = 1; });
  await page.route("**/net.js", r => r.fulfill({ contentType: "text/javascript", body: FAKE_NET }));
  await page.route("**/words.js", async r => {
    const res = await r.fetch();
    const body = (await res.text()).replace("export function deal(", "function _deal(") + FORCE_JS;
    await r.fulfill({ response: res, body });
  });
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
  await placeWords(page, ["your", "planet", "smell", "-s", "of", "soggy", "toast", "!"]);
  await sleep(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(200);
  await shot(page, "04-build");

  // 5: voting
  await page.click('[data-act="submit"]');
  await page.waitForSelector('.strip[data-act="vote"]', { timeout: 15000 });
  await sleep(700);
  await page.click('.strip[data-act="vote"]:not([disabled]) >> nth=1');
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
  await placeWords(page, ["moist", "garlic", "and", "a", "sad", "cucumber"]);
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

// 9: first to 10 points, and a round of applause for the winner
{
  const { ctx, page } = await phone(browser, "light");
  await page.click('[data-room="space"]');
  await page.click('[data-act="hostHere"]');
  await sleep(700);
  await page.click('[data-act="start"]');
  for (let round = 0; round < 8; round++) {
    await page.waitForSelector('.tray [data-act="place"], .applause', { timeout: 40000 });
    if (await page.$(".applause")) break;
    await placeWords(page, round % 2 ? ["*", "?"] : ["*", "*", "!"]);
    await page.click('[data-act="submit"]');
    await page.waitForSelector('.strip[data-act="vote"]', { timeout: 15000 });
    await sleep(300);
    await page.click('.strip[data-act="vote"]:not([disabled]) >> nth=0');
    await page.waitForSelector('.tray [data-act="place"], .applause', { state: "detached", timeout: 1000 }).catch(() => {});
    await page.waitForFunction(() => !document.querySelector('.strip[data-act="vote"]'), null, { timeout: 70000 });
  }
  await page.waitForSelector(".applause", { timeout: 40000 });
  await sleep(1300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await shot(page, "09-winner");
  await ctx.close();
}

await browser.close();
console.log("Screenshots saved to", OUT);
