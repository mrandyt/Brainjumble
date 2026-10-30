// Brain Jumble network layer: Firebase Realtime Database, shaped like the
// "room" interface the game engine was written against.
//
// Data layout:
//   rooms/<CODE>/players/<uid>  each player's own state (name, colour, answer, vote)
//   rooms/<CODE>/host           uid of the player running the game
//   rooms/<CODE>/game           shared game state, written only by the host
//   lobby/<CODE>                listing for "Open games", written by the host
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getDatabase, ref, onValue, set, update, remove, onDisconnect,
  runTransaction, serverTimestamp, query, orderByChild, limitToLast
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase rejects `undefined`; round-tripping through JSON drops it.
const plain = v => JSON.parse(JSON.stringify(v));

export async function connect(cfg) {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getDatabase(app);
  await signInAnonymously(auth);
  const uid = auth.currentUser.uid;

  let offset = 0;
  onValue(ref(db, ".info/serverTimeOffset"), s => { offset = s.val() || 0; });

  return { uid, offset: () => offset, lobby: makeLobby(db, uid) };
}

function makeLobby(db, uid) {
  let myCode = null;
  let snap = [];
  const handlers = new Set();
  const q = query(ref(db, "lobby"), orderByChild("at"), limitToLast(30));
  onValue(q, s => {
    const v = s.val() || {};
    const cutoff = Date.now() - 6 * 3600 * 1000;
    snap = Object.entries(v)
      .filter(([, x]) => x && typeof x.at === "number" && x.at > cutoff)
      .map(([code, x]) => ({
        peer: code, sameTab: x.uid === uid, isMe: x.uid === uid, kind: "viewer",
        presence: { hosting: code, n: x.n, np: x.np, ph: x.ph, t: x.t }
      }));
    handlers.forEach(h => h({ peers: snap }));
  });

  return {
    presence(patch) {
      if (patch.hosting) {
        if (myCode && myCode !== patch.hosting) remove(ref(db, "lobby/" + myCode)).catch(() => {});
        myCode = patch.hosting;
        const r = ref(db, "lobby/" + myCode);
        onDisconnect(r).remove();
        return set(r, { uid, n: String(patch.n || ""), np: +patch.np || 0, ph: String(patch.ph || "lobby"), t: String(patch.t || "classic"), at: serverTimestamp() });
      }
      if (patch.hosting === null && myCode) {
        const r = ref(db, "lobby/" + myCode);
        myCode = null;
        onDisconnect(r).cancel();
        return remove(r);
      }
      return Promise.resolve();
    },
    onPeers(h) { handlers.add(h); queueMicrotask(() => h({ peers: snap })); return () => handlers.delete(h); },
    onConnection(h) { return onValue(ref(db, ".info/connected"), s => h(!!s.val())); },
    join(name) {
      const code = String(name).replace(/^pb-/, "").toUpperCase();
      if (!/^[A-Z]{4}$/.test(code)) return Promise.reject({ code: "invalid_argument" });
      return Promise.resolve(makeRoom(db, uid, code));
    }
  };
}

function makeRoom(db, uid, code) {
  const base = "rooms/" + code;
  const meRef = ref(db, base + "/players/" + uid);
  const hostRef = ref(db, base + "/host");
  const gameRef = ref(db, base + "/game");
  let data = {};
  let snap = [];
  const handlers = new Set();

  const build = () => {
    const players = data.players || {};
    snap = Object.entries(players).map(([id, p]) => {
      const presence = { ...(p || {}) };
      if (id === data.host && data.game) { presence.host = true; presence.g = data.game; }
      return { peer: id, by: id, isMe: id === uid, sameTab: id === uid, kind: "viewer", guest: false, presence, updatedAt: Date.now() };
    });
  };
  const stop = onValue(ref(db, base), s => {
    data = s.val() || {};
    build();
    handlers.forEach(h => h({ peers: snap }));
  });
  onDisconnect(meRef).remove();

  return {
    name: code,
    async presence(patch) {
      const p = { ...patch };
      const g = p.g; const host = p.host;
      delete p.g; delete p.host;
      if (Object.keys(p).length) await update(meRef, plain(p));
      if (host === true && data.host !== uid) {
        await runTransaction(hostRef, cur => {
          const here = (data.players || {});
          return (!cur || cur === uid || !here[cur]) ? uid : undefined;
        });
      } else if (host === null && data.host === uid) {
        await set(hostRef, null).catch(() => {});
      }
      if (g) await set(gameRef, plain(g));
    },
    peers() { return snap; },
    onPeers(h) { handlers.add(h); queueMicrotask(() => h({ peers: snap })); return () => handlers.delete(h); },
    connected() { return true; },
    async leave() {
      handlers.clear();
      stop();
      if (data.host === uid) await set(hostRef, null).catch(() => {});
      await onDisconnect(meRef).cancel().catch(() => {});
      await remove(meRef).catch(() => {});
    }
  };
}
