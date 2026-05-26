# test2

A small collection of browser-based projects, plus mobile (Android) builds.

## Pages

- [`index.html`](./index.html) — Portfolio site
- [`bubble-shooter.html`](./bubble-shooter.html) — Bubble Shooter game
- [`math-game.html`](./math-game.html) — **Math Stars** (new) — fun math practice for kids

## Math Stars (NEW) — Fun Math Practice for Kids

A bright, colorful, kid-friendly math practice game. Single HTML file,
zero dependencies. Also packaged as an Android APK.

### Features

- **4 operations**: addition, subtraction, multiplication, division (plus a Mixed mode)
- **4 difficulty levels**: Easy, Medium, Hard, Expert (numbers scale per operation)
- **3 game modes**: Practice (relaxed), Time Attack (60s), Challenge (10 quiz)
- **Smart input**: 4-option MCQ for younger kids, numpad for harder levels
- **Visual aids**: apple emojis for younger kids on easy/medium add/sub
- **12 achievements** with golden toast unlocks (streaks, mastery, modes)
- **Streak system**: bonus points for consecutive correct answers, fire emojis
- **Star ratings** (3 stars at end of each round) + best score persistence
- **Sound effects**: synthesized via Web Audio (no audio files needed)
- **Confetti & emoji animations** on every correct answer
- **Mascot** that appears at the top of each game
- **Pause / Resume / Sound / Visual aids** all toggleable
- Saves progress in `localStorage`
- Touch + mouse + keyboard support
- Designed for portrait phones, but works on any screen

### How to play (web)

1. Open `math-game.html` in any modern browser.
2. Pick an operation, difficulty, and mode.
3. Tap "Let's Play!" and start solving!

### Android APK

- Pre-built debug APK: **[`dist/math-stars-debug.apk`](./dist/math-stars-debug.apk)**
- Package: `com.mathstars.game`, name: Math Stars
- Min Android: 5.1 (API 22), Target: 14 (API 34)
- Permissions: INTERNET only (works fully offline once installed)

To build the APK locally (requires Android SDK + JDK 17):

```bash
npm install
npm run init:android   # one-time: creates android/ project
npm run build:android  # produces android/app/build/outputs/apk/debug/app-debug.apk
```

## Bubble Shooter

A modern, polished take on the classic bubble shooter, built with vanilla
HTML5 Canvas and JavaScript. No dependencies, single file.

### Features

- Hexagonal bubble grid with smooth pop / drop physics
- Glossy 3D-style bubbles with radial-gradient shading
- Trajectory aim line with wall bounces
- Combo system — chain matches in a row to multiply your score
- Floating clusters drop for big bonus points
- Level progression — more colors and tighter rows as you advance
- Particle explosions, score popups, combo flashes
- Best-score saved to `localStorage`
- Mouse + touch controls (works on phones)
- Pause / Restart / Sound toggle

### How to play

1. Open `bubble-shooter.html` in any modern browser.
2. Move the mouse / your finger to aim the cannon.
3. Click / tap to shoot the next bubble.
4. Match **3 or more** bubbles of the same color to pop them.
5. Disconnect a cluster from the top to drop it for bonus points.
6. Don't let the bubbles cross the dashed danger line!
