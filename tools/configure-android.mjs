// Patches the generated Capacitor Android project so every build:
//   1. is signed with the key saved in signing/debug.keystore (so a new
//      version installs straight over the old one without uninstalling), and
//   2. gets a higher versionCode than the last one, plus the real version name.
//
// Usage: node tools/configure-android.mjs <versionCode>
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const gradlePath = process.argv[3] || resolve(root, "android/app/build.gradle");
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
