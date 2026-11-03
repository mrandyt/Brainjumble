// Sends one push notification to every phone signed up to the "updates" topic
// (see www/push.js). Run by .github/workflows/build.yml when a new version is released.
//
// Needs the FIREBASE_SERVICE_ACCOUNT secret (a Firebase service-account key, JSON) and
// the google-auth-library package (the workflow installs it next to this script).
// Usage: node send-update-push.mjs <version>
import { GoogleAuth } from "google-auth-library";

const version = process.argv[2];
if (!version) throw new Error("Pass the version, e.g. 1.7.0");
const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT is not set");

const credentials = JSON.parse(raw);

// The private key must be a PEM with real line breaks. If it was pasted with the line
// breaks written out as backslash-n text, turn them back into real ones.
let key = String(credentials.private_key || "");
if (!key.includes("\n") && key.includes("\\n")) key = key.replace(/\\n/g, "\n");
credentials.private_key = key;
// Safe self-check: prints facts about the key, never the key itself.
const lines = key.split("\n").filter(Boolean);
console.log("Key check:", JSON.stringify({
  hasClientEmail: !!credentials.client_email, projectId: credentials.project_id || null,
  keyLength: key.length, lines: lines.length,
  startsOk: lines[0] === "-----BEGIN PRIVATE KEY-----", endsOk: lines[lines.length - 1] === "-----END PRIVATE KEY-----"
}));
// Deeper safe check: is the key's inner data intact? Prints only counts and the standard
// ASN.1 header, never any secret bytes.
try {
  const body = lines.slice(1, -1).join("");
  const badChars = (body.match(/[^A-Za-z0-9+/=]/g) || []).length;
  const der = Buffer.from(body, "base64");
  const declared = der[1] === 0x82 ? (der[2] << 8) + der[3] + 4 : null;
  console.log("Key body check:", JSON.stringify({ badChars, base64Length: body.length, derBytes: der.length, declaredBytes: declared, header: der.subarray(0, 4).toString("hex") }));
  const { createPrivateKey } = await import("node:crypto");
  const k = createPrivateKey(key);
  console.log("Node can read the key:", k.asymmetricKeyType);
} catch (e) { console.log("Node cannot read the key:", e.code || "", String(e.message).split("\n")[0]); }
const auth = new GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/firebase.messaging"] });
const client = await auth.getClient();
const { token } = await client.getAccessToken();

const res = await fetch(`https://fcm.googleapis.com/v1/projects/${credentials.project_id}/messages:send`, {
  method: "POST",
  headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    message: {
      topic: "updates",
      notification: {
        title: `Brain Jumble ${version} is out`,
        body: "Tap to open the app and get the update. Everyone needs the latest version to play together."
      },
      android: { priority: "HIGH", notification: { tag: "bj-update" } }
    }
  })
});
const text = await res.text();
if (!res.ok) { console.error("FCM refused the message:", res.status, text); process.exit(1); }
console.log("Update notification sent:", text);
