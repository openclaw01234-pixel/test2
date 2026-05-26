#!/usr/bin/env node
// Generate Android launcher icons at all required densities from the bubble design.
// Pure JS, no native deps. Run after `npx cap add android`.
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function hexToRgb(h) { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; }
function lerp(a, b, t) { return a + (b - a) * t; }
function lerpColor(a, b, t) { return [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)]; }
function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

const BASE = hexToRgb('#ff3b30');
const HIGHLIGHT = [255, 255, 255];
const DARK = [110, 14, 10];
const BG_TOP = hexToRgb('#0a84ff');
const BG_BOT = hexToRgb('#bf5af2');
function shadeBase(c) { return c.map(v => Math.min(255, v + 80)); }
function darken(c, m) { return c.map(v => v * m); }

function drawBubble(png, size, r, transparent) {
  const cx = size / 2, cy = size / 2;
  const hlX = cx - r * 0.35, hlY = cy - r * 0.42;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const idx = (y * size + x) << 2;
    const dx = x - cx, dy = y - cy;
    const d = Math.sqrt(dx * dx + dy * dy);
    let R = 0, G = 0, B = 0, A = 0;
    if (!transparent) {
      const ty = y / size;
      const bg = lerpColor(BG_TOP, BG_BOT, ty);
      const vx = (x - cx) / size, vy = (y - cy) / size;
      const v = Math.sqrt(vx * vx + vy * vy);
      const vig = 1 - clamp(v * 0.6, 0, 0.4);
      R = bg[0] * vig; G = bg[1] * vig; B = bg[2] * vig; A = 255;
    }
    if (d < r + 6) {
      if (d > r) {
        const glowT = clamp((r + 6 - d) / 6, 0, 1);
        if (transparent) { R = 255; G = 130; B = 130; A = glowT * 128; }
        else { R = lerp(R, 255, glowT * 0.5); G = lerp(G, 130, glowT * 0.4); B = lerp(B, 130, glowT * 0.4); }
      } else {
        const sdx = x - (cx - r * 0.2), sdy = y - (cy - r * 0.2);
        const sd = Math.sqrt(sdx * sdx + sdy * sdy);
        const sT = clamp(sd / (r * 1.4), 0, 1);
        let col;
        if (sT < 0.18) col = lerpColor(HIGHLIGHT, shadeBase(BASE), sT / 0.18);
        else if (sT < 0.55) col = lerpColor(shadeBase(BASE), BASE, (sT - 0.18) / 0.37);
        else if (sT < 0.88) col = lerpColor(BASE, darken(BASE, 0.7), (sT - 0.55) / 0.33);
        else col = lerpColor(darken(BASE, 0.7), DARK, (sT - 0.88) / 0.12);
        const rimT = clamp((d - r * 0.82) / (r * 0.18), 0, 1);
        col = lerpColor(col, [0, 0, 0], rimT * 0.22);
        const hdx = (x - hlX) / (r * 0.5), hdy = (y - hlY) / (r * 0.32);
        const ang = -Math.PI / 4, cosA = Math.cos(ang), sinA = Math.sin(ang);
        const rhdx = hdx * cosA - hdy * sinA, rhdy = hdx * sinA + hdy * cosA;
        const hd = Math.sqrt(rhdx * rhdx + rhdy * rhdy);
        if (hd < 1) col = lerpColor(col, HIGHLIGHT, (1 - hd) * (1 - hd) * 0.85);
        const sdpx = x - (cx - r * 0.42), sdpy = y - (cy - r * 0.46);
        const sdp = Math.sqrt(sdpx * sdpx + sdpy * sdpy);
        if (sdp < r * 0.12) {
          const st = clamp(1 - sdp / (r * 0.12), 0, 1);
          col = lerpColor(col, HIGHLIGHT, Math.pow(st, 1.5));
        }
        const bdx = (x - (cx + r * 0.05)) / (r * 0.45), bdy = (y - (cy + r * 0.55)) / (r * 0.16);
        const bd = Math.sqrt(bdx * bdx + bdy * bdy);
        if (bd < 1) col = lerpColor(col, HIGHLIGHT, (1 - bd) * 0.3);
        const edge = clamp((r - d) / 1.5, 0, 1);
        if (transparent) { R = col[0]; G = col[1]; B = col[2]; A = 255 * edge; }
        else { R = lerp(R, col[0], edge); G = lerp(G, col[1], edge); B = lerp(B, col[2], edge); }
      }
    }
    png.data[idx]     = clamp(R, 0, 255);
    png.data[idx + 1] = clamp(G, 0, 255);
    png.data[idx + 2] = clamp(B, 0, 255);
    png.data[idx + 3] = clamp(A, 0, 255);
  }
}

function gen(size, ratio, outPath, transparent) {
  const png = new PNG({ width: size, height: size });
  drawBubble(png, size, size * ratio, transparent || false);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, PNG.sync.write(png));
  console.log('  +', path.relative(process.cwd(), outPath), '(' + size + 'x' + size + ')');
}

const ROOT = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res');
// Standard launcher icons (with bubble + gradient background)
const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
for (const [bucket, sz] of Object.entries(sizes)) {
  gen(sz, 0.40, path.join(ROOT, 'mipmap-' + bucket, 'ic_launcher.png'));
  gen(sz, 0.40, path.join(ROOT, 'mipmap-' + bucket, 'ic_launcher_round.png'));
}
// Foreground icons (transparent BG, smaller bubble for adaptive-icon safe zone)
const fgSizes = { mdpi: 108, hdpi: 162, xhdpi: 216, xxhdpi: 324, xxxhdpi: 432 };
for (const [bucket, sz] of Object.entries(fgSizes)) {
  gen(sz, 0.27, path.join(ROOT, 'mipmap-' + bucket, 'ic_launcher_foreground.png'), true);
}
console.log('Done.');
