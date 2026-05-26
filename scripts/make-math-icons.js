#!/usr/bin/env node
// Generate Math Stars icons (PNG) using pngjs.
// Output: icons/math-icon-{192,512,1024,maskable-512}.png
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const OUT_DIR = path.join(__dirname, '..', 'icons');
fs.mkdirSync(OUT_DIR, { recursive: true });

function lerp(a,b,t){return a+(b-a)*t}
function clamp(v,lo,hi){return v<lo?lo:v>hi?hi:v}

// Color palette (kid-friendly)
const COLORS = {
  bgTopLight:[252,231,243],   // #fce7f3 pink
  bgBotLight:[219,234,254],   // #dbeafe blue
  bgTopDark:[124,58,237],     // #7c3aed purple
  bgBotDark:[236,72,153],     // #ec4899 pink
  numA:[124,58,237],          // purple
  numB:[236,72,153],          // pink
  numC:[251,191,36],          // yellow
  numD:[34,197,94],           // green
  white:[255,255,255],
};

// Plus/Minus/Multiply/Divide signs as text-like rectangles (simple geometry)
// We'll draw a stylized "1+2" composition with stars

function makeIcon(size, opts){
  opts = opts || {};
  const maskable = !!opts.maskable;
  const png = new PNG({ width: size, height: size });
  const data = png.data;
  const cx = size/2, cy = size/2;

  // Background gradient (purple-pink for adaptive recognition)
  // Use vibrant palette for recognition
  const topColor = [124,58,237];  // purple
  const botColor = [236,72,153];  // pink

  // Optional rounded corners (only for non-maskable)
  const cornerR = maskable ? 0 : Math.round(size * 0.22);

  for(let y=0;y<size;y++){
    const ty = y/size;
    const r = lerp(topColor[0], botColor[0], ty);
    const g = lerp(topColor[1], botColor[1], ty);
    const b = lerp(topColor[2], botColor[2], ty);
    for(let x=0;x<size;x++){
      const idx = (y*size + x)*4;
      // Rounded mask
      if(cornerR>0){
        let inside = true;
        // top-left
        if(x<cornerR && y<cornerR){
          const dx=cornerR-x, dy=cornerR-y;
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        // top-right
        if(x>size-cornerR && y<cornerR){
          const dx=x-(size-cornerR), dy=cornerR-y;
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        // bottom-left
        if(x<cornerR && y>size-cornerR){
          const dx=cornerR-x, dy=y-(size-cornerR);
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        // bottom-right
        if(x>size-cornerR && y>size-cornerR){
          const dx=x-(size-cornerR), dy=y-(size-cornerR);
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        if(!inside){
          data[idx]=0;data[idx+1]=0;data[idx+2]=0;data[idx+3]=0;
          continue;
        }
      }
      data[idx]   = r;
      data[idx+1] = g;
      data[idx+2] = b;
      data[idx+3] = 255;
    }
  }

  // For maskable icons, content must be inside 80% safe area
  const safeScale = maskable ? 0.78 : 1.0;
  const innerSize = size * safeScale;
  const inset = (size - innerSize) / 2;

  // Draw a big yellow star in center-back
  drawStar(data, size, cx, cy, innerSize*0.42, 5, [251,191,36], 0.85);

  // Draw "+" symbol in top-left area
  drawPlus(data, size, cx - innerSize*0.22, cy - innerSize*0.20, innerSize*0.10, [255,255,255]);

  // Draw "×" in top-right
  drawTimes(data, size, cx + innerSize*0.22, cy - innerSize*0.20, innerSize*0.10, [255,255,255]);

  // Draw "−" in bottom-left
  drawMinus(data, size, cx - innerSize*0.22, cy + innerSize*0.20, innerSize*0.10, [255,255,255]);

  // Draw "÷" in bottom-right
  drawDivide(data, size, cx + innerSize*0.22, cy + innerSize*0.20, innerSize*0.10, [255,255,255]);

  // Big bold "123" in center? Let's make a star with sparkle
  drawStar(data, size, cx, cy, innerSize*0.32, 5, [255,255,255], 1.0);
  drawStar(data, size, cx, cy, innerSize*0.18, 5, [251,191,36], 1.0);

  // Add a small sparkle star top-right
  drawStar(data, size, cx + innerSize*0.32, cy - innerSize*0.32, innerSize*0.05, 4, [255,255,255], 0.9);
  drawStar(data, size, cx - innerSize*0.32, cy + innerSize*0.32, innerSize*0.04, 4, [255,255,255], 0.9);

  return png;
}

function setPixel(data, size, x, y, color, alpha){
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=size||y>=size) return;
  const idx=(y*size+x)*4;
  const a = alpha==null?1:alpha;
  if(data[idx+3]===0) return; // transparent area, skip
  data[idx]   = Math.round(lerp(data[idx],   color[0], a));
  data[idx+1] = Math.round(lerp(data[idx+1], color[1], a));
  data[idx+2] = Math.round(lerp(data[idx+2], color[2], a));
}

function fillRect(data, size, x1, y1, x2, y2, color){
  const xa=Math.min(x1,x2), xb=Math.max(x1,x2);
  const ya=Math.min(y1,y2), yb=Math.max(y1,y2);
  for(let y=ya;y<=yb;y++){
    for(let x=xa;x<=xb;x++){
      setPixel(data,size,x,y,color,1);
    }
  }
}

function fillCircle(data, size, cx, cy, r, color, alpha){
  const r2=r*r;
  const x0=Math.max(0,Math.floor(cx-r));
  const x1=Math.min(size-1,Math.ceil(cx+r));
  const y0=Math.max(0,Math.floor(cy-r));
  const y1=Math.min(size-1,Math.ceil(cy+r));
  for(let y=y0;y<=y1;y++){
    for(let x=x0;x<=x1;x++){
      const dx=x-cx, dy=y-cy;
      const d2=dx*dx+dy*dy;
      if(d2<=r2) setPixel(data,size,x,y,color,alpha==null?1:alpha);
    }
  }
}

function drawPlus(data, size, cx, cy, w, color){
  const t = w*0.32;
  fillRect(data,size,cx-w/2,cy-t/2,cx+w/2,cy+t/2,color);
  fillRect(data,size,cx-t/2,cy-w/2,cx+t/2,cy+w/2,color);
}
function drawMinus(data, size, cx, cy, w, color){
  const t = w*0.32;
  fillRect(data,size,cx-w/2,cy-t/2,cx+w/2,cy+t/2,color);
}
function drawTimes(data, size, cx, cy, w, color){
  const t = w*0.32;
  // Two diagonal rectangles
  for(let i=-w/2;i<=w/2;i+=0.5){
    for(let j=-t/2;j<=t/2;j+=0.5){
      // Rotate 45deg
      const cos=Math.SQRT1_2, sin=Math.SQRT1_2;
      setPixel(data,size,cx+i*cos-j*sin,cy+i*sin+j*cos,color,1);
      setPixel(data,size,cx+i*cos+j*sin,cy-i*sin+j*cos,color,1);
    }
  }
}
function drawDivide(data, size, cx, cy, w, color){
  const t = w*0.32;
  // Bar
  fillRect(data,size,cx-w/2,cy-t/4,cx+w/2,cy+t/4,color);
  // Top dot
  fillCircle(data,size,cx,cy-w/3,t/1.5,color,1);
  // Bottom dot
  fillCircle(data,size,cx,cy+w/3,t/1.5,color,1);
}

function drawStar(data, size, cx, cy, r, points, color, alpha){
  // Build star polygon vertices, fill via scanline-ish brute force
  const verts=[];
  for(let i=0;i<points*2;i++){
    const ang = -Math.PI/2 + i*Math.PI/points;
    const rad = (i%2===0) ? r : r*0.45;
    verts.push([cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad]);
  }
  // Bounding box
  let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
  verts.forEach(v=>{minX=Math.min(minX,v[0]);maxX=Math.max(maxX,v[0]);minY=Math.min(minY,v[1]);maxY=Math.max(maxY,v[1])});
  for(let y=Math.max(0,Math.floor(minY));y<=Math.min(size-1,Math.ceil(maxY));y++){
    for(let x=Math.max(0,Math.floor(minX));x<=Math.min(size-1,Math.ceil(maxX));x++){
      if(pointInPoly(x,y,verts)) setPixel(data,size,x,y,color,alpha==null?1:alpha);
    }
  }
}

function pointInPoly(x,y,poly){
  let inside=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i++){
    const xi=poly[i][0], yi=poly[i][1];
    const xj=poly[j][0], yj=poly[j][1];
    const intersect=((yi>y)!==(yj>y)) && (x < (xj-xi)*(y-yi)/(yj-yi+1e-9) + xi);
    if(intersect) inside=!inside;
  }
  return inside;
}

function save(png, filePath){
  return new Promise((resolve)=>{
    png.pack().pipe(fs.createWriteStream(filePath)).on('finish',resolve);
  });
}

async function main(){
  const tasks = [
    { name: 'math-icon-192.png',          size: 192,  maskable:false },
    { name: 'math-icon-512.png',          size: 512,  maskable:false },
    { name: 'math-icon-1024.png',         size: 1024, maskable:false },
    { name: 'math-icon-maskable-512.png', size: 512,  maskable:true  },
  ];
  for(const t of tasks){
    const png = makeIcon(t.size, { maskable: t.maskable });
    const out = path.join(OUT_DIR, t.name);
    await save(png, out);
    const stat = fs.statSync(out);
    console.log('  ->', t.name, '('+t.size+'x'+t.size+',', stat.size, 'bytes)');
  }
  console.log('Done.');
}

main().catch(e=>{console.error(e);process.exit(1)});
