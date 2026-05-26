# Build the Bubble Shooter APK

> 🎉 **A pre-built APK is already in this repo!**
> Just download **[`dist/bubble-shooter-debug.apk`](./dist/bubble-shooter-debug.apk)** (~4.6 MB)
> and install it on any Android 5.1+ phone. No build needed.
>
> See [`dist/README.md`](./dist/README.md) for install instructions.

The game is also a **Progressive Web App (PWA)** — installable on Android
**without** an APK, *or* you can rebuild the `.apk` from source using one
of the methods below.

---

## ✨ Path 1 — No APK needed (easiest, recommended)

The game is fully installable as a PWA on Android. After the GitHub Pages
deployment finishes:

1. Open the Pages URL on your Android phone in **Chrome**:
   `https://openclaw01234-pixel.github.io/test2/bubble-shooter.html`
2. Tap the **3-dot menu → "Add to Home screen"** (or "Install app").
3. The game appears as a native-looking icon, runs full-screen, and works
   **offline** (service worker caches everything).

That's it — no Play Store, no APK installer, no friction.

---

## 🌐 Path 2 — One-click APK via PWABuilder.com (no installs)

If you specifically need a `.apk` file to share / sideload:

1. Wait for GitHub Pages to deploy (the **Deploy to GitHub Pages** workflow
   runs automatically on push).
2. Visit **https://www.pwabuilder.com**
3. Paste your Pages URL:
   `https://openclaw01234-pixel.github.io/test2/bubble-shooter.html`
4. Click **Start** → it analyzes your manifest + service worker.
5. Click **Package For Stores → Android**.
6. Choose **Generate package** (default options are fine).
7. Download the `.apk` (and an optional `.aab` for the Play Store).

PWABuilder uses Bubblewrap under the hood; the resulting APK is
production-ready and signed with a debug key (you can re-sign for release).

---

## 🤖 Path 3 — Auto-build via GitHub Actions

This repo includes a workflow that builds the APK in the cloud on every push:

- File: `.github/workflows/build-apk.yml`
- Trigger: push to `main` (or run manually from the Actions tab).
- Output: **Artifacts** section on the workflow run — download
  `bubble-shooter-debug-apk.zip` containing `app-debug.apk`.

To trigger manually:
1. Go to your repo → **Actions** tab.
2. Click **Build Android APK** → **Run workflow**.
3. Wait ~5–8 min for Android SDK + Gradle build.
4. Download the APK artifact.

To create a versioned release with the APK attached, push a tag:

```bash
git tag v1.0.0
git push origin v1.0.0
```

A GitHub Release is automatically created with the APK as a downloadable
asset.

---

## 🛠️ Path 4 — Build locally with Capacitor

If you want to build on your own computer (e.g. for release signing):

### Prerequisites
- **Node.js 18+**
- **Java 17** (Temurin or OpenJDK)
- **Android SDK** (via [Android Studio](https://developer.android.com/studio)
  or `sdkmanager` CLI). Set `ANDROID_HOME` env var.

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Build the www/ folder + add Android platform (one-time)
npm run init:android

# 3. Build the debug APK
npm run build:android
```

The APK is at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

Install on a connected device with:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

### Build a release APK

```bash
cd android
./gradlew assembleRelease
```

You'll need to configure release signing in `android/app/build.gradle`
([Capacitor docs](https://capacitorjs.com/docs/android/configuration#using-an-application-keystore)).

---

## 📁 Project structure

```
test2/
├── bubble-shooter.html       # The game (single-file HTML5 Canvas)
├── manifest.webmanifest      # PWA manifest
├── sw.js                     # Service worker (offline support)
├── icons/                    # PWA icons (generated)
├── package.json              # Capacitor deps
├── capacitor.config.json     # Capacitor app config
├── scripts/prepare-www.js    # Builds www/ for Capacitor
├── .github/workflows/
│   ├── pages.yml             # GitHub Pages deployment
│   └── build-apk.yml         # APK build + release
├── README.md
└── BUILD_APK.md              # This file
```

`www/`, `android/`, and `node_modules/` are generated and gitignored.
