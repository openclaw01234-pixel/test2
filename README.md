# test2

A small collection of browser-based projects.

## Pages

- [`index.html`](./index.html) — Portfolio site
- [`bubble-shooter.html`](./bubble-shooter.html) — **Bubble Shooter** (new edition)

## Bubble Shooter — New Edition

A modern, polished take on the classic bubble shooter, built with vanilla
HTML5 Canvas and JavaScript. No dependencies, single file.

### Features

- **Premium glossy bubbles** — multi-layer gradients, specular highlight,
  bottom reflection and dark rim, pre-rendered to offscreen canvases for
  silky-smooth performance
- **Spatial collision detection** — only nearby grid cells are checked per
  frame, ~30x faster than a naive scan
- **Trajectory aim line** with wall bounces and a target marker
- **Combo system** — chain matches in a row to multiply score
- **Cluster drops** — disconnect a cluster from the top for bonus points
- **Power-ups** spawn occasionally as projectiles:
  - 💣 **Bomb** — clears all bubbles within a 2-cell radius
  - 🌈 **Rainbow** — morphs into the most-common neighbor color and joins
    that cluster
  - ⚡ **Lightning** — clears the entire row of impact
- **Background music** — gentle synthesized melody loop (Web Audio, no files)
- **Theme switcher** — 4 fully-styled themes:
  - **Sky** (default), **Neon**, **Candy**, **Ocean**
- **Achievements** — 14 unlockable goals (combos, drops, power-ups,
  scores, levels, theme explorer) with toast notifications
- **Persistent state** — best score, achievements, theme and music/sound
  preferences saved in `localStorage`
- **Screen shake** on bombs and lightning
- **Pause / Restart / Sound / Music / Theme** quick-action toolbar
- **Mouse + touch controls** — works great on phones

### How to play

1. Open `bubble-shooter.html` in any modern browser.
2. Move the mouse / your finger to aim the cannon.
3. Click / tap to shoot the next bubble.
4. Match **3 or more** bubbles of the same color to pop them.
5. Disconnect a cluster from the top to drop it for bonus points.
6. Look out for **power-up bubbles** (💣 🌈 ⚡) — they spawn after a few
   shots and let you clear large areas at once.
7. Don't let the bubbles cross the dashed danger line!

### Toolbar (bottom-right)

| Icon | Action |
|------|--------|
| 🎵 | Toggle background music |
| 🔊 / 🔇 | Toggle sound effects |
| 🎨 | Open theme switcher & achievements panel |
| ⏸ | Pause |
| ↻ | Restart |

### Achievements

Unlock all 14 by playing — examples include:
- **First Pop** — your first cluster
- **Triple / Combo Master** — x3 / x5 combos
- **Cluster Buster / Avalanche** — drop 5 / 10 bubbles in one shot
- **Boom! / Rainbow Magic / Lightning Strike** — use each power-up
- **Theme Explorer** — try all 4 themes
