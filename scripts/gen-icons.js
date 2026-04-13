/**
 * Genera public/icons/icon-192.png y public/icons/icon-512.png
 * sin dependencias externas — solo Node.js built-ins (zlib).
 *
 * Diseño: fondo #0F172A · pantalla de monitor #1E293B · acento #7C3AED
 *         prompt >_ en purpura · punto verde "live"
 *
 * Uso: node scripts/gen-icons.js
 */

const zlib = require('zlib');
const fs   = require('fs');
const path = require('path');

// ─── CRC32 (necesario para el formato PNG) ────────────────────────────────────
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = CRC_TABLE[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const dataBuf = Buffer.isBuffer(data) ? data : Buffer.from(data);
  const lenBuf  = Buffer.alloc(4); lenBuf.writeUInt32BE(dataBuf.length);
  const crcBuf  = Buffer.alloc(4); crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, dataBuf])));
  return Buffer.concat([lenBuf, typeBuf, dataBuf, crcBuf]);
}

// ─── PRIMITIVAS DE DIBUJO ────────────────────────────────────────────────────
function makeCanvas(size) {
  const buf = Buffer.alloc(size * size * 4); // RGBA
  return {
    buf, size,
    set(x, y, r, g, b, a = 255) {
      if (x < 0 || x >= size || y < 0 || y >= size) return;
      const i = (y * size + x) * 4;
      buf[i] = r; buf[i+1] = g; buf[i+2] = b; buf[i+3] = a;
    },
    fill(x1, y1, x2, y2, [r, g, b, a = 255]) {
      for (let y = Math.max(0, y1); y < Math.min(size, y2); y++)
        for (let x = Math.max(0, x1); x < Math.min(size, x2); x++)
          this.set(x, y, r, g, b, a);
    },
    circle(cx, cy, radius, [r, g, b, a = 255]) {
      for (let y = cy - radius; y <= cy + radius; y++)
        for (let x = cx - radius; x <= cx + radius; x++)
          if ((x-cx)**2 + (y-cy)**2 <= radius**2) this.set(x, y, r, g, b, a);
    },
    line(x1, y1, x2, y2, [r, g, b, a = 255], thick = 1) {
      const dx = x2 - x1, dy = y2 - y1;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      const half  = Math.floor(thick / 2);
      for (let i = 0; i <= steps; i++) {
        const x = Math.round(x1 + dx * i / steps);
        const y = Math.round(y1 + dy * i / steps);
        for (let oy = -half; oy <= half; oy++)
          for (let ox = -half; ox <= half; ox++)
            this.set(x + ox, y + oy, r, g, b, a);
      }
    },
    roundRect(x1, y1, x2, y2, rx, color) {
      this.fill(x1 + rx, y1, x2 - rx, y2, color);
      this.fill(x1, y1 + rx, x2, y2 - rx, color);
      this.circle(x1 + rx, y1 + rx, rx, color);
      this.circle(x2 - rx, y1 + rx, rx, color);
      this.circle(x1 + rx, y2 - rx, rx, color);
      this.circle(x2 - rx, y2 - rx, rx, color);
    },
  };
}

// ─── DISEÑO DEL ÍCONO (coordenadas en base 192×192) ─────────────────────────
function drawIcon(canvas) {
  const { size } = canvas;
  const S = size / 192; // factor de escala

  const sc  = n => Math.round(n * S);
  const BG    = [0x0F, 0x17, 0x2A];
  const CARD  = [0x1E, 0x29, 0x3B];
  const DARK  = [0x33, 0x41, 0x55];
  const PUR   = [0x7C, 0x3A, 0xED];
  const LPUR  = [0xA7, 0x8B, 0xFA];
  const GREEN = [0x22, 0xC5, 0x5E];

  // Fondo completo
  canvas.fill(0, 0, size, size, BG);

  // Cuerpo del monitor (card oscura)
  canvas.roundRect(sc(28), sc(36), sc(164), sc(134), sc(10), CARD);

  // Barra superior del monitor (acento purpura)
  canvas.fill(sc(28), sc(36), sc(164), sc(50), PUR);
  // esquinas redondeadas de la barra
  canvas.circle(sc(38),  sc(46), sc(10), PUR);
  canvas.circle(sc(154), sc(46), sc(10), PUR);

  // Tres puntitos de la barra tipo macOS
  canvas.circle(sc(42),  sc(43), sc(4), [0xFF, 0x6B, 0x6B]);
  canvas.circle(sc(56),  sc(43), sc(4), [0xFF, 0xD9, 0x3D]);
  canvas.circle(sc(70),  sc(43), sc(4), GREEN);

  // Líneas de "código" dentro de la pantalla
  canvas.roundRect(sc(40), sc(62), sc(120), sc(70), sc(3), DARK);
  canvas.roundRect(sc(40), sc(62), sc(88),  sc(70), sc(3), LPUR);

  canvas.roundRect(sc(40), sc(78), sc(130), sc(86), sc(3), DARK);
  canvas.roundRect(sc(40), sc(94), sc(100), sc(102), sc(3), DARK);

  // Prompt  >_
  const thick = Math.max(2, sc(5));
  canvas.line(sc(40), sc(108), sc(55), sc(119), PUR, thick);
  canvas.line(sc(55), sc(119), sc(40), sc(130), PUR, thick);
  canvas.fill(sc(60), sc(126), sc(96), sc(131), LPUR);

  // Punto verde "live" (esquina superior derecha del monitor)
  canvas.circle(sc(152), sc(43), sc(5), GREEN);

  // Soporte / pie del monitor
  canvas.fill(sc(86), sc(134), sc(106), sc(152), DARK);
  canvas.fill(sc(68), sc(150), sc(124), sc(158), DARK);
}

// ─── ENCODER PNG ─────────────────────────────────────────────────────────────
function encodePNG(canvas) {
  const { buf, size } = canvas;

  // Convertir RGBA → scanlines RGB con filter byte 0
  const scanlines = Buffer.alloc(size * (size * 3 + 1));
  for (let y = 0; y < size; y++) {
    scanlines[y * (size * 3 + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 4;
      const dst = y * (size * 3 + 1) + 1 + x * 3;
      scanlines[dst]   = buf[src];
      scanlines[dst+1] = buf[src+1];
      scanlines[dst+2] = buf[src+2];
    }
  }

  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB
  // compression=0, filter=0, interlace=0 (ya son 0)

  const compressed = zlib.deflateSync(scanlines, { level: 9 });

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), // PNG signature
    pngChunk('IHDR', ihdrData),
    pngChunk('IDAT', compressed),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
const outDir = path.join(__dirname, '../public/icons');
fs.mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const canvas = makeCanvas(size);
  drawIcon(canvas);
  const png = encodePNG(canvas);
  const outPath = path.join(outDir, `icon-${size}.png`);
  fs.writeFileSync(outPath, png);
  console.log(`✓ icon-${size}.png  (${(png.length / 1024).toFixed(1)} KB)`);
}
console.log('Íconos generados en public/icons/');
