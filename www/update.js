// Brain Jumble update check.
// When the app opens it asks GitHub for the latest release. If that release is
// a newer version than this app, it pops up a message with a button that opens
// the GitHub download page. Only runs inside the Android app, not the web page.
import { APP_VERSION } from "./version.js";

const REPO = "mrandyt/Brainjumble";
const API = `https://api.github.com/repos/${REPO}/releases/tags/latest`;
export const DOWNLOAD_PAGE = `https://github.com/${REPO}/releases/tag/latest`;

const parts = v => String(v || "").split(".").map(n => parseInt(n, 10) || 0);
export function isNewer(latest, current) {
  const a = parts(latest), b = parts(current);
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if ((a[i] || 0) !== (b[i] || 0)) return (a[i] || 0) > (b[i] || 0);
  }
  return false;
}

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// Pull the bold headlines out of the release notes ("- **Thing.** details").
function highlights(body) {
  return [...String(body || "").matchAll(/^\s*[-*]\s+\*\*(.+?)\*\*/gm)].map(m => m[1].replace(/\.$/, "")).slice(0, 6);
}

function show(latest, body) {
  if (document.querySelector(".update-pop")) return;
  const items = highlights(body);
  const el = document.createElement("div");
  el.className = "update-pop";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "updTitle");
  el.innerHTML = `<div class="update-card">
    <span class="eyebrow">Update needed</span>
    <h2 id="updTitle">Brain Jumble ${esc(latest)} is out</h2>
    <p>You've got version ${esc(APP_VERSION)}. Everyone in a game should be on the same version, so please update.</p>
    ${items.length ? `<ul>${items.map(i => `<li>${esc(i)}</li>`).join("")}</ul>` : ""}
    <p class="small muted">Tap <b>Get the update</b>, download <b>BrainJumble.apk</b> from GitHub, then open it. It installs over this version and keeps your nickname.</p>
    <a class="btn primary wide" href="${DOWNLOAD_PAGE}" data-upd="go">Get the update</a>
    <button class="btn wide" type="button" data-upd="later">Later</button>
  </div>`;
  el.addEventListener("click", e => {
    const b = e.target.closest("[data-upd]");
    if (b && b.dataset.upd === "later") { el.remove(); showBanner(latest); }
    else if (e.target === el) { el.remove(); showBanner(latest); }
  });
  document.body.appendChild(el);
  el.querySelector("[data-upd=go]").focus();
}

// After "Later", keep a small reminder at the top of the screen.
function showBanner(latest) {
  if (document.querySelector(".update-banner")) return;
  const a = document.createElement("a");
  a.className = "update-banner";
  a.href = DOWNLOAD_PAGE;
  a.innerHTML = `<b>Update to ${esc(latest)}</b> · tap to download`;
  document.body.prepend(a);
}

export async function checkForUpdate({ force = false } = {}) {
  const native = window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform();
  if (!native && !force) return;
  try {
    const r = await fetch(API, { headers: { Accept: "application/vnd.github+json" }, cache: "no-store" });
    if (!r.ok) return;
    const rel = await r.json();
    const m = String(rel.name || "").match(/(\d+\.\d+(?:\.\d+)?)/);
    if (m && isNewer(m[1], APP_VERSION)) show(m[1], rel.body);
  } catch { /* offline: try again next time the app opens */ }
}
