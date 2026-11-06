// Brain Jumble update notifications (Firebase Cloud Messaging).
// On Android the app asks for permission to show notifications, then signs this phone
// up to the "updates" topic. When a new version is released, GitHub sends one message to
// that topic and every phone gets a notification, even when the app is closed.
// Tapping it opens the app, which shows the "Update needed" message with the download button.
// Notifications are ON by default; the "Update notifications" switch on the home screen
// turns them off and on again (the choice is remembered in "pb.push").
// Does nothing in a web browser, and quietly does nothing if the build has no Firebase
// push config (see README: "Update notifications").
import { checkForUpdate } from "./update.js";

const TOPIC = "updates";
const KEY = "pb.push";

const plugin = () => {
  const cap = window.Capacitor;
  if (!(cap && cap.isNativePlatform && cap.isNativePlatform())) return null;
  return (cap.Plugins && cap.Plugins.FirebaseMessaging) || null;
};

export const pushAvailable = () => !!plugin();
export const pushWanted = () => { try { return localStorage.getItem(KEY) !== "0"; } catch { return true; } };
const remember = on => { try { localStorage.setItem(KEY, on ? "1" : "0"); } catch {} };

// Subscribes this phone (asking for permission first if needed). Returns true if it's on.
async function subscribe(FM, askAgain) {
  let st = await FM.checkPermissions();
  // Android 13+ shows a system prompt. If they said no there, don't nag on every start.
  if (st.receive !== "granted" && (st.receive !== "denied" || askAgain)) st = await FM.requestPermissions();
  if (st.receive !== "granted") return false;
  await FM.subscribeToTopic({ topic: TOPIC });
  return true;
}

export async function setupPush() {
  const FM = plugin();
  if (!FM) return;
  try {
    // Tapping the notification opens the app; make sure the update message shows.
    if (FM.addListener) FM.addListener("notificationActionPerformed", () => { checkForUpdate(); });
  } catch { /* no push in this build */ }
  if (!pushWanted()) return;
  try { await subscribe(FM, false); } catch { /* Firebase isn't set up in this build, or no Google services */ }
}

// The home-screen switch. Returns true if notifications are now on.
export async function setPushEnabled(on) {
  const FM = plugin();
  if (!FM) return false;
  try {
    if (on) {
      const ok = await subscribe(FM, true);
      remember(ok);
      return ok;
    }
    await FM.unsubscribeFromTopic({ topic: TOPIC });
    remember(false);
    return false;
  } catch { return pushWanted(); }
}
