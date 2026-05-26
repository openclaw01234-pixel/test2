#!/usr/bin/env node
// Builds the www/ folder Capacitor uses to bundle into the APK.
// Copies the game + PWA files and renames bubble-shooter.html to index.html
// so the Android WebView opens the game directly.

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WWW  = path.join(ROOT, 'www');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  for (const f of fs.readdirSync(p)) {
    const full = path.join(p, f);
    const stat = fs.lstatSync(full);
    if (stat.isDirectory()) { rmrf(full); fs.rmdirSync(full); }
    else fs.unlinkSync(full);
  }
}

function copyFile(src, dst) {
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log('  +', path.relative(ROOT, dst));
}
function copyDir(src, dst) {
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f), d = path.join(dst, f);
    if (fs.statSync(s).isDirectory()) copyDir(s, d);
    else copyFile(s, d);
  }
}

console.log('Preparing www/ for Capacitor...');
rmrf(WWW);
fs.mkdirSync(WWW, { recursive: true });

// Game becomes the entry point
copyFile(path.join(ROOT, 'bubble-shooter.html'), path.join(WWW, 'index.html'));
copyFile(path.join(ROOT, 'manifest.webmanifest'), path.join(WWW, 'manifest.webmanifest'));
copyFile(path.join(ROOT, 'sw.js'), path.join(WWW, 'sw.js'));
copyDir(path.join(ROOT, 'icons'), path.join(WWW, 'icons'));

function dirSize(p) {
  let n = 0;
  for (const f of fs.readdirSync(p)) {
    const s = path.join(p, f);
    n += fs.statSync(s).isDirectory() ? dirSize(s) : fs.statSync(s).size;
  }
  return n;
}
console.log('www/ ready (' + ((dirSize(WWW) / 1024) | 0) + ' KB)');
