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
