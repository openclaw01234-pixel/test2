#!/usr/bin/env node
// Prepare www/ directory for Capacitor by copying the math game and PWA assets.
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WWW = path.join(ROOT, 'www');

function rmrf(p) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}
function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}
function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const f of fs.readdirSync(src)) {
    const s = path.join(src, f);
    const d = path.join(dest, f);
    const st = fs.statSync(s);
    if (st.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

rmrf(WWW);
fs.mkdirSync(WWW, { recursive: true });

// Copy game (and rename to index.html so Capacitor picks it up by default)
const gameSrc = path.join(ROOT, 'math-game.html');
copyFile(gameSrc, path.join(WWW, 'index.html'));
copyFile(gameSrc, path.join(WWW, 'math-game.html'));

// Patch the index.html copy: still references 'math-game.html' icons & sw, that's fine.

// Copy manifest under both names
copyFile(path.join(ROOT, 'math-manifest.webmanifest'), path.join(WWW, 'math-manifest.webmanifest'));
copyFile(path.join(ROOT, 'math-manifest.webmanifest'), path.join(WWW, 'manifest.webmanifest'));

// Copy service worker
copyFile(path.join(ROOT, 'math-sw.js'), path.join(WWW, 'math-sw.js'));

// Copy icons
copyDir(path.join(ROOT, 'icons'), path.join(WWW, 'icons'));

console.log('Prepared www/ from math-game.html');
console.log('Files in www/:');
function walk(d, prefix){
  for(const f of fs.readdirSync(d)){
    const p=path.join(d,f);
    const st=fs.statSync(p);
    if(st.isDirectory()){console.log('  '+prefix+f+'/');walk(p,prefix+'  ')}
    else console.log('  '+prefix+f+' ('+st.size+' bytes)');
  }
}
walk(WWW,'');
