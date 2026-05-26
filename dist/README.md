# Bubble Shooter — Debug APK

**`bubble-shooter-debug.apk`** — Ready-to-install Android app, built and
signed with the Capacitor debug key.

## Quick install on Android

1. Download `bubble-shooter-debug.apk` to your phone.
2. Open it. Android may ask you to **allow installs from this source** —
   tap **Settings** and enable it for your browser/file manager.
3. Tap **Install**.
4. Open **Bubble Shooter** from your home screen — works fully offline.

## Specs

| | |
|---|---|
| Package | `com.bubbleshooter.game` |
| Version | 1.0 |
| Min Android | 5.1 (API 22) |
| Target Android | 14 (API 34) |
| Size | ~4.6 MB |
| Signature | Debug key (re-sign for Play Store) |
| Permissions | `INTERNET` (required by WebView, no network actually used at runtime) |

## Rebuilding from source

The APK is rebuilt automatically on every push to `main` via
[`.github/workflows/build-apk.yml`](../.github/workflows/build-apk.yml).
You can also build locally — see [`../BUILD_APK.md`](../BUILD_APK.md).
