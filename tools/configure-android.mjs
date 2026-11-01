// Patches the generated Capacitor Android project so every build:
//   1. is signed with the key saved in signing/debug.keystore (so a new
//      version installs straight over the old one without uninstalling),
//   2. gets a higher versionCode than the last one, plus the real version name, and
//   3. works on foldables and tablets: the window can be any size, and Android
//      never restarts the app (losing the game) when the screen opens, closes,
//      turns or resizes.
//
// Usage: node tools/configure-android.mjs <versionCode> [build.gradle] [AndroidManifest.xml]
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";

const root = resolve(import.meta.dirname, "..");
const gradlePath = process.argv[3] || resolve(root, "android/app/build.gradle");
const manifestPath = process.argv[4] || resolve(dirname(gradlePath), "src/main/AndroidManifest.xml");
const keystore = resolve(root, "signing/debug.keystore");
const versionCode = parseInt(process.argv[2], 10);
const versionName = JSON.parse(readFileSync(resolve(root, "package.json"), "utf8")).version;

if (!Number.isInteger(versionCode) || versionCode < 1) throw new Error("Pass a versionCode, e.g. the build number");
if (!existsSync(keystore)) throw new Error("Missing " + keystore);

let g = readFileSync(gradlePath, "utf8");
const must = (re, what) => { if (!re.test(g)) throw new Error("Couldn't find " + what + " in build.gradle"); };

must(/versionCode\s+\d+/, "versionCode");
must(/versionName\s+"[^"]*"/, "versionName");
must(/^android\s*\{/m, "android {");
must(/buildTypes\s*\{/, "buildTypes {");

g = g.replace(/versionCode\s+\d+/, `versionCode ${versionCode}`)
     .replace(/versionName\s+"[^"]*"/, `versionName "${versionName}"`)
     .replace(/^android\s*\{/m, `android {
    signingConfigs {
        brainjumble {
            storeFile file(${JSON.stringify(keystore)})
            storePassword "android"
            keyAlias "androiddebugkey"
            keyPassword "android"
        }
    }`)
     .replace(/buildTypes\s*\{/, `buildTypes {
        debug {
            signingConfig signingConfigs.brainjumble
        }`);

writeFileSync(gradlePath, g);
console.log(`build.gradle: version ${versionName} (code ${versionCode}), signed with ${keystore}`);

// ---- Foldables and tablets ----
let m = readFileSync(manifestPath, "utf8");
if (!/<application\b/.test(m)) throw new Error("Couldn't find <application> in AndroidManifest.xml");
if (!/android:configChanges="[^"]*"/.test(m)) throw new Error("Couldn't find android:configChanges in AndroidManifest.xml");
// Let the app fill any window size (split screen, unfolded, tablet) instead of being boxed in.
if (!/android:resizeableActivity=/.test(m)) m = m.replace(/<application\b/, `<application\n        android:resizeableActivity="true"`);
// Handle every size/shape change inside the running app rather than restarting the activity.
const CHANGES = ["orientation", "keyboardHidden", "keyboard", "screenSize", "smallestScreenSize", "screenLayout", "uiMode", "density", "fontScale", "navigation", "locale"];
m = m.replace(/android:configChanges="([^"]*)"/, (_, v) => `android:configChanges="${[...new Set([...v.split("|").filter(Boolean), ...CHANGES])].join("|")}"`);
writeFileSync(manifestPath, m);
console.log("AndroidManifest.xml: resizeable window, no restart on fold/unfold/rotate");
