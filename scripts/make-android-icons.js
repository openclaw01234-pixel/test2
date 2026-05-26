#!/usr/bin/env node
// Generate Math Stars launcher icons for Android (all densities + adaptive icon foreground)
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..');
const RES = path.join(ROOT, 'android/app/src/main/res');

function lerp(a,b,t){return a+(b-a)*t}

function makeIcon(size, opts){
  opts = opts || {};
  const adaptive = !!opts.adaptive; // adaptive foreground = transparent bg
  const png = new PNG({ width: size, height: size });
  const data = png.data;
  const cx = size/2, cy = size/2;
  const topColor = [124,58,237];
  const botColor = [236,72,153];
  const cornerR = adaptive ? 0 : Math.round(size * 0.20);

  for(let y=0;y<size;y++){
    const ty = y/size;
    const r = lerp(topColor[0], botColor[0], ty);
    const g = lerp(topColor[1], botColor[1], ty);
    const b = lerp(topColor[2], botColor[2], ty);
    for(let x=0;x<size;x++){
      const idx = (y*size + x)*4;
      // Rounded mask (skip for adaptive)
      if(cornerR>0){
        let inside = true;
        if(x<cornerR && y<cornerR){
          const dx=cornerR-x, dy=cornerR-y;
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        if(x>size-cornerR && y<cornerR){
          const dx=x-(size-cornerR), dy=cornerR-y;
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        if(x<cornerR && y>size-cornerR){
          const dx=cornerR-x, dy=y-(size-cornerR);
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        if(x>size-cornerR && y>size-cornerR){
          const dx=x-(size-cornerR), dy=y-(size-cornerR);
          if(dx*dx+dy*dy > cornerR*cornerR) inside=false;
        }
        if(!inside){
          data[idx]=0;data[idx+1]=0;data[idx+2]=0;data[idx+3]=0;
          continue;
        }
      }
      if(adaptive){
        // For adaptive foreground: draw a circular gradient background filling 60% of canvas
        const dx=x-cx, dy=y-cy;
        const dist=Math.sqrt(dx*dx+dy*dy);
        const radius = size*0.36;
        if(dist<=radius){
          data[idx]=r;data[idx+1]=g;data[idx+2]=b;data[idx+3]=255;
        }else{
          data[idx]=0;data[idx+1]=0;data[idx+2]=0;data[idx+3]=0;
        }
      }else{
        data[idx]=r;data[idx+1]=g;data[idx+2]=b;data[idx+3]=255;
      }
    }
  }

  // For adaptive icon, content must fit in inner 66% safe zone (108dp out of 108dp + outer area)
  const safeScale = adaptive ? 0.5 : 1.0;
  const innerSize = size * safeScale;

  // Big yellow star
  drawStar(data, size, cx, cy, innerSize*0.42, 5, [251,191,36], 0.85);
  // Operators around
  drawPlus(data, size, cx - innerSize*0.22, cy - innerSize*0.22, innerSize*0.10, [255,255,255]);
  drawTimes(data, size, cx + innerSize*0.22, cy - innerSize*0.22, innerSize*0.10, [255,255,255]);
  drawMinus(data, size, cx - innerSize*0.22, cy + innerSize*0.22, innerSize*0.10, [255,255,255]);
  drawDivide(data, size, cx + innerSize*0.22, cy + innerSize*0.22, innerSize*0.10, [255,255,255]);
  // Center stars
  drawStar(data, size, cx, cy, innerSize*0.32, 5, [255,255,255], 1.0);
  drawStar(data, size, cx, cy, innerSize*0.18, 5, [251,191,36], 1.0);
  // Sparkles
  drawStar(data, size, cx + innerSize*0.34, cy - innerSize*0.32, innerSize*0.05, 4, [255,255,255], 0.9);
  drawStar(data, size, cx - innerSize*0.32, cy + innerSize*0.34, innerSize*0.04, 4, [255,255,255], 0.9);

  return png;
}

function setPixel(data, size, x, y, color, alpha){
  x=Math.round(x);y=Math.round(y);
  if(x<0||y<0||x>=size||y>=size) return;
  const idx=(y*size+x)*4;
  if(data[idx+3]===0 && alpha<1) return;
  const a = alpha==null?1:alpha;
  if(data[idx+3]===0){
    data[idx]=color[0];data[idx+1]=color[1];data[idx+2]=color[2];data[idx+3]=Math.round(255*a);
    return;
  }
  data[idx]   = Math.round(lerp(data[idx],   color[0], a));
  data[idx+1] = Math.round(lerp(data[idx+1], color[1], a));
  data[idx+2] = Math.round(lerp(data[idx+2], color[2], a));
}
function fillRect(data, size, x1, y1, x2, y2, color){
  const xa=Math.min(x1,x2), xb=Math.max(x1,x2);
  const ya=Math.min(y1,y2), yb=Math.max(y1,y2);
  for(let y=ya;y<=yb;y++){
    for(let x=xa;x<=xb;x++) setPixel(data,size,x,y,color,1);
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
      if(dx*dx+dy*dy<=r2) setPixel(data,size,x,y,color,alpha==null?1:alpha);
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
  for(let i=-w/2;i<=w/2;i+=0.5){
    for(let j=-t/2;j<=t/2;j+=0.5){
      const cos=Math.SQRT1_2, sin=Math.SQRT1_2;
      setPixel(data,size,cx+i*cos-j*sin,cy+i*sin+j*cos,color,1);
      setPixel(data,size,cx+i*cos+j*sin,cy-i*sin+j*cos,color,1);
    }
  }
}
function drawDivide(data, size, cx, cy, w, color){
  const t = w*0.32;
  fillRect(data,size,cx-w/2,cy-t/4,cx+w/2,cy+t/4,color);
  fillCircle(data,size,cx,cy-w/3,t/1.5,color,1);
  fillCircle(data,size,cx,cy+w/3,t/1.5,color,1);
}
function drawStar(data, size, cx, cy, r, points, color, alpha){
  const verts=[];
  for(let i=0;i<points*2;i++){
    const ang = -Math.PI/2 + i*Math.PI/points;
    const rad = (i%2===0) ? r : r*0.45;
    verts.push([cx+Math.cos(ang)*rad, cy+Math.sin(ang)*rad]);
  }
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
function save(png, p){
  fs.mkdirSync(path.dirname(p), {recursive:true});
  const buf = PNG.sync.write(png);
  fs.writeFileSync(p, buf);
}

// Android launcher icon densities
const STD_SIZES = {
  'mipmap-mdpi': 48,
  'mipmap-hdpi': 72,
  'mipmap-xhdpi': 96,
  'mipmap-xxhdpi': 144,
  'mipmap-xxxhdpi': 192,
};
// Adaptive foreground densities (108x108 base)
const ADAPTIVE_SIZES = {
  'mipmap-mdpi': 108,
  'mipmap-hdpi': 162,
  'mipmap-xhdpi': 216,
  'mipmap-xxhdpi': 324,
  'mipmap-xxxhdpi': 432,
};

async function main(){
  console.log('Starting icon generation...');
  for(const [dir, size] of Object.entries(STD_SIZES)){
    try{
      const ic = makeIcon(size, {adaptive:false});
      save(ic, path.join(RES, dir, 'ic_launcher.png'));
      save(ic, path.join(RES, dir, 'ic_launcher_round.png'));
      console.log('  ', dir, 'ic_launcher.png ('+size+'x'+size+')');
    }catch(e){
      console.error('FAIL', dir, e.message);
      throw e;
    }
  }
  for(const [dir, size] of Object.entries(ADAPTIVE_SIZES)){
    try{
      const ic = makeIcon(size, {adaptive:true});
      save(ic, path.join(RES, dir, 'ic_launcher_foreground.png'));
      console.log('  ', dir, 'ic_launcher_foreground.png ('+size+'x'+size+')');
    }catch(e){
      console.error('FAIL adaptive', dir, e.message);
      throw e;
    }
  }
  // Update color of adaptive icon background
  const colorsXml = path.join(RES, 'values', 'ic_launcher_background.xml');
  if(fs.existsSync(colorsXml)){
    fs.writeFileSync(colorsXml,
      '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#7c3aed</color>\n</resources>\n');
    console.log('   updated ic_launcher_background.xml -> #7c3aed');
  }
  console.log('Done.');
}
main();
