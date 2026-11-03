// Brain Jumble update notifications (Firebase Cloud Messaging).
// On Android the app asks for permission to show notifications, then signs this phone
// up to the "updates" topic. When a new version is released, GitHub sends one message to
// that topic and every phone gets a notification, even when the app is closed.
// Tapping it opens the app, which shows the "Update needed" message with the download button.
// Does nothing in a web browser, and quietly does nothing if the build has no Firebase
// push config (see README: "Update notifications").
import { checkForUpdate } from "./update.js";

const TOPIC = "updates";

export async function setupPush() {
  const cap = window.Capacitor;
  if (!(cap && cap.isNativePlatform && cap.isNativePlatform())) return;
  const FM = cap.Plugins && cap.Plugins.FirebaseMessaging;
  if (!FM) return;
  try {
    // Tapping the notification opens the app; make sure the update message shows.
    if (FM.addListener) FM.addListener("notificationActionPerformed", () => { checkForUpdate(); });
  } catch { /* no push in this build */ }
  try {
    let st = await FM.checkPermissions();
    // Ask (Android 13+ shows a system prompt). If they said no, don't nag.
    if (st.receive !== "granted" && st.receive !== "denied") st = await FM.requestPermissions();
    if (st.receive === "granted") await FM.subscribeToTopic({ topic: TOPIC });
  } catch { /* Firebase isn't set up in this build, or the phone has no Google services */ }
}
